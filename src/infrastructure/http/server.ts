import express, { Router } from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

interface ServerProps {
  port?: number
  routes: Router
}
export class Server {

  public readonly app = express()
  public readonly port: number
  public readonly routes: Router

  constructor(props: ServerProps) {
    const { port, routes } = props
    this.port = port ?? 3000
    this.routes = routes
  }

  async start() {
    this.app.use(morgan('dev')) // Muestra las peticiones en consola
    this.app.use(express.json()) // Parsea el cuerpo de la solicitud
    this.app.use(cookieParser()) // Parsea las cookies
    this.app.use(express.urlencoded({ extended: true })) // Parsea el cuerpo de la solicitud

    this.app.use(this.routes) // Rutas

    // Inicia el servidor
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`)
    })
  }
}
