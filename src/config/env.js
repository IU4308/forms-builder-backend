import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: Number(process.env.PORT),
    nodeEnv: process.env.NODE_ENV,
    dbUrl: process.env.DATABASE_URL,
    frontendUrl: process.env.FRONTEND_URL,
    secretKey: process.env.AUTH_SECRET,
    sfAccessToken: process.env.SF_ACCESS_TOKEN,
    sfInstanceUrl: process.env.SF_INSTANCE_URL,
};

export default config;