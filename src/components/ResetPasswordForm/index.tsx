import { Grid, Typography } from '@material-ui/core';
import * as Yup from 'yup';
import { InputField } from '../InputField';
import { AuthForm } from '../AuthForm';

const Schema = Yup.object({
  code: Yup.string().default('').required('Code is required'),
  password: Yup.string().default('').required('Password is required'),
  passwordConfirm: Yup.string()
    .default('')
    .required('Password confirmation is required'),
});

const formDefaults = Schema.getDefault();
export type ResetPasswordValues = typeof formDefaults;

export interface ResetPasswordFormProps {
  email: string;
  onSubmit: (values: ResetPasswordValues) => Promise<void>;
}

export function ResetPasswordForm({
  email,
  onSubmit,
}: ResetPasswordFormProps): JSX.Element {
  return (
    <AuthForm
      title="Change password"
      Schema={Schema}
      formDefaults={formDefaults}
      formDescription="A reset password code was sent to your email. Enter it and a new password to change your password."
      submitLabel="Change password"
      onSubmit={onSubmit}
      validate={(values) => {
        if (values.password && values.password !== values.passwordConfirm) {
          return { passwordConfirm: 'Password confirmation must match' };
        }
      }}
      formBody={
        <>
          <Grid item xs={12}>
            <Typography>Email: {email}</Typography>
          </Grid>
          <Grid item xs={12}>
            <InputField
              label="Code"
              field="code"
              autoComplete="one-time-code"
              variant="outlined"
              fullWidth
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
            <InputField
              label="New password"
              field="password"
              type="password"
              autoComplete="new-password"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <InputField
              label="New password (confirm)"
              field="passwordConfirm"
              type="password"
              autoComplete="new-password"
              variant="outlined"
              fullWidth
            />
          </Grid>
        </>
      }
    />
  );
}
