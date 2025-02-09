import bcrypt from 'bcrypt'

import { mysqlConnection } from '@infrastructure/db/mysqlConnection'
import { UserEntity } from '@entitites/userEntity'

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
        throw new Error("El número de documento ya existe.")
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

      return { ...user, id: result.insertId, }

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
}

