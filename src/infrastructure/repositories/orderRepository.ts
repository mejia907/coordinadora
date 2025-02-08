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

      if (!existingUser.length) {
        throw new Error("El usuario no existe.");
      }

      // Verificar si el estado de la orden existe
      if (order.status_order_id && order.status_order_id > 0) {

        const [existingStatusOrder]: any = await mysqlConnection.query(
          "SELECT id FROM status_order WHERE id = ?",
          [order.status_order_id]
        );

        if (!existingStatusOrder.length) {
          throw new Error("El estado de la orden no existe.");
        }
      }

      // Verificar si el estado de la orden existe sino asignar 1 "En espera"
      if (!order.status_order_id) {
        order.status_order_id = 1
      }

      // Guardar la orden
      const [result]: any = await mysqlConnection.query(
        `INSERT INTO orders 
        (user_id, type_product, weight, dimension_long, dimension_tall, dimension_width, amount, destination_address, status_order_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          order.user_id,
          order.type_product,
          order.weight,
          order.dimension_long,
          order.dimension_tall,
          order.dimension_width,
          order.amount,
          order.destination_address,
          order.status_order_id,
        ]
      )

      return { ...order, id: result.insertId, }

    } catch (error: Error | any) {
      throw new Error(error.message);
    }
  }

  public assignRoute = async (order_id: number, route_id: number, carrier_id: number, estimated_delivery: Date): Promise<void> => {
    try {

      if (!order_id || isNaN(order_id)) {
        throw new Error("Debe definir el número de orden.");
      }
      // Verificar si la orden existe
      const [existingOrder]: any = await mysqlConnection.query(
        "SELECT id FROM orders WHERE id = ?",
        [order_id]
      );

      if (!existingOrder.length || isNaN(order_id)) {
        throw new Error("El número de orden no existe.");
      }

      // Verificar si la ruta existe
      const [existingRoute]: any = await mysqlConnection.query(
        "SELECT id FROM routes WHERE id = ?",
        [route_id]
      );

      if (!existingRoute.length) {
        throw new Error("La ruta no existe.");
      }

      // Verificar si la fecha estimada de entrega es menor a la fecha actual
      if (new Date(estimated_delivery) < new Date()) {
        throw new Error("La fecha estimada de entrega no puede ser menor a la fecha actual.");
      }

      // Verificar si el transportista existe
      const [existingCarrier]: any = await mysqlConnection.query(
        "SELECT availability FROM carriers WHERE id = ?",
        [carrier_id]
      );

      if (!existingCarrier.length || !existingCarrier[0].availability) {
        throw new Error("El transportista no está disponible.");
      }

      // Actualizar la orden con la ruta y el transportista
      const [result]: any = await mysqlConnection.query(
        `UPDATE orders 
        SET
        carrier_id = ?,
        route_id = ?,
        status_order_id = ?,
        estimated_delivery = ?
        WHERE id = ?`,
        [
          carrier_id,
          route_id,
          2, // "En ruta"
          estimated_delivery,
          order_id
        ]
      )

    } catch (error: Error | any) {
      throw new Error(error.message);
    }
  }
}

