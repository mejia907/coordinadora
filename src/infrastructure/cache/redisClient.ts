import { createClient } from 'redis'
import { envs } from '@config/envs'

/**
 * @description Coneccion a Redis
 */
const redisClient = createClient({
  socket: {
    host: envs.REDIS_HOST,
    port: envs.REDIS_PORT,
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
