import { CognitoUserSession } from 'amazon-cognito-identity-js';

export interface IProfile {
  email: string;
  firstName: string;
  lastName: string;
  allowMarketing: boolean;
}

export interface IAuthContext {
  session: CognitoUserSession;
  profile: IProfile;
  updateSession: () => Promise<void>;
  signOut: () => void;
}
