import RouteRepository from '@infrastructure/repositories/routeRepository'
import { RouteEntity } from '@entitites/routeEntity'

/**
 * @param route 
 * @description UseCase para crear una ruta de envio
 */
async function CreateRouteUseCase(route: RouteEntity): Promise<RouteEntity | null> {
  const routeRepository = new RouteRepository()
  return await routeRepository.create(route)
}

export { CreateRouteUseCase }