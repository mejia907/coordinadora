import 'dotenv/config'
import { get } from 'env-var'

/**
 * @description Variables de entorno
 */
export const envs = {
  MYSQL_PORT: get('MYSQL_PORT').default(3306).required().asPortNumber(),
  MYSQL_HOST: get('MYSQL_HOST').default('localhost').required().asString(),
  MYSQL_USER: get('MYSQL_USER').required().asString(),
  MYSQL_PASSWORD: get('MYSQL_PASSWORD').required().asString(),
  MYSQL_DATABASE: get('MYSQL_DATABASE').default('coordinadora').required().asString(),
  MYSQL_DOCKER_HOST: get('MYSQL_DOCKER_HOST').default('mysql').asString(),
  MYSQL_DOCKER_PORT: get('MYSQL_DOCKER_PORT').default(3306).asPortNumber(),
  SERVER_PORT: get('SERVER_PORT').default(3000).asPortNumber(),
  SERVER_DOCKER_PORT: get('SERVER_DOCKER_PORT').default(3000).asPortNumber(),
  REDIS_PORT: get('REDIS_PORT').default(6379).asPortNumber(),
  REDIS_HOST: get('REDIS_HOST').default('localhost').asString(),
  REDIS_DOCKER_HOST: get('REDIS_DOCKER_HOST').default('redis').asString(),
  JWT_SECRET: get('JWT_SECRET').asString(),
}