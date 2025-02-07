import { createPool } from 'mysql2/promise';
import { envs } from '@config/envs';

const mysqlConnection = createPool({
  host: envs.MYSQL_HOST,
  port: envs.MYSQL_PORT,
  user: envs.MYSQL_USER,
  password: envs.MYSQL_PASSWORD,
  database: envs.MYSQL_DATABASE
});

export default mysqlConnection;