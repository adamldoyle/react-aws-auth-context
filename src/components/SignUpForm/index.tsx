import { Link, Grid, Box } from '@material-ui/core';
import * as Yup from 'yup';
import { InputField } from '../InputField';
import { CheckboxField } from '../CheckboxField';
import * as authActions from '../../contexts/AuthContext/actions';
import { AuthForm } from '../AuthForm';
import React from 'react';

const Schema = Yup.object({
  firstName: Yup.string().default(''),
  lastName: Yup.string().default(''),
  email: Yup.string()
    .default('')
    .required('Email is required')
    .email('Invalid email syntax'),
  password: Yup.string().default('').required('Password is required'),
  passwordConfirm: Yup.string()
    .default('')
    .required('Password confirmation is required'),
  allowMarketing: Yup.boolean().default(false),
});

const formDefaults = Schema.getDefault();
export type SignUpValues = typeof formDefaults;

export interface SignUpFormProps {
  email: string;
  onSubmit: (values: SignUpValues) => Promise<void>;
  dispatch: React.Dispatch<authActions.IAuthAction>;
}

export function SignUpForm({
  email,
  onSubmit,
  dispatch,
}: SignUpFormProps): JSX.Element {
  return (
    <AuthForm
      title="Sign up"
      Schema={Schema}
      formDefaults={{ ...formDefaults, email: email ?? '' }}
      submitLabel="Sign up"
      onSubmit={onSubmit}
      validate={(values) => {
        if (values.password && values.password !== values.passwordConfirm) {
          return { passwordConfirm: 'Password confirmation must match' };
        }
      }}
      formBody={
        <>
          <Grid item xs={12} sm={6}>
            <InputField
              label="First name"
              field="firstName"
              autoComplete="given-name"
              variant="outlined"
              fullWidth
              autoFocus
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputField
              label="Last name"
              field="lastName"
              autoComplete="family-name"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <InputField
              label="Email"
              field="email"
              autoComplete="email"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <InputField
              label="Password"
              field="password"
              type="password"
              autoComplete="new-password"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <InputField
              label="Password (confirm)"
              field="passwordConfirm"
              type="password"
              autoComplete="new-password"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <CheckboxField
              label="I want to receive marketing promotions and updates via email."
              field="allowMarketing"
            />
          </Grid>
        </>
      }
      actions={(values) => (
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <Link
            component="button"
            variant="body2"
            onClick={(evt: React.MouseEvent) => {
              evt.preventDefault();
              return dispatch(
                authActions.actions.switchMode(
                  authActions.AuthMode.SIGN_IN,
                  values.email
                )
              );
            }}
          >
            Already have an account? Sign in
          </Link>
        </Box>
      )}
    />
  );
}
