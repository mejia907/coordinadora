import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { mysqlConnection } from '../../infrastructure/db/mysqlConnection'
import { UserEntity } from '../../entities/userEntity'
import { envs } from '../../config/envs'
import { AuthEntity } from 'entities/authEntity'
/**
 * @description Repositorio de usuarios
 */
export default class UserRepository {
  /**
   * @param user 
   * @description Guardar un usuario
   */
  public create = async (user: UserEntity): Promise<UserEntity> => {

    try {

      // Verificar si el correo electronico existe
      const [existingUser]: any = await mysqlConnection.query(
        "SELECT email FROM users WHERE email = ?",
        [user.email]
      )

      if (existingUser.length > 0) {
        throw new Error("El correo electrónico ya existe.")
      }

      // Verificar si el número de documento existe
      const [existingDocument]: any = await mysqlConnection.query(
        "SELECT document FROM users WHERE document = ?",
        [user.document]
      )

      if (existingDocument.length > 0) {
        throw new Error("El número de documento ya se encuentra registrado.")
      }

      // Cifrar la contraseña antes de guardarla
      user.password = await bcrypt.hash(user.password, 10)

      // Verificar si el rol existe
      const [existingRole]: any = await mysqlConnection.query(
        "SELECT id FROM roles WHERE id = ?",
        [user.role_id]
      )

      if (!existingRole.length) {
        throw new Error("El rol no existe.")
      }

      // Guardar el usuario
      const [result]: any = await mysqlConnection.query(
        `INSERT INTO users 
        (type_document, document, name, email, phone, address, role_id, status, password) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user.type_document,
          user.document,
          user.name,
          user.email,
          user.phone,
          user.address,
          user.role_id,
          user.status,
          user.password,
        ]
      )

      // Retornar usuario SIN la contraseña
      const userWithoutPassword = { ...user, password: '' }

      return { ...userWithoutPassword, id: result.insertId, }

    } catch (error: Error | any) {
      throw new Error(error.message)
    }
  }

  /**
   * @param email 
   * @description Buscar un usuario por su correo electrónico 
   */
  public findByEmail = async (email: string): Promise<UserEntity | null> => {
    try {
      const [user]: any = await mysqlConnection.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      )

      if (!user.length) {
        throw new Error("El usuario no existe.")
      }

      return user[0]
    } catch (error: Error | any) {
      throw new Error(error.message)
    }
  }
  /**
   * @param password 
   * @param hashedPassword 
   * @description Verificar si la contraseña es correcta
   */
  public comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
      return await bcrypt.compare(password, hashedPassword)
    } catch (error: Error | any) {
      throw new Error(error.message)
    }
  }

  /**
   * @param email 
   * @param password 
   * @description Autenticación de usuarios
   */
  login = async (email: string, password: string): Promise<AuthEntity | null> => {
    try {
      const user = await this.findByEmail(email)

      if (!user) {
        throw new Error("El usuario no existe.")
      }

      // Verificar si el usuario esta activo
      if (!user.status) {
        throw new Error('El usuario esta inactivo.')
      }

      // Verificar si la contraseña es correcta
      const isPasswordValid = await this.comparePassword(password, user.password)

      if (!isPasswordValid) {
        throw new Error("La contraseña es incorrecta.")
      }

      // Generar el token con la informacion del usuario
      const token = jwt.sign(
        { user_id: user.id, role: user.role_id },
        envs.JWT_SECRET ?? '',
        { expiresIn: "2h" }
      )

      if (!token) {
        throw new Error('No se pudo generar el token')
      }
      // Retornar usuario SIN la contraseña
      const userWithoutPassword = { ...user, password: '' }

      return { token, user: userWithoutPassword }

    } catch (error: Error | any) {
      throw new Error(error.message)
    }
  }
}

