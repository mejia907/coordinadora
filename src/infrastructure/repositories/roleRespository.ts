import { mysqlConnection } from '@infrastructure/db/mysqlConnection'
import { RoleEntity } from '@entitites/roleEntity'

export default class RoleRepository {
  public create = async (role: RoleEntity): Promise<RoleEntity> => {

    try {

      // Verificar si el nombre existe
      const [existingUser]: any = await mysqlConnection.query(
        "SELECT name FROM roles WHERE name = ?",
        [role.name]
      );

      if (existingUser.length > 0) {
        throw new Error("El rol ya existe.");
      }

      // Guardar el usuario
      const [result]: any = await mysqlConnection.query(
        `INSERT INTO roles 
        (name) 
        VALUES (?)`,
        [
          role.name,
        ]
      )

      return { ...role, id: result.insertId, }

    } catch (error: Error | any) {
      throw new Error(error.message);
    }
  }
}

