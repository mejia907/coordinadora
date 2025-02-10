import CarrierRepository from '../../infrastructure/repositories/carrierRepository'
import { CarrierEntity } from '../../entities/carrierEntity'

/**
 * @param carrier 
 * @description UseCase para crear un transportista
 */
async function CreatecarrierUseCase(carrier: CarrierEntity): Promise<CarrierEntity | null> {
  const carrierRepository = new CarrierRepository()
  return await carrierRepository.create(carrier)
}

export { CreatecarrierUseCase }