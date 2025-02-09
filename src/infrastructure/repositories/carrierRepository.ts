import { mysqlConnection } from '@infrastructure/db/mysqlConnection'
import { CarrierEntity } from '@entitites/carrierEntity'

/**
 * @param carrier
 * @description Repositorio de transportistas
 */
export default class CarrierRepository {
  public create = async (carrier: CarrierEntity): Promise<CarrierEntity> => {

    try {

      // Verificar si el usuario existe como transportista
      const [existingUser]: any = await mysqlConnection.query(
        "SELECT user_id FROM carriers WHERE user_id = ?",
        [carrier.user_id]
      )

      if (existingUser.length > 0) {
        throw new Error("El usuario ya existe como transportista.")
      }

      // Guardar el transportista
      const [result]: any = await mysqlConnection.query(
        `INSERT INTO carriers 
        (user_id, licencePlate) 
        VALUES (?, ?)`,
        [
          carrier.user_id,
          carrier.licencePlate
        ]
      )

      return { ...carrier, id: result.insertId, }

    } catch (error: Error | any) {
      throw new Error(error.message)
    }
  }
}

