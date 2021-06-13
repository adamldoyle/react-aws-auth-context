import { Link, Grid, Box } from '@material-ui/core';
import * as Yup from 'yup';
import { InputField } from '../InputField';
import * as authActions from '../../contexts/AuthContext/actions';
import { AuthForm } from '../AuthForm';

const Schema = Yup.object({
  email: Yup.string()
    .default('')
    .required('Email is required')
    .email('Invalid email syntax'),
});

const formDefaults = Schema.getDefault();
export type ForgotPasswordValues = typeof formDefaults;

export interface ForgotPasswordFormProps {
  email: string;
  onSubmit: (values: ForgotPasswordValues) => Promise<void>;
  dispatch: React.Dispatch<authActions.IAuthAction>;
}

export function ForgotPasswordForm({
  email,
  onSubmit,
  dispatch,
}: ForgotPasswordFormProps): JSX.Element {
  return (
    <AuthForm
      title="Reset password"
      Schema={Schema}
      formDefaults={{ ...formDefaults, email: email ?? '' }}
      submitLabel="Reset password"
      onSubmit={onSubmit}
      formBody={
        <>
          <Grid item xs={12}>
            <InputField
              label="Email"
              field="email"
              autoComplete="email"
              variant="outlined"
              fullWidth
              autoFocus
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
                  authActions.AuthMode.SIGN_UP,
                  values.email
                )
              );
            }}
          >
            Don&#39;t have an account? Sign up
          </Link>
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
            Remember your password? Sign in
          </Link>
        </Box>
      )}
    />
  );
}
