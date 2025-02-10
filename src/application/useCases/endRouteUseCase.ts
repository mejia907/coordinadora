import OrderRepository from '../../infrastructure/repositories/orderRepository'

/**
 * @param order_id 
 * @param actual_delivery 
 * @description UseCase para finalizar una orden
 */
async function EndRouteUseCase(order_id: number, actual_delivery: Date): Promise<void> {
  const orderRepository = new OrderRepository()
  return await orderRepository.endRoute(order_id, actual_delivery)
}

export { EndRouteUseCase }