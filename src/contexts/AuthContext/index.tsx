import React, { useEffect, useReducer, useCallback } from 'react';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';
import { toast } from 'react-toastify';
import {
  ConfirmAccountForm,
  ConfirmAccountValues,
  ForgotPasswordForm,
  ForgotPasswordValues,
  ResetPasswordForm,
  ResetPasswordValues,
  SignInForm,
  SignInValues,
  SignOut,
  SignUpForm,
  SignUpValues,
} from '../../components';
import {
  AuthMode,
  reducer as authReducer,
  actions as authActions,
} from './actions';

export interface IAuthContext {
  session: CognitoUserSession;
  updateSession: () => Promise<void>;
  signOut: () => void;
}

export const AuthContext = React.createContext<IAuthContext>(undefined);

const handleSignOut = async () => {
  await Auth.signOut();
  window.location.reload();
};

export interface AuthContextProviderProps {
  children: React.ReactNode;
}

export function AuthContextProvider({
  children,
}: AuthContextProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(authReducer, {
    authMode: AuthMode.SIGN_IN,
    email: '',
    session: undefined,
  });

  const updateSession = useCallback(async () => {
    try {
      const currentSession = await Auth.currentSession();
      dispatch(authActions.updateSession(currentSession));
    } catch (_) {
      dispatch(authActions.updateSession(null));
    }
  }, []);

  useEffect(() => {
    updateSession();
  }, [updateSession]);

  const handleSignUp = async (values: SignUpValues) => {
    const result = await Auth.signUp({
      username: values.email,
      password: values.password,
      attributes: {
        email: values.email,
        // given_name: values.firstName,
        // family_name: values.lastName,
        // allow_marketing: values.allowMarketing,
      },
    });
    toast.success('Account created');
    if (result.userConfirmed) {
      dispatch(authActions.switchMode(AuthMode.SIGN_IN, values.email));
    } else {
      dispatch(authActions.switchMode(AuthMode.CONFIRM_ACCOUNT, values.email));
    }
  };

  const handleSignIn = async (values: SignInValues) => {
    try {
      await Auth.signIn(values.email, values.password);
      await updateSession();
    } catch (err) {
      if (err.code === 'UserNotConfirmedException') {
        toast.info('Account must be confirmed before signing in');
        dispatch(
          authActions.switchMode(AuthMode.CONFIRM_ACCOUNT, values.email)
        );
        return;
      }
      throw err;
    }
  };

  const handleForgotPassword = async (values: ForgotPasswordValues) => {
    try {
      await Auth.forgotPassword(values.email);
      dispatch(authActions.switchMode(AuthMode.RESET_PASSWORD, values.email));
    } catch (err) {
      if (err.code === 'InvalidParameterException') {
        toast.info('Account must be confirmed before resetting password');
        dispatch(
          authActions.switchMode(AuthMode.CONFIRM_ACCOUNT, values.email)
        );
      }
      throw err;
    }
  };

  const handleResetPassword = async (values: ResetPasswordValues) => {
    await Auth.forgotPasswordSubmit(state.email, values.code, values.password);
    toast.success('Password changed');
    dispatch(authActions.switchMode(AuthMode.SIGN_IN));
  };

  const handleConfirmAccount = async (values: ConfirmAccountValues) => {
    await Auth.confirmSignUp(state.email, values.code);
    toast.success('Account confirmed');
    dispatch(authActions.switchMode(AuthMode.SIGN_IN));
  };

  const handleResendCode = async () => {
    await Auth.resendSignUp(state.email);
    toast.success('Email with confirmation code resent');
  };

  const signOut = useCallback(() => {
    dispatch(authActions.switchMode(AuthMode.SIGN_OUT));
  }, []);

  if (state.session === undefined) {
    return null;
  }

  if (state.authMode === AuthMode.SIGN_OUT) {
    return <SignOut onSignOut={handleSignOut} />;
  }

  if (state.session) {
    return (
      <AuthContext.Provider
        value={{ session: state.session, updateSession, signOut }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  if (state.authMode === AuthMode.SIGN_UP) {
    return (
      <SignUpForm
        email={state.email}
        onSubmit={handleSignUp}
        dispatch={dispatch}
      />
    );
  }
  if (state.authMode === AuthMode.FORGOT_PASSWORD) {
    return (
      <ForgotPasswordForm
        email={state.email}
        onSubmit={handleForgotPassword}
        dispatch={dispatch}
      />
    );
  }
  if (state.authMode === AuthMode.RESET_PASSWORD) {
    return (
      <ResetPasswordForm email={state.email} onSubmit={handleResetPassword} />
    );
  }
  if (state.authMode === AuthMode.CONFIRM_ACCOUNT) {
    return (
      <ConfirmAccountForm
        email={state.email}
        onSubmit={handleConfirmAccount}
        onResendCode={handleResendCode}
      />
    );
  }

  return (
    <SignInForm
      email={state.email}
      onSubmit={handleSignIn}
      dispatch={dispatch}
    />
  );
}
