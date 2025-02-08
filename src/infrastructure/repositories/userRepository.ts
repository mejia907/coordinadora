import bcrypt from 'bcrypt'

import { mysqlConnection } from '@infrastructure/db/mysqlConnection'
import { UserEntity } from '@entitites/userEntity'

export default class UserRepository {
  public create = async (user: UserEntity): Promise<UserEntity> => {

    try {
      // Cifrar la contraseña antes de guardarla
      user.password = await bcrypt.hash(user.password, 10)

      // Verificar si el correo electronico existe
      const [existingUser]: any = await mysqlConnection.query(
        "SELECT email FROM users WHERE email = ?",
        [user.email]
      );

      if (existingUser.length == 0) {
        throw new Error("El correo electrónico ya existe.");
      }

      // Verificar si el rol existe
      const [existingRole]: any = await mysqlConnection.query(
        "SELECT id FROM roles WHERE id = ?",
        [user.role_id]
      );

      if (existingRole.length == 0) {
        throw new Error("El rol no existe.");
      }

      // Guardar el usuario
      const [result]: any = await mysqlConnection.query(
        `INSERT INTO users 
        (name, email, phone, address, role_id, status, password) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
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
      throw new Error(error.message);
    }
  }
}

