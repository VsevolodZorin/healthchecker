import { DataSource } from 'typeorm';
import { config } from 'src/config';

const db = new DataSource(config.orm);

export default db;
