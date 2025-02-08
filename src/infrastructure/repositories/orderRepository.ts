import { mysqlConnection } from '@infrastructure/db/mysqlConnection'
import { OrderEntity } from '@entitites/orderEntity'

export default class OrderRepository {
  public create = async (order: OrderEntity): Promise<OrderEntity> => {

    try {

      // Verificar si el usuario existe
      const [existingUser]: any = await mysqlConnection.query(
        "SELECT id FROM users WHERE id = ?",
        [order.user_id]
      );

      if (existingUser.length == 0) {
        throw new Error("El usuario no existe.");
      }

      // Verificar si el estado de la orden existe
      if (order.status_order_id && order.status_order_id > 0) {

        const [existingStatusOrder]: any = await mysqlConnection.query(
          "SELECT id FROM status_order WHERE id = ?",
          [order.status_order_id]
        );

        if (existingStatusOrder.length == 0) {
          throw new Error("El estado de la orden no existe.");
        }
      }

      // Verificar si el mensajero existe
      const [existingCarrier]: any = await mysqlConnection.query(
        "SELECT id FROM carriers WHERE id = ?",
        [order.carrier_id]
      );

      if (existingCarrier.length == 0) {
        throw new Error("El mensajero no existe.");
      }

      // Verificar si el estado de la orden existe sino asignar 1 "En espera"
      if (!order.status_order_id) {
        order.status_order_id = 1
      }

      // Guardar el la orden
      const [result]: any = await mysqlConnection.query(
        `INSERT INTO orders 
        (user_id, type_product, weight, dimension_long, dimension_tall, dimension_width, amount, destination_city, destination_address, carrier_id, status_order_id, estimated_delivery) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          order.user_id,
          order.type_product,
          order.weight,
          order.dimension_long,
          order.dimension_tall,
          order.dimension_width,
          order.amount,
          order.destination_city,
          order.destination_address,
          order.carrier_id,
          order.status_order_id,
          order.estimated_delivery
        ]
      )

      return { ...order, id: result.insertId, }

    } catch (error: Error | any) {
      throw new Error(error.message);
    }
  }
}

