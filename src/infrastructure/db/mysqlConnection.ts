import { createPool } from 'mysql2/promise'
import { envs } from '../../config/envs'

const isDocker = process.env.IS_DOCKER === 'true';

/**
 * @description Coneccion a MySQL
 */
const mysqlConnection = createPool({
  host: isDocker ? envs.MYSQL_DOCKER_HOST : envs.MYSQL_HOST,
  port: envs.MYSQL_PORT,
  user: envs.MYSQL_USER,
  password: envs.MYSQL_PASSWORD,
  database: envs.MYSQL_DATABASE,
  namedPlaceholders: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export { mysqlConnection }