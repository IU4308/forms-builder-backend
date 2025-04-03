import { drizzle } from "drizzle-orm/node-postgres";
import pkg from 'pg';
const { Pool } = pkg;
// import { Pool } from "pg";
import config from "./env.js";


const pool = new Pool({
  connectionString: config.dbUrl,
  ssl: {
    rejectUnauthorized: false, 
  },
});

export const db = drizzle(pool);