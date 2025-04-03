import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: Number(process.env.PORT),
    nodeEnv: process.env.NODE_ENV,
    dbUrl: process.env.DATABASE_URL
};

export default config;