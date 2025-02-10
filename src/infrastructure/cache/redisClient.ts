import { createClient } from 'redis'
import { envs } from '../../config/envs'

const isDocker = process.env.IS_DOCKER === 'true';

/**
 * @description Coneccion a Redis
 */
const redisClient = createClient({
  socket: {
    host: isDocker ? envs.REDIS_DOCKER_HOST : envs.REDIS_HOST,
    port: envs.REDIS_PORT,
    reconnectStrategy: (retries) => Math.min(retries * 100, 3000), // Reintenta cada 3s
  },

})

redisClient.on("error", (err) => {
  throw new Error(`Redis Error: ${err.message}`)
})

redisClient.on("connect", () => {
  console.log("Conectado a Redis")
});

(async () => {
  await redisClient.connect()
})()

export default redisClient
