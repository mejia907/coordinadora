import CarrierRepository from '@infrastructure/repositories/carrierRepository'
import { CarrierEntity } from '@entitites/carrierEntity'

async function CreatecarrierUseCase(carrier: CarrierEntity): Promise<CarrierEntity | null> {
  const carrierRepository = new CarrierRepository()
  return await carrierRepository.create(carrier)
}

export { CreatecarrierUseCase }