import OrderRepository from '../../infrastructure/repositories/orderRepository'
import { OrderEntity } from '../../entities/orderEntity'

/**
 * @param order 
 * @description UseCase para crear una orden
 */
async function CreateOrderUseCase(user_id: number, order: OrderEntity): Promise<OrderEntity | null> {
  const orderRepository = new OrderRepository()
  return await orderRepository.create(user_id, order)
}

export { CreateOrderUseCase }