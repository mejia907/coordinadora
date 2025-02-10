import OrderRepository from '../../infrastructure/repositories/orderRepository'

/**
 * @param order_id 
 * @description UseCase para obtener el estado de una orden
 */
async function GetOrderStatusUseCase(tracking: number): Promise<string> {
  const orderRepository = new OrderRepository()
  return await orderRepository.getOrderStatus(tracking)
}

export { GetOrderStatusUseCase }