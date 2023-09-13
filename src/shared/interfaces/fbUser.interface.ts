export interface FbUser {
  readonly uid: string;
  readonly email?: string;
  readonly emailVerified?: boolean;
  readonly phoneNumber?: string;
  readonly password?: string;
  readonly displayName: string;
  readonly photoUrl?: string;
  readonly disabled?: boolean;
}
