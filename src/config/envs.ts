import 'dotenv/config'
import { get } from 'env-var'

export const envs = {
  MYSQL_PORT: get('MYSQL_PORT').default(3306).required().asPortNumber(),
  MYSQL_HOST: get('MYSQL_HOST').default('localhost').required().asString(),
  MYSQL_USER: get('MYSQL_USER').required().asString(),
  MYSQL_PASSWORD: get('MYSQL_PASSWORD').required().asString(),
  MYSQL_DATABASE: get('MYSQL_DATABASE').default('coordinadora').required().asString()
}