import { Request, Response } from 'express'
import { CreateUserUseCase } from '../application/useCases/createUserUseCase'
import { LoginUserUseCase } from '../application/useCases/loginUserUseCase'

/**
 * @description Controlador para el manejo de usuarios
 */
export class UserController {
  /**
   * @param req 
   * @param res 
   * @description Controlador para la creación de usuarios
   */
  create = async (req: Request, res: Response) => {
    await CreateUserUseCase(req.body)
      .then((user) => res.status(201).json(user))
      .catch((error) => {
        res.status(400).json({ message: error.message })
      })
  }

  /**
   * @param req 
   * @param res 
   * @description Controlador para la autenticación de usuarios
   */
  login = async (req: Request, res: Response) => {
    await LoginUserUseCase(req.body.email, req.body.password)
      .then((user) => res.cookie("cookieApi", user?.token, { secure: true }).json({ token: user?.token, user: user?.user }))
      .catch((error) => {
        res.status(400).json({ message: error.message })
      })
  }
}