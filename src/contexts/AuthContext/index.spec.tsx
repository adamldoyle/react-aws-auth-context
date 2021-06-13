import { render, waitFor, fireEvent } from '@testing-library/react';
import { Auth } from 'aws-amplify';
import { changeInputValue } from '../../components/AuthForm/formUtilities.spec';
import { AuthContext, AuthContextProvider } from './';

jest.useFakeTimers();
jest.mock('aws-amplify');

const buildSession = (
  email = 'testEmail@gmail.com',
  firstName = 'Joe',
  lastName = 'Schmo',
  allowMarketing = true,
  idJwtToken = 'idJwtToken',
  accessJwtToken = 'accessJwtToken'
) => ({
  getIdToken: () => ({
    payload: {
      email,
      given_name: firstName,
      family_name: lastName,
      'custom:allow_marketing': allowMarketing,
    },
    getJwtToken: () => idJwtToken,
  }),
  getAccessToken: () => ({
    getJwtToken: () => accessJwtToken,
  }),
});

describe('AuthContext', () => {
  describe('AuthContextProvider', () => {
    let oldWindowLocation;

    beforeEach(() => {
      oldWindowLocation = window.location;
      delete window.location;
      window.location = {
        reload: jest.fn(),
      } as any;
    });

    afterEach(() => {
      window.location = oldWindowLocation;
    });

    const renderComponent = (sessionPingDelay = undefined) => {
      return render(
        <AuthContextProvider sessionPingDelay={sessionPingDelay}>
          <AuthContext.Consumer>
            {({ session, signOut }) => (
              <>
                <span>Authenticated</span>
                <span>ID: {session.getIdToken?.().getJwtToken?.()}</span>
                <span>
                  Access: {session.getAccessToken?.().getJwtToken?.()}
                </span>
                <button type="button" onClick={signOut}>
                  Sign out
                </button>
              </>
            )}
          </AuthContext.Consumer>
        </AuthContextProvider>
      );
    };

    const renderNoSession = async () => {
      (Auth.currentSession as jest.Mock).mockRejectedValue(
        new Error('No session')
      );
      const rendered = renderComponent();
      await waitFor(() =>
        expect(rendered.queryAllByText('Sign in').length).toEqual(2)
      );
      return rendered;
    };

    it('shows sign in screen initially when no session', async () => {
      const rendered = await renderNoSession();
      await waitFor(() =>
        expect(rendered.queryAllByText('Sign in').length).toEqual(2)
      );
    });

    it('allows switching to sign up from sign in', async () => {
      const rendered = await renderNoSession();
      fireEvent.click(
        rendered.getByRole('button', {
          name: "Don't have an account? Sign up",
        })
      );
      expect(rendered.queryAllByText('Sign up').length).toEqual(2);
    });

    it('allows switching to forgot password from sign in', async () => {
      const rendered = await renderNoSession();
      fireEvent.click(
        rendered.getByRole('button', {
          name: 'Forgot your password? Reset it',
        })
      );
      expect(rendered.queryAllByText('Reset password').length).toEqual(2);
    });

    it('allows switching to sign in from sign up', async () => {
      const rendered = await renderNoSession();
      fireEvent.click(
        rendered.getByRole('button', {
          name: "Don't have an account? Sign up",
        })
      );
      expect(rendered.queryAllByText('Sign up').length).toEqual(2);
      fireEvent.click(
        rendered.getByRole('button', {
          name: 'Already have an account? Sign in',
        })
      );
      expect(rendered.queryAllByText('Sign in').length).toEqual(2);
    });

    it('allows switching to sign in from forgot password', async () => {
      const rendered = await renderNoSession();
      fireEvent.click(
        rendered.getByRole('button', {
          name: 'Forgot your password? Reset it',
        })
      );
      expect(rendered.queryAllByText('Reset password').length).toEqual(2);
      fireEvent.click(
        rendered.getByRole('button', {
          name: 'Remember your password? Sign in',
        })
      );
      expect(rendered.queryAllByText('Sign in').length).toEqual(2);
    });

    it('allows switching to sign up from forgot password', async () => {
      const rendered = await renderNoSession();
      fireEvent.click(
        rendered.getByRole('button', {
          name: 'Forgot your password? Reset it',
        })
      );
      expect(rendered.queryAllByText('Reset password').length).toEqual(2);
      fireEvent.click(
        rendered.getByRole('button', {
          name: "Don't have an account? Sign up",
        })
      );
      expect(rendered.queryAllByText('Sign up').length).toEqual(2);
    });

    it('supports signing in', async () => {
      (Auth.signIn as jest.Mock).mockResolvedValue({ signInUserSession: {} });
      const rendered = await renderNoSession();
      (Auth.currentSession as jest.Mock).mockResolvedValue(buildSession());
      changeInputValue(rendered, 'Email', 'testEmail@gmail.com');
      changeInputValue(rendered, 'Password', 'testPassword');
      fireEvent.click(rendered.getByRole('button', { name: 'Sign in' }));
      await waitFor(() =>
        expect(Auth.signIn).toBeCalledWith(
          'testEmail@gmail.com',
          'testPassword'
        )
      );
      expect(rendered.queryByText('Authenticated')).not.toBeNull();
    });

    it('redirects to confirm account when signing in to non confirmed account', async () => {
      (Auth.signIn as jest.Mock).mockRejectedValue({
        code: 'UserNotConfirmedException',
      });
      const rendered = await renderNoSession();
      changeInputValue(rendered, 'Email', 'testEmail@gmail.com');
      changeInputValue(rendered, 'Password', 'testPassword');
      fireEvent.click(rendered.getByRole('button', { name: 'Sign in' }));
      await waitFor(() =>
        expect(Auth.signIn).toBeCalledWith(
          'testEmail@gmail.com',
          'testPassword'
        )
      );
      expect(rendered.queryAllByText('Confirm account').length).toEqual(2);
    });

    it('passes back other errors when signing in', async () => {
      (Auth.signIn as jest.Mock).mockRejectedValue(new Error('testError'));
      const rendered = await renderNoSession();
      changeInputValue(rendered, 'Email', 'testEmail@gmail.com');
      changeInputValue(rendered, 'Password', 'testPassword');
      fireEvent.click(rendered.getByRole('button', { name: 'Sign in' }));
      await waitFor(() =>
        expect(Auth.signIn).toBeCalledWith(
          'testEmail@gmail.com',
          'testPassword'
        )
      );
      expect(rendered.queryAllByText('Sign in').length).toEqual(2);
      expect(rendered.getByText('testError')).toBeDefined();
    });

    it('supports signing up', async () => {
      (Auth.signUp as jest.Mock).mockResolvedValue({ userConfirmed: false });
      const rendered = await renderNoSession();
      fireEvent.click(
        rendered.getByRole('button', {
          name: "Don't have an account? Sign up",
        })
      );
      changeInputValue(rendered, 'First name', 'testFirst');
      changeInputValue(rendered, 'Last name', 'testLast');
      changeInputValue(rendered, 'Email', 'testEmail@gmail.com');
      changeInputValue(rendered, 'Password', 'testPassword');
      changeInputValue(rendered, 'Password (confirm)', 'testPassword');
      fireEvent.click(
        rendered.getByLabelText(
          'I want to receive marketing promotions and updates via email.'
        )
      );
      fireEvent.click(rendered.getByRole('button', { name: 'Sign up' }));
      await waitFor(() =>
        expect(Auth.signUp).toBeCalledWith({
          username: 'testEmail@gmail.com',
          password: 'testPassword',
          attributes: {
            email: 'testEmail@gmail.com',
            given_name: 'testFirst',
            family_name: 'testLast',
            'custom:allow_marketing': 'true',
          },
        })
      );
      expect(rendered.queryAllByText('Confirm account').length).toEqual(2);
    });

    it('jumps to sign in after sign up if confirmation not required', async () => {
      (Auth.signUp as jest.Mock).mockResolvedValue({ userConfirmed: true });
      const rendered = await renderNoSession();
      fireEvent.click(
        rendered.getByRole('button', {
          name: "Don't have an account? Sign up",
        })
      );
      changeInputValue(rendered, 'Email', 'testEmail@gmail.com');
      changeInputValue(rendered, 'Password', 'testPassword');
      changeInputValue(rendered, 'Password (confirm)', 'testPassword');
      fireEvent.click(rendered.getByRole('button', { name: 'Sign up' }));
      await waitFor(() =>
        expect(Auth.signUp).toBeCalledWith({
          username: 'testEmail@gmail.com',
          password: 'testPassword',
          attributes: {
            email: 'testEmail@gmail.com',
            given_name: '',
            family_name: '',
            'custom:allow_marketing': 'false',
          },
        })
      );
      expect(rendered.queryAllByText('Sign in').length).toEqual(2);
    });

    it('supports reset password', async () => {
      (Auth.forgotPassword as jest.Mock).mockResolvedValue({});
      const rendered = await renderNoSession();
      fireEvent.click(
        rendered.getByRole('button', {
          name: 'Forgot your password? Reset it',
        })
      );
      changeInputValue(rendered, 'Email', 'testEmail@gmail.com');
      fireEvent.click(rendered.getByRole('button', { name: 'Reset password' }));
      await waitFor(() =>
        expect(Auth.forgotPassword).toBeCalledWith('testEmail@gmail.com')
      );
      expect(rendered.queryAllByText('Change password').length).toEqual(2);
      changeInputValue(rendered, 'Code', '12345');
      changeInputValue(rendered, 'New password', 'testPassword');
      changeInputValue(rendered, 'New password (confirm)', 'testPassword');
      fireEvent.click(
        rendered.getByRole('button', { name: 'Change password' })
      );
      await waitFor(() =>
        expect(Auth.forgotPasswordSubmit).toBeCalledWith(
          'testEmail@gmail.com',
          '12345',
          'testPassword'
        )
      );
      expect(rendered.queryAllByText('Sign in').length).toEqual(2);
    });

    it('redirects to confirm account if resetting password on unconfirmed account', async () => {
      (Auth.forgotPassword as jest.Mock).mockRejectedValue({
        code: 'InvalidParameterException',
      });
      const rendered = await renderNoSession();
      fireEvent.click(
        rendered.getByRole('button', {
          name: 'Forgot your password? Reset it',
        })
      );
      changeInputValue(rendered, 'Email', 'testEmail@gmail.com');
      fireEvent.click(rendered.getByRole('button', { name: 'Reset password' }));
      await waitFor(() =>
        expect(rendered.queryAllByText('Confirm account').length).toEqual(2)
      );
    });

    it('passes back other errors when resetting password', async () => {
      (Auth.forgotPassword as jest.Mock).mockRejectedValue(
        new Error('testError')
      );
      const rendered = await renderNoSession();
      fireEvent.click(
        rendered.getByRole('button', {
          name: 'Forgot your password? Reset it',
        })
      );
      changeInputValue(rendered, 'Email', 'testEmail@gmail.com');
      fireEvent.click(rendered.getByRole('button', { name: 'Reset password' }));
      await waitFor(() =>
        expect(rendered.queryByText('testError')).not.toBeNull()
      );
    });

    it('supports confirming account', async () => {
      (Auth.signIn as jest.Mock).mockRejectedValue({
        code: 'UserNotConfirmedException',
      });
      const rendered = await renderNoSession();
      changeInputValue(rendered, 'Email', 'testEmail@gmail.com');
      changeInputValue(rendered, 'Password', 'testPassword');
      fireEvent.click(rendered.getByRole('button', { name: 'Sign in' }));
      await waitFor(() =>
        expect(Auth.signIn).toBeCalledWith(
          'testEmail@gmail.com',
          'testPassword'
        )
      );
      expect(rendered.queryAllByText('Confirm account').length).toEqual(2);
      changeInputValue(rendered, 'Code', '12345');
      fireEvent.click(
        rendered.getByRole('button', { name: 'Confirm account' })
      );
      await waitFor(() =>
        expect(Auth.confirmSignUp).toBeCalledWith(
          'testEmail@gmail.com',
          '12345'
        )
      );
      expect(rendered.queryAllByText('Sign in').length).toEqual(2);
    });

    it('supports resending code', async () => {
      (Auth.signIn as jest.Mock).mockRejectedValue({
        code: 'UserNotConfirmedException',
      });
      const rendered = await renderNoSession();
      changeInputValue(rendered, 'Email', 'testEmail@gmail.com');
      changeInputValue(rendered, 'Password', 'testPassword');
      fireEvent.click(rendered.getByRole('button', { name: 'Sign in' }));
      await waitFor(() =>
        expect(Auth.signIn).toBeCalledWith(
          'testEmail@gmail.com',
          'testPassword'
        )
      );
      expect(rendered.queryAllByText('Confirm account').length).toEqual(2);
      fireEvent.click(
        rendered.getByRole('button', {
          name: "Don't have a code? Resend email",
        })
      );
      await waitFor(() =>
        expect(Auth.resendSignUp).toBeCalledWith('testEmail@gmail.com')
      );
    });

    it('renders children if already signed in', async () => {
      (Auth.currentSession as jest.Mock).mockResolvedValue(buildSession());
      const rendered = renderComponent();
      await waitFor(() =>
        expect(rendered.queryByText('Authenticated')).not.toBeNull()
      );
    });

    it('keeps session up to date if sessionPingDelay provided', async () => {
      (Auth.currentSession as jest.Mock).mockResolvedValue(
        buildSession(
          undefined,
          undefined,
          undefined,
          undefined,
          'idToken1',
          'accessToken1'
        )
      );
      const rendered = renderComponent(1);
      await waitFor(() =>
        expect(rendered.queryByText('ID: idToken1')).not.toBeNull()
      );
      expect(rendered.queryByText('Access: accessToken1')).not.toBeNull();
      (Auth.currentSession as jest.Mock).mockResolvedValue(
        buildSession(
          undefined,
          undefined,
          undefined,
          undefined,
          'idToken2',
          'accessToken2'
        )
      );
      jest.runAllTimers();
      await waitFor(() =>
        expect(rendered.queryByText('ID: idToken2')).not.toBeNull()
      );
      expect(rendered.queryByText('Access: accessToken2')).not.toBeNull();
    });

    it('handles signing out', async () => {
      (Auth.currentSession as jest.Mock).mockResolvedValue(buildSession());
      const rendered = renderComponent();
      await waitFor(() =>
        expect(rendered.queryByText('Authenticated')).not.toBeNull()
      );
      fireEvent.click(rendered.getByRole('button', { name: 'Sign out' }));
      jest.runAllTimers();
      expect(Auth.signOut).toBeCalled();
    });
  });
});
