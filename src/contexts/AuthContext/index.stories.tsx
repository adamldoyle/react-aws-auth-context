import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Box, Button, Typography } from '@material-ui/core';
import { AuthContext, AuthContextProvider, AuthContextProviderProps } from '.';

export default {
  title: 'context/AuthContextProvider',
  component: AuthContextProvider,
} as Meta;

const Template: Story<AuthContextProviderProps> = (args) => (
  <AuthContextProvider {...args}>
    <AuthContext.Consumer>
      {({ session, signOut }) => (
        <Box>
          <Typography variant="h4">Authenticated</Typography>
          <Typography variant="h6">ID payload</Typography>
          <ul>
            {Object.entries(session.getIdToken().payload).map(
              (payloadEntry) => (
                <li key={payloadEntry[0]}>
                  {payloadEntry[0]}: {JSON.stringify(payloadEntry[1])}
                </li>
              )
            )}
          </ul>
          <Typography variant="h6">Access payload</Typography>
          <ul>
            {Object.entries(session.getAccessToken().payload).map(
              (payloadEntry) => (
                <li key={payloadEntry[0]}>
                  {payloadEntry[0]}: {JSON.stringify(payloadEntry[1])}
                </li>
              )
            )}
          </ul>
          <Button variant="contained" color="primary" onClick={signOut}>
            Sign out
          </Button>
        </Box>
      )}
    </AuthContext.Consumer>
  </AuthContextProvider>
);

export const Default = Template.bind({});
Default.args = {};
