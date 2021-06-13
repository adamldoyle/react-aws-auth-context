import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { IProfile } from './types';

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
  profile?: IProfile | null;
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
      const session = action.payload.session;
      if (session === null) {
        return {
          ...state,
          session: null,
          profile: null,
        };
      }
      if (
        session.getIdToken().getJwtToken() ===
          state.session?.getIdToken().getJwtToken() &&
        session.getAccessToken().getJwtToken() ===
          state.session.getAccessToken().getJwtToken()
      ) {
        return state;
      }
      const idPayload = session.getIdToken().payload;
      return {
        ...state,
        session,
        profile: {
          email: idPayload.email,
          firstName: idPayload.given_name ?? '',
          lastName: idPayload.family_name ?? '',
          allowMarketing: idPayload['custom:allow_marketing'] === 'true',
        },
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
