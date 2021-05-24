import { render, fireEvent, waitFor } from '@testing-library/react';
import { changeInputValue } from '../AuthForm/formUtilities.spec';
import { authActions } from '../../contexts';
import { ForgotPasswordForm } from './';

describe('ForgotPasswordForm', () => {
  const renderComponent = (
    email = undefined,
    onSubmit = jest.fn(),
    dispatch = jest.fn()
  ) => {
    return render(
      <ForgotPasswordForm
        email={email}
        onSubmit={onSubmit}
        dispatch={dispatch}
      />
    );
  };

  it('submits values from form', async () => {
    const onSubmit = jest.fn();
    const rendered = renderComponent(undefined, onSubmit);
    changeInputValue(rendered, 'Email', 'testEmail@gmail.com');
    fireEvent.click(rendered.getByRole('button', { name: 'Reset password' }));
    await waitFor(() => expect(onSubmit).toBeCalled());
    expect(onSubmit).toBeCalledWith({ email: 'testEmail@gmail.com' });
  });

  it('requires all fields', async () => {
    const onSubmit = jest.fn();
    const rendered = renderComponent(undefined, onSubmit);
    fireEvent.click(rendered.getByRole('button', { name: 'Reset password' }));
    await waitFor(() =>
      expect(rendered.queryByText('Email is required')).not.toBeNull()
    );
    expect(onSubmit).not.toBeCalled();
  });

  it('supports using default email value', async () => {
    const onSubmit = jest.fn();
    const rendered = renderComponent('defaultEmail@gmail.com', onSubmit);
    fireEvent.click(rendered.getByRole('button', { name: 'Reset password' }));
    await waitFor(() => expect(onSubmit).toBeCalled());
    expect(onSubmit).toBeCalledWith({ email: 'defaultEmail@gmail.com' });
  });

  it('shows submission errors', async () => {
    const onSubmit = jest.fn().mockRejectedValue(new Error('testError'));
    const rendered = renderComponent('defaultEmail@gmail.com', onSubmit);
    fireEvent.click(rendered.getByRole('button', { name: 'Reset password' }));
    expect(onSubmit).not.toBeCalled();
    await waitFor(() =>
      expect(rendered.queryByText('testError')).not.toBeNull()
    );
  });

  it('provides button to change to sign in', () => {
    const dispatch = jest.fn();
    const rendered = renderComponent(undefined, undefined, dispatch);
    changeInputValue(rendered, 'Email', 'testEmail@gmail.com');
    fireEvent.click(
      rendered.getByRole('button', { name: 'Remember your password? Sign in' })
    );
    expect(dispatch).toBeCalledWith(
      authActions.actions.switchMode(
        authActions.AuthMode.SIGN_IN,
        'testEmail@gmail.com'
      )
    );
  });

  it('provides button to change to sign up', () => {
    const dispatch = jest.fn();
    const rendered = renderComponent(undefined, undefined, dispatch);
    changeInputValue(rendered, 'Email', 'testEmail@gmail.com');
    fireEvent.click(
      rendered.getByRole('button', { name: "Don't have an account? Sign up" })
    );
    expect(dispatch).toBeCalledWith(
      authActions.actions.switchMode(
        authActions.AuthMode.SIGN_UP,
        'testEmail@gmail.com'
      )
    );
  });
});
