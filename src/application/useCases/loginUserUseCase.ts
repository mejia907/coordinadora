import jwt from 'jsonwebtoken'
import UserRepository from '@infrastructure/repositories/userRepository'
import { AuthEntity } from '@entitites/authEntity'
import { envs } from "@config/envs";

async function LoginUserUseCase(email: string, password: string): Promise<AuthEntity | null> {
  const userRepository = new UserRepository()

  // Verificar si el correo electronico existe
  const user = await userRepository.findByEmail(email)

  if (!user) {
    throw new Error('No se encontro el usuario')
  }

  // Verificar si la contraseña es correcta
  const isPasswordValid = await userRepository.comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Contraseña incorrecta')
  }

  // Generar el token
  const token = jwt.sign(
    { userId: user.id, role: user.role_id },
    envs.JWT_SECRET ?? '',
    { expiresIn: "2h" }
  );

  if (!token) {
    throw new Error('No se pudo generar el token')
  }

  // Retornar usuario SIN la contraseña
  const userWithoutPassword = { ...user, password: '' }

  return { token, user: userWithoutPassword }
}

export { LoginUserUseCase }