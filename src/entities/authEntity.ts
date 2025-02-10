import { UserEntity } from './userEntity'

export class AuthEntity {
  constructor(
    public token: string,
    public user : UserEntity
  ) {}
}