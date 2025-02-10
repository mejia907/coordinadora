import { Request, Response } from 'express'
import { CreateRoleUseCase } from '../application/useCases/createRoleUseCase'

/**
 * @description Controlador para el manejo de roles de usuario
 */
export class RoleController {
  /**
   * @param req 
   * @param res 
   * @description Controlador para la creación de roles
   */
  create = async (req: Request, res: Response) => {
    await CreateRoleUseCase(req.body)
      .then((role) => res.status(201).json(role))
      .catch((error) => {
        res.status(400).json({ message: error.message })
      })
  }
}