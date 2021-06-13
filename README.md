# react-aws-auth-context

React context for managing authentication flow with AWS. Extremely opinionated in its implementation as the primary goal is to provide a quick-to-use authentication solution for my React apps. Utilizes AWS (via aws-amplify), Material-UI, Formik (Yup schemas), and react-toastify.

## Usage

1. `yarn add @adamldoyle/react-aws-auth-context`
2. Configure aws-amplify Auth prior to mounting `<AuthContextProvider>` (example provided in `./storybook/preview.js`)
3. Requires Cognito to be configured with:
   - email as username
   - given_name, family_name, and allow_marketing attributes (none marked as required)
4. Wrap portion of app that requires authentication in `<AuthContextProvider>` (normal usage would be to wrap entire app near the top-level)

## Examples

Full flow example is provided in the `Context/AuthContextProvider` story via Storybook

- https://adamldoyle-react-aws-auth-context-storybook.netlify.app/

OR

1. Create `.env` file in root based on `.env.sample`
2. `yarn storybook`

## Development

1. `yarn install`
2. `yarn build`

## Contributors

[Adam Doyle](https://github.com/adamldoyle)

## License

MIT
