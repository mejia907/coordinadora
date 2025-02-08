import { mysqlConnection } from '@infrastructure/db/mysqlConnection'
import { CarrierEntity } from '@entitites/carrierEntity'

export default class CarrierRepository {
  public create = async (carrier: CarrierEntity): Promise<CarrierEntity> => {

    try {

      // Verificar si el usuario existe como mensajero
      const [existingUser]: any = await mysqlConnection.query(
        "SELECT user_id FROM carriers WHERE user_id = ?",
        [carrier.user_id]
      );

      if (existingUser.length > 0) {
        throw new Error("El usuario ya existe como mensajero.");
      }

      // Guardar el usuario
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
      throw new Error(error.message);
    }
  }
}

