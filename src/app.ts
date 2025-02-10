import { envs } from './config/envs'
import { Routes } from './infrastructure/http/routes/routes'
import { Server } from './infrastructure/http/server'


/**
 * Función principal que se encarga de iniciar el servidor
 */
(() => {
  main()
})()

async function main() {
  const server = new Server({
    port: envs.SERVER_PORT,
    routes: Routes.routes
  })
  await server.start()
}