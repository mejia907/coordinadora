import { mysqlConnection } from '../../infrastructure/db/mysqlConnection'
import { OrderEntity } from '../../entities/orderEntity'
import redisClient from '../../infrastructure/cache/redisClient'

/**
 * @param order
 * @description Repositorio de ordenes
 */
export default class OrderRepository {
  public create = async (user_id: number, order: OrderEntity): Promise<OrderEntity> => {

    try {

      // Verificar si el usuario existe
      const [existingUser]: any = await mysqlConnection.query(
        "SELECT id FROM users WHERE id = ?",
        [user_id]
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

      // Generar el numero de guia
      order.guide_order = Math.floor(1000000000 + Math.random() * 9000000000).toString();

      // Guardar la orden
      const [result]: any = await mysqlConnection.query(
        `INSERT INTO orders 
        (user_id, type_product, weight, dimension_long, dimension_tall, dimension_width, amount, destination_address, contact_receive, contact_phone, description_content, declared_value, notes_delivery, guide_order, status_order_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id,
          order.type_product,
          order.weight,
          order.dimension_long,
          order.dimension_tall,
          order.dimension_width,
          order.amount,
          order.destination_address,
          order.contact_receive,
          order.contact_phone,
          order.description_content,
          order.declared_value,
          order.notes_delivery,
          order.guide_order,
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
  public assignRoute = async (user_id: number, order_id: number, route_id: number, carrier_id: number, estimated_delivery: Date): Promise<void> => {
    try {

      if (!order_id || isNaN(order_id)) {
        throw new Error("Debe definir el número de orden.")
      }

      // Verificar si el usuario existe y es un administrador
      const [existingUser]: any = await mysqlConnection.query(
        "SELECT roles.id FROM users INNER JOIN roles ON users.role_id = roles.id WHERE users.id = ?",
        [user_id]
      )

      if (!existingUser.length) {
        throw new Error("El usuario no existe.")
      }

      //// Verificar si el usuario es un administrador
      if (existingUser[0].id !== 1) {
        throw new Error("El usuario no es administrador.")
      }

      // Verificar si la orden existe
      const [existingOrder]: any = await mysqlConnection.query(
        "SELECT id FROM orders WHERE id = ?",
        [order_id]
      )

      if (!existingOrder.length || isNaN(order_id)) {
        throw new Error("El número de orden no existe.")
      }

      // Verificar si la ruta existe para un transportista
      const existingRoute = await this.disponibility(route_id, carrier_id)

      if (!existingRoute.length) {
        throw new Error("No hay rutas disponibles para ese transportista en esa ruta.")
      }

      // Verificar si la fecha estimada de entrega es menor a la fecha actual
      if (new Date(estimated_delivery) < new Date()) {
        throw new Error("La fecha estimada de entrega no puede ser menor a la fecha actual.")
      }

      // Verificar si el transportista existe y esta disponible
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
   * @param actual_delivery 
   * @description Finalizar una orden
   */
  public endRoute = async (order_id: number, actual_delivery: Date): Promise<void> => {
    try {

      if (!order_id || isNaN(order_id)) {
        throw new Error("Debe definir el número de orden.")
      }

      // Verificar si la orden existe
      const [existingOrder]: any = await mysqlConnection.query(
        "SELECT id, status_order_id FROM orders WHERE id = ?",
        [order_id]
      )

      if (!existingOrder.length || isNaN(order_id)) {
        throw new Error("El número de orden no existe.")
      }

      // Verificar si la orden se encuentra en ruta
      if (existingOrder[0].status_order_id !== 2) {
        throw new Error("La orden no se encuentra en ruta.")
      }

      // Verificar si la fecha de entrega es menor a la fecha actual
      if (new Date(actual_delivery) < new Date()) {
        throw new Error("La fecha de entrega no puede ser menor a la fecha actual.")
      }

      // Actualizar la orden con la fecha real de entrega
      const [result]: any = await mysqlConnection.query(
        `UPDATE orders 
        SET
        actual_delivery = ?,
        status_order_id = ?
        WHERE id = ?`,
        [
          actual_delivery,
          3, // "Entregado"
          order_id
        ]
      )

      if (result.affectedRows > 0) {
        // Guardar en Redis le estado con expiración de 60 minutos
        await redisClient.setEx(`order_status_${order_id}`, 3600, "Entregado")
      }

    } catch (error: Error | any) {
      throw new Error(error.message)
    }
  }

  /**
   * @param order_id 
   * @description Obtener el estado de una orden por número de guia
   */
  public getOrderStatus = async (tracking_order: number): Promise<any> => {
    try {

      if (!tracking_order || isNaN(tracking_order)) {
        throw new Error("Debe definir un número de guia válido.")
      }

      // Buscar en Redis la orden
      const cachedStatusOrder = await redisClient.get(`order_status_${tracking_order}`)
      if (cachedStatusOrder) {
        return JSON.parse(cachedStatusOrder)
      }

      // Si no está en Redis se consulta en la base de datos
      const [orderStatus]: any = await mysqlConnection.query(
        "SELECT orders.guide_order, status_order.name,routes.origin, routes.destination, orders.estimated_delivery, users.name AS carrier_name, orders.weight, orders.declared_value FROM orders INNER JOIN status_order ON status_order.id = orders.status_order_id INNER JOIN routes ON routes.id = orders.route_id INNER JOIN users ON users.id = orders.carrier_id WHERE orders.guide_order = ?",
        [tracking_order]
      )

      if (!orderStatus || !orderStatus.length) {
        throw new Error("El número de guia no existe.")
      }

      // Guardar en Redis el estado con expiración de 60 minutos
      await redisClient.setEx(`order_status_${tracking_order}`, 3600, JSON.stringify(orderStatus))

      return orderStatus
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
            ord.guide_order,
            usr.name AS user_name,
            usr.email AS user_email,
            ord.type_product,
            ord.weight,
            ord.amount,
            ord.destination_address,
            ord.contact_receive,
            ord.contact_phone,
            ord.description_content,
            ord.declared_value,
            ord.notes_delivery,
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

      if (!orders || !orders.length) {
        throw new Error("No se encontraron ordenes.")
      }

      return orders

    } catch (error: any) {
      throw new Error(error.message)
    }

  }

  /**
   * @param route_id 
   * @param carrier_id 
   * @description Obtener disponibilidad de transportistas
   */
  public disponibility = async (route_id: number, carrier_id: number): Promise<any> => {
    try {

      let query = `
      SELECT carriers.id AS carrier_id, 
            usr.name AS carrier_name, 
            veh.licence_plate, 
            veh.model AS vehicle_model, 
            veh.type AS vehicle_type, 
            veh.capacity_kg, 
            rou.id AS route_id, 
            rou.name AS route_name, 
            carriers.availability 
      FROM carriers 
      JOIN users AS usr ON carriers.user_id = usr.id
      JOIN carriers_vehicles AS car_veh ON carriers.id = car_veh.carrier_id
      JOIN vehicles AS veh ON car_veh.vehicle_id = veh.id
      JOIN carriers_routes AS car_rou ON carriers.id = car_rou.carrier_id
      JOIN routes AS rou ON car_rou.route_id = rou.id
      WHERE carriers.availability = TRUE
      AND rou.id = ? AND carriers.id = ?`.trim()

      // Buscar en Redis la orden
      const cachedDisponibilityCarrier = await redisClient.get(`carrier_disponibility_${route_id}_${carrier_id}`)
      if (cachedDisponibilityCarrier) {
        return cachedDisponibilityCarrier
      }

      // Buscar la disponibilidad del transportista
      const [carrier]: any = await mysqlConnection.query(query, [route_id, carrier_id])

      // Verificar si hay transportistas disponibles
      if (!Array.isArray(carrier) || carrier.length === 0) {
        return [];
      }

      // Guardar en Redis el estado con expiración de 5 minutos
      await redisClient.setEx(`carrier_disponibility_${route_id}_${carrier_id}`, 300, JSON.stringify(carrier))

      return carrier

    } catch (error: any) {
      throw new Error(error.message)
    }
  }

}

