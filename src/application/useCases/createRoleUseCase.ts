import RoleRepository from '@infrastructure/repositories/roleRespository'
import { RoleEntity } from '@entitites/roleEntity'

async function CreateRoleUseCase(role: RoleEntity): Promise<RoleEntity | null> {
  const roleRepository = new RoleRepository()
  return await roleRepository.create(role)
}

export { CreateRoleUseCase }