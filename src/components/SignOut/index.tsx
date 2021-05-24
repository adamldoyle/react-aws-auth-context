import { useEffect } from 'react';
import { Grid, Typography } from '@material-ui/core';

export interface SignOutProps {
  onSignOut: () => Promise<void>;
}

export function SignOut({ onSignOut }: SignOutProps): JSX.Element {
  useEffect(() => {
    const timeout = setTimeout(async () => {
      await onSignOut();
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [onSignOut]);

  return (
    <Grid container justify="center" alignItems="center">
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant="h5" align="center">
          Signing out...
        </Typography>
      </Grid>
    </Grid>
  );
}
