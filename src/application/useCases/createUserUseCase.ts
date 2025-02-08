import UserRepository from '@infrastructure/repositories/userRepository'
import { UserEntity } from '@entitites/userEntity'

async function CreateUserUseCase (user: UserEntity): Promise<UserEntity | null> {
  const userRepository = new UserRepository()
  return await userRepository.create(user)
}

export default CreateUserUseCase