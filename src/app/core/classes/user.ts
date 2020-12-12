
export class User {

  id: number;
  username: string;
  email: string;
  email_verified_at: string;
  created_at: Date;
  updated_at: Date;
  is_confirmed: boolean;


  constructor(user?) {
    if (user) {
      this.id = user.id;
      this.username = user.username;
      this.email = user.email;
      this.email_verified_at = user.email_verified_at;
      this.created_at = user.created_at;
      this.updated_at = user.updated_at;
      this.is_confirmed = user.is_confirmed;
    } else {
      return {} as User;
    }
  }
}
