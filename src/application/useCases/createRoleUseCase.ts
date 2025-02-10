import RoleRepository from '../../infrastructure/repositories/roleRespository'
import { RoleEntity } from '../../entities/roleEntity'

/**
 * @param role 
 * @description UseCase para crear un rol de usuario
 */
async function CreateRoleUseCase(role: RoleEntity): Promise<RoleEntity | null> {
  const roleRepository = new RoleRepository()
  return await roleRepository.create(role)
}

export { CreateRoleUseCase }