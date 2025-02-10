import OrderRepository from '../../infrastructure/repositories/orderRepository'

/**
 * @param order_id 
 * @param route_id 
 * @param carrier_id 
 * @param estimated_delivery 
 * @description UseCase para asignar una ruta a una orden
 */
async function AssignRouteUseCase(order_id: number, route_id: number, carrier_id: number, estimated_delivery: Date): Promise<void> {
  const orderRepository = new OrderRepository()
  return await orderRepository.assignRoute(order_id, route_id, carrier_id, estimated_delivery)
}

export { AssignRouteUseCase }