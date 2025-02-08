export class UserEntity {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public phone: string,
    public address: string,
    public role_id: number,
    public password: string,
    public created_at: Date,
    public status?: boolean,
    public updated_at?: Date
  ) { }
}