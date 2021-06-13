import { render, fireEvent, waitFor } from '@testing-library/react';
import { changeInputValue } from '../AuthForm/formUtilities.spec';
import * as authActions from '../../contexts/AuthContext/actions';
import { SignUpForm } from './';

describe('SignUpForm', () => {
  const renderComponent = (
    email = undefined,
    onSubmit = jest.fn(),
    dispatch = jest.fn()
  ) => {
    return render(
      <SignUpForm email={email} onSubmit={onSubmit} dispatch={dispatch} />
    );
  };

  it('submits values from form', async () => {
    const onSubmit = jest.fn();
    const rendered = renderComponent(undefined, onSubmit);
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
    await waitFor(() => expect(onSubmit).toBeCalled());
    expect(onSubmit).toBeCalledWith({
      firstName: 'testFirst',
      lastName: 'testLast',
      email: 'testEmail@gmail.com',
      password: 'testPassword',
      passwordConfirm: 'testPassword',
      allowMarketing: true,
    });
  });

  it('supports using default email value', async () => {
    const onSubmit = jest.fn();
    const rendered = renderComponent('defaultEmail@gmail.com', onSubmit);
    changeInputValue(rendered, 'Password', 'testPassword');
    changeInputValue(rendered, 'Password (confirm)', 'testPassword');
    fireEvent.click(rendered.getByRole('button', { name: 'Sign up' }));
    await waitFor(() => expect(onSubmit).toBeCalled());
    expect(onSubmit).toBeCalledWith({
      firstName: '',
      lastName: '',
      email: 'defaultEmail@gmail.com',
      password: 'testPassword',
      passwordConfirm: 'testPassword',
      allowMarketing: false,
    });
  });

  it('requires some fields', async () => {
    const onSubmit = jest.fn();
    const rendered = renderComponent(undefined, onSubmit);
    fireEvent.click(rendered.getByRole('button', { name: 'Sign up' }));
    await waitFor(() =>
      expect(rendered.queryByText('Email is required')).not.toBeNull()
    );
    expect(rendered.queryByText('First name is required')).toBeNull();
    expect(rendered.queryByText('Last name is required')).toBeNull();
    expect(rendered.queryByText('Password is required')).not.toBeNull();
    expect(
      rendered.queryByText('Password confirmation is required')
    ).not.toBeNull();
    expect(onSubmit).not.toBeCalled();
  });

  it('requires password confirmation to match', async () => {
    const onSubmit = jest.fn();
    const rendered = renderComponent('testEmail@gmail.com', onSubmit);
    changeInputValue(rendered, 'Password', 'testPassword');
    changeInputValue(rendered, 'Password (confirm)', 'testPassword2');
    fireEvent.click(rendered.getByRole('button', { name: 'Sign up' }));
    await waitFor(() =>
      expect(
        rendered.queryByText('Password confirmation must match')
      ).not.toBeNull()
    );
    expect(onSubmit).not.toBeCalled();
  });

  it('shows submission errors', async () => {
    const onSubmit = jest.fn().mockRejectedValue(new Error('testError'));
    const rendered = renderComponent('testEmail@gmail.com', onSubmit);
    changeInputValue(rendered, 'First name', 'testFirst');
    changeInputValue(rendered, 'Last name', 'testLast');
    changeInputValue(rendered, 'Password', 'testPassword');
    changeInputValue(rendered, 'Password (confirm)', 'testPassword');
    fireEvent.click(rendered.getByRole('button', { name: 'Sign up' }));
    expect(onSubmit).not.toBeCalled();
    await waitFor(() =>
      expect(rendered.queryByText('testError')).not.toBeNull()
    );
  });

  it('provides button to change to forgot password', () => {
    const dispatch = jest.fn();
    const rendered = renderComponent(undefined, undefined, dispatch);
    changeInputValue(rendered, 'Email', 'testEmail@gmail.com');
    fireEvent.click(
      rendered.getByRole('button', { name: 'Already have an account? Sign in' })
    );
    expect(dispatch).toBeCalledWith(
      authActions.actions.switchMode(
        authActions.AuthMode.SIGN_IN,
        'testEmail@gmail.com'
      )
    );
  });
});
