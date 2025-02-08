import OrderRepository from '@infrastructure/repositories/orderRepository'
import { OrderEntity } from '@entitites/orderEntity'

async function CreateOrderUseCase(order: OrderEntity): Promise<OrderEntity | null> {
  const orderRepository = new OrderRepository()
  return await orderRepository.create(order)
}

export { CreateOrderUseCase }