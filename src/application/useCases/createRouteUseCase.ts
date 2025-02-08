import RouteRepository from '@infrastructure/repositories/routeRepository'
import { RouteEntity } from '@entitites/routeEntity'

async function CreateRouteUseCase(route: RouteEntity): Promise<RouteEntity | null> {
  const routeRepository = new RouteRepository()
  return await routeRepository.create(route)
}

export { CreateRouteUseCase }