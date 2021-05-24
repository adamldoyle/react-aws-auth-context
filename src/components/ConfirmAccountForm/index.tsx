import { Link, Grid, Typography, Box } from '@material-ui/core';
import * as Yup from 'yup';
import { InputField } from '../InputField';
import { AuthForm } from '../AuthForm';

const Schema = Yup.object({
  code: Yup.string().default('').required('Code is required'),
});

const formDefaults = Schema.getDefault();
export type ConfirmAccountValues = typeof formDefaults;

export interface ConfirmAccountFormProps {
  email: string;
  onSubmit: (values: ConfirmAccountValues) => Promise<void>;
  onResendCode: () => Promise<void>;
}

export function ConfirmAccountForm({
  email,
  onSubmit,
  onResendCode,
}: ConfirmAccountFormProps): JSX.Element {
  return (
    <AuthForm
      title="Confirm account"
      Schema={Schema}
      formDefaults={formDefaults}
      formDescription="A confirmation code was sent to your email. Enter it to confirm your new account."
      submitLabel="Confirm account"
      onSubmit={onSubmit}
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
        </>
      }
      actions={() => (
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <Link
            component="button"
            variant="body2"
            onClick={(evt: React.MouseEvent) => {
              evt.preventDefault();
              return onResendCode();
            }}
          >
            Don&#39;t have a code? Resend email
          </Link>
        </Box>
      )}
    />
  );
}
