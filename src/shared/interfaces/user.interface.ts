export interface User {
  readonly id?: string;
  readonly displayName: string;
  readonly firebaseUid: string;
  readonly role: string;
}
