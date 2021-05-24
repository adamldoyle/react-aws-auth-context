import { CognitoUserSession } from 'amazon-cognito-identity-js';

export enum AuthMode {
  SIGN_UP = 'SIGN_UP',
  CONFIRM_ACCOUNT = 'CONFIRM_ACCOUNT',
  SIGN_IN = 'SIGN_IN',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  RESET_PASSWORD = 'RESET_PASSWORD',
  SIGN_OUT = 'SIGN_OUT',
}

export interface IAuthState {
  authMode: AuthMode;
  email?: string;
  session?: CognitoUserSession | null;
}

interface IUpdateSession {
  type: 'UPDATE_SESSION';
  payload: {
    session: CognitoUserSession | null;
  };
}
const updateSession = (session: CognitoUserSession | null): IUpdateSession => ({
  type: 'UPDATE_SESSION',
  payload: {
    session,
  },
});

interface ISwitchMode {
  type: 'SWITCH_MODE';
  payload: {
    authMode: AuthMode;
    email?: string;
  };
}
const switchMode = (authMode: AuthMode, email?: string): ISwitchMode => ({
  type: 'SWITCH_MODE',
  payload: {
    authMode,
    email,
  },
});

export const actions = {
  updateSession,
  switchMode,
};

export type IAuthAction = IUpdateSession | ISwitchMode;

export function reducer(state: IAuthState, action: IAuthAction): IAuthState {
  switch (action.type) {
    case 'UPDATE_SESSION':
      return {
        ...state,
        session: action.payload.session,
      };
    case 'SWITCH_MODE':
      return {
        ...state,
        authMode: action.payload.authMode,
        email: action.payload.email ?? state.email,
      };
    default:
      return state;
  }
}
