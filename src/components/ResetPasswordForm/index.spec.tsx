import { render, fireEvent, waitFor } from '@testing-library/react';
import { changeInputValue } from '../AuthForm/formUtilities.spec';
import { ResetPasswordForm } from './';

describe('ResetPasswordForm', () => {
  const renderComponent = (email = '', onSubmit = jest.fn()) => {
    return render(<ResetPasswordForm email={email} onSubmit={onSubmit} />);
  };

  it('submits values from form', async () => {
    const onSubmit = jest.fn();
    const rendered = renderComponent('testEmail@gmail.com', onSubmit);
    expect(rendered.getByText('Email: testEmail@gmail.com')).toBeDefined();
    changeInputValue(rendered, 'Code', '12345');
    changeInputValue(rendered, 'New password', 'testPassword');
    changeInputValue(rendered, 'New password (confirm)', 'testPassword');
    fireEvent.click(rendered.getByRole('button', { name: 'Change password' }));
    await waitFor(() => expect(onSubmit).toBeCalled());
    expect(onSubmit).toBeCalledWith({
      code: '12345',
      password: 'testPassword',
      passwordConfirm: 'testPassword',
    });
  });

  it('requires all fields', async () => {
    const onSubmit = jest.fn();
    const rendered = renderComponent('testEmail@gmail.com', onSubmit);
    fireEvent.click(rendered.getByRole('button', { name: 'Change password' }));
    await waitFor(() =>
      expect(rendered.queryByText('Code is required')).not.toBeNull()
    );
    expect(rendered.queryByText('Password is required')).not.toBeNull();
    expect(
      rendered.queryByText('Password confirmation is required')
    ).not.toBeNull();
    expect(onSubmit).not.toBeCalled();
  });

  it('requires password confirmation to match', async () => {
    const onSubmit = jest.fn();
    const rendered = renderComponent('testEmail@gmail.com', onSubmit);
    changeInputValue(rendered, 'Code', '12345');
    changeInputValue(rendered, 'New password', 'testPassword');
    changeInputValue(rendered, 'New password (confirm)', 'testPassword2');
    fireEvent.click(rendered.getByRole('button', { name: 'Change password' }));
    await waitFor(() =>
      expect(
        rendered.queryByText('Password confirmation must match')
      ).not.toBeNull()
    );
    expect(onSubmit).not.toBeCalled();
  });

  it('shows submission errors', async () => {
    const onSubmit = jest.fn().mockRejectedValue(new Error('testError'));
    const rendered = renderComponent('testEmail@gmailcom', onSubmit);
    changeInputValue(rendered, 'Code', '12345');
    changeInputValue(rendered, 'New password', 'testPassword');
    changeInputValue(rendered, 'New password (confirm)', 'testPassword');
    fireEvent.click(rendered.getByRole('button', { name: 'Change password' }));
    expect(onSubmit).not.toBeCalled();
    await waitFor(() =>
      expect(rendered.queryByText('testError')).not.toBeNull()
    );
  });
});
