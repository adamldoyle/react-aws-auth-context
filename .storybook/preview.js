import { Amplify } from 'aws-amplify';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: process.env.AWS_REGION,
    userPoolId: process.env.AWS_POOL_ID,
    userPoolWebClientId: process.env.AWS_CLIENT_ID,
  },
});

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => (
    <Container component="main">
      <CssBaseline />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        draggable={false}
      />
      <Story />
    </Container>
  ),
];
