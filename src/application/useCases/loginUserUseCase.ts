import UserRepository from '../../infrastructure/repositories/userRepository'
import { AuthEntity } from '../../entities/authEntity'

/**
 * @param email 
 * @param password 
 * @description UseCase para la autenticación de usuarios
 */
async function LoginUserUseCase(email: string, password: string): Promise<AuthEntity | null> {
  const userRepository = new UserRepository()
  return await userRepository.login(email, password)
}

export { LoginUserUseCase }