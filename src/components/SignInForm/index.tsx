import { Link, Box, Grid } from '@material-ui/core';
import * as Yup from 'yup';
import { InputField } from '../InputField';
import * as authActions from '../../contexts/AuthContext/actions';
import { AuthForm } from '../AuthForm';

const Schema = Yup.object({
  email: Yup.string()
    .default('')
    .required('Email is required')
    .email('Invalid email syntax'),
  password: Yup.string().default('').required('Password is required'),
});

const formDefaults = Schema.getDefault();
export type SignInValues = typeof formDefaults;

export interface SignInFormProps {
  email: string;
  onSubmit: (values: SignInValues) => Promise<void>;
  dispatch: React.Dispatch<authActions.IAuthAction>;
}

export function SignInForm({
  email,
  onSubmit,
  dispatch,
}: SignInFormProps): JSX.Element {
  return (
    <AuthForm
      title="Sign in"
      Schema={Schema}
      formDefaults={{ ...formDefaults, email: email ?? '' }}
      submitLabel="Sign in"
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
          <Grid item xs={12}>
            <InputField
              label="Password"
              field="password"
              type="password"
              autoComplete="current-password"
              variant="outlined"
              fullWidth
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
                  authActions.AuthMode.FORGOT_PASSWORD,
                  values.email
                )
              );
            }}
          >
            Forgot your password? Reset it
          </Link>
        </Box>
      )}
    />
  );
}
