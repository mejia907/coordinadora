import OrderRepository from '@infrastructure/repositories/orderRepository'

/**
 * @param order_id 
 * @description UseCase para obtener reporte general por fechas
 */
async function GetOrderAllUseCase(start_date: string, end_date: string, limit: number, offset: number, status_order_id?: number, carrier_id?: number): Promise<string> {
  const orderRepository = new OrderRepository()
  return await orderRepository.orderAll(start_date, end_date, limit, offset, status_order_id, carrier_id)
}

export { GetOrderAllUseCase }