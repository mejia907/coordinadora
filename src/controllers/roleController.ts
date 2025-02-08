import { Request, Response } from 'express'
import { CreateRoleUseCase } from '@application/useCases/createRoleUseCase'

export class RoleController {
  create = async (req: Request, res: Response) => {
    await CreateRoleUseCase(req.body)
      .then((role) => res.status(201).json(role))
      .catch((error) => {
        res.status(400).json({ message: error.message })
      })
  }
}