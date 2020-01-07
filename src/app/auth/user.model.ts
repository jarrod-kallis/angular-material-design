export class User {
  id: string;
  email: string;
  birthday: Date;

  constructor(email: string, birthday?: Date, id?: string) {
    this.id = id;
    this.email = email;
    this.birthday = birthday;
  }
}
