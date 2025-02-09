import { mysqlConnection } from '@infrastructure/db/mysqlConnection'
import { OrderEntity } from '@entitites/orderEntity'
import redisClient from '@infrastructure/cache/redisClient'

/**
 * @param order
 * @description Repositorio de ordenes
 */
export default class OrderRepository {
  public create = async (order: OrderEntity): Promise<OrderEntity> => {

    try {

      // Verificar si el usuario existe
      const [existingUser]: any = await mysqlConnection.query(
        "SELECT id FROM users WHERE id = ?",
        [order.user_id]
      )

      if (!existingUser.length) {
        throw new Error("El usuario no existe.")
      }

      // Verificar si el estado de la orden existe
      if (order.status_order_id && order.status_order_id > 0) {

        const [existingStatusOrder]: any = await mysqlConnection.query(
          "SELECT id FROM status_order WHERE id = ?",
          [order.status_order_id]
        )

        if (!existingStatusOrder.length) {
          throw new Error("El estado de la orden no existe.")
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
      throw new Error(error.message)
    }
  }

  /**
   * @param order_id 
   * @param route_id 
   * @param carrier_id 
   * @param estimated_delivery 
   * @description Asignar una ruta a una orden
   */
  public assignRoute = async (order_id: number, route_id: number, carrier_id: number, estimated_delivery: Date): Promise<void> => {
    try {

      if (!order_id || isNaN(order_id)) {
        throw new Error("Debe definir el número de orden.")
      }

      // Verificar si la orden existe
      const [existingOrder]: any = await mysqlConnection.query(
        "SELECT id FROM orders WHERE id = ?",
        [order_id]
      )

      if (!existingOrder.length || isNaN(order_id)) {
        throw new Error("El número de orden no existe.")
      }

      // Verificar si la ruta existe
      const [existingRoute]: any = await mysqlConnection.query(
        "SELECT id FROM routes WHERE id = ?",
        [route_id]
      )

      if (!existingRoute.length) {
        throw new Error("La ruta no existe.")
      }

      // Verificar si la fecha estimada de entrega es menor a la fecha actual
      if (new Date(estimated_delivery) < new Date()) {
        throw new Error("La fecha estimada de entrega no puede ser menor a la fecha actual.")
      }

      // Verificar si el transportista existe
      const [existingCarrier]: any = await mysqlConnection.query(
        "SELECT availability FROM carriers WHERE id = ?",
        [carrier_id]
      )

      if (!existingCarrier.length || !existingCarrier[0].availability) {
        throw new Error("El transportista no está disponible.")
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

      if (result.affectedRows > 0) {
        // Guardar en Redis le estado con expiración de 60 minutos
        await redisClient.setEx(`order_status_${order_id}`, 3600, "En ruta")
      }

    } catch (error: Error | any) {
      throw new Error(error.message)
    }
  }

  /**
   * @param order_id 
   * @description Obtener el estado de una orden
   */
  public getOrderStatus = async (order_id: number): Promise<string> => {
    try {

      if (!order_id || isNaN(order_id)) {
        throw new Error("Debe definir un número de orden válido.")
      }

      // Buscar en Redis la orden
      const cachedStatusOrder = await redisClient.get(`order_status_${order_id}`)
      if (cachedStatusOrder) {
        return cachedStatusOrder
      }

      // Si no está en Redis se consulta en la base de datos
      const [orderStatus]: any = await mysqlConnection.query(
        "SELECT status_order.name FROM orders INNER JOIN status_order ON status_order.id = orders.status_order_id WHERE orders.id = ?",
        [order_id]
      )

      if (!orderStatus || !orderStatus.length) {
        throw new Error("El número de orden no existe.")
      }

      const orderStatusName = orderStatus[0].name

      // Guardar en Redis el estado con expiración de 60 minutos
      await redisClient.setEx(`order_status_${order_id}`, 3600, orderStatusName)

      return orderStatusName
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  /**
   *
   * @param start_date 
   * @param end_date 
   * @param limit 
   * @param offset 
   * @param status_order_id 
   * @param carrier_id 
   * @description Obtener reporte general de ordenes 
   */
  public orderAll = async (start_date: string, end_date: string, limit: number = 10, offset: number = 0, status_order_id?: number, carrier_id?: number): Promise<any> => {

    try {
      //Estado de finalizado de la orden
      const statusFinishOrder = 3

      // Consulta para obtener el reporte
      let queryReport = `
          SELECT 
            ord.id AS order_id,
            usr.name AS user_name,
            usr.email AS user_email,
            ord.type_product,
            ord.weight,
            ord.amount,
            ord.destination_address,
            status_ord.name AS order_status,
            car.id AS carrier_id,
            car_usr.name AS carrier_name,
            rout.name AS route_name,
            rout.origin,
            rout.destination,
            /*Retraso en entrega*/
            TIMESTAMPDIFF(DAY, ord.estimated_delivery, ord.actual_delivery) AS delivery_delay, 
            /*Promedio de retraso por transportista*/
            (SELECT AVG(TIMESTAMPDIFF(DAY, ord1.estimated_delivery, ord1.actual_delivery))
            FROM orders AS ord1
            WHERE ord1.carrier_id = ord.carrier_id
            AND ord1.actual_delivery IS NOT NULL) AS avg_delivery_time_per_carrier,
            /*Pedidos entregados por transportista*/
            (SELECT COUNT(*)
            FROM orders AS ord2
            WHERE ord2.carrier_id = ord.carrier_id
            AND ord2.status_order_id = ${statusFinishOrder}) AS completed_orders
          FROM orders AS ord
          LEFT JOIN users AS usr ON ord.user_id = usr.id
          LEFT JOIN status_order AS status_ord ON ord.status_order_id = status_ord.id
          LEFT JOIN carriers AS car ON ord.carrier_id = car.id
          LEFT JOIN users AS car_usr ON car.user_id = car_usr.id
          LEFT JOIN routes AS rout ON ord.route_id = rout.id
      `.trim()

      // Filtros y parametros
      const filters: string[] = [];
      const params: any[] = [];

      // Filtro para fechas
      if (start_date && end_date) {
        filters.push("ord.created_at BETWEEN ? AND ?");
        params.push(start_date);
        params.push(end_date);
      }

      // Filtro para estado de la orden
      if (status_order_id) {
        filters.push("ord.status_order_id = ?");
        params.push(status_order_id);
      }

      // Filtro para transportista
      if (carrier_id) {
        filters.push("ord.carrier_id = ?");
        params.push(carrier_id);
      }

      // Concatenar los filtros
      if (filters.length > 0) {
        queryReport += " WHERE " + filters.join(" AND ");
      }

      // Ordenar y limitar
      queryReport += " ORDER BY ord.created_at DESC LIMIT ? OFFSET ?";
      params.push(limit);
      params.push(offset);


      // Buscar en Redis la consulta
      const cacheKey = `all_orders:${JSON.stringify(params)}`;
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      // Ejecutar la consulta
      const [orders]: any = await mysqlConnection.query(queryReport, params);

      // Guardar en Redis con expiración de 5 minutos
      await redisClient.setEx(cacheKey, 300, JSON.stringify(orders));

      return orders

    } catch (error: any) {
      throw new Error(error.message)
    }

  }

}

