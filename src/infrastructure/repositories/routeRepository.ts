import { mysqlConnection } from '../../infrastructure/db/mysqlConnection'
import { RouteEntity } from '../../entities/routeEntity'

/**
 * @description Repositorio de rutas
 */
export default class RouteRepository {
  public create = async (route: RouteEntity): Promise<RouteEntity> => {

    try {

      // Verificar si la ruta ya existe
      const [existingUser]: any = await mysqlConnection.query(
        "SELECT id FROM routes WHERE origin = ? AND destination = ?",
        [route.origin, route.destination]
      )

      if (existingUser.length > 0) {
        throw new Error("La ruta ya existe.")
      }

      // Guardar la ruta
      const [result]: any = await mysqlConnection.query(
        `INSERT INTO routes 
        (name, origin, destination, distance_km, estimated_time) 
        VALUES (?, ?, ?, ?, ?)`,
        [
          route.name,
          route.origin,
          route.destination,
          route.distance_km,
          route.estimated_time
        ]
      )


      return { ...route, id: result.insertId, }

    } catch (error: Error | any) {
      throw new Error(error.message)
    }
  }
}

