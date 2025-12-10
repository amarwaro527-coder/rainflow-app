import { Pool } from 'pg';
import { config } from '../config/env';
import fs from 'fs';
import path from 'path';

export const pool = new Pool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
});

export const initDb = async () => {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        const client = await pool.connect();
        await client.query(schemaSql);
        client.release();

        console.log('📦 Database initialized successfully');
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
    }
};
