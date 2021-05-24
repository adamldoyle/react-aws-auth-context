import { render, fireEvent, waitFor } from '@testing-library/react';
import { changeInputValue } from '../AuthForm/formUtilities.spec';
import { ConfirmAccountForm } from './';

describe('ConfirmAccountForm', () => {
  const renderComponent = (onSubmit = jest.fn(), onResendCode = jest.fn()) => {
    return render(
      <ConfirmAccountForm
        email="testEmail@gmail.com"
        onSubmit={onSubmit}
        onResendCode={onResendCode}
      />
    );
  };

  it('displays the email', () => {
    const rendered = renderComponent();
    expect(rendered.getByText('Email: testEmail@gmail.com'));
  });

  it('submits values from form', async () => {
    const onSubmit = jest.fn();
    const rendered = renderComponent(onSubmit);
    changeInputValue(rendered, 'Code', '12345');
    fireEvent.click(rendered.getByRole('button', { name: 'Confirm account' }));
    await waitFor(() => expect(onSubmit).toBeCalled());
    expect(onSubmit).toBeCalledWith({ code: '12345' });
  });

  it('requires all fields', async () => {
    const onSubmit = jest.fn();
    const rendered = renderComponent(onSubmit);
    fireEvent.click(rendered.getByRole('button', { name: 'Confirm account' }));
    await waitFor(() =>
      expect(rendered.queryByText('Code is required')).not.toBeNull()
    );
    expect(onSubmit).not.toBeCalled();
  });

  it('shows submission errors', async () => {
    const onSubmit = jest.fn().mockRejectedValue(new Error('testError'));
    const rendered = renderComponent(onSubmit);
    changeInputValue(rendered, 'Code', '12345');
    fireEvent.click(rendered.getByRole('button', { name: 'Confirm account' }));
    expect(onSubmit).not.toBeCalled();
    await waitFor(() =>
      expect(rendered.queryByText('testError')).not.toBeNull()
    );
  });

  it('provides button to resend code', () => {
    const onResendCode = jest.fn();
    const rendered = renderComponent(undefined, onResendCode);
    fireEvent.click(
      rendered.getByRole('button', { name: "Don't have a code? Resend email" })
    );
    expect(onResendCode).toBeCalled();
  });
});
