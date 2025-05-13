import dotenv from 'dotenv';

dotenv.config();

const config = {
    BASE_URL: process.env.BASE_URL,
    port: Number(process.env.PORT),
    nodeEnv: process.env.NODE_ENV,
    dbUrl: process.env.DATABASE_URL,
    frontendUrl: process.env.FRONTEND_URL,
    secretKey: process.env.AUTH_SECRET,
    SF_INSTANCE_URL: process.env.SF_INSTANCE_URL,
    SF_CLIENT_ID: process.env.SF_CLIENT_ID,
    SF_LOGIN_URL: process.env.SF_LOGIN_URL,
    SF_USERNAME: process.env.SF_USERNAME,
    SF_PASSWORD: process.env.SF_PASSWORD,
    DROPBOX_CLIENT_ID: process.env.DROPBOX_CLIENT_ID,
    DROPBOX_CLIENT_SECRET: process.env.DROPBOX_CLIENT_SECRET,
    DROPBOX_REFRESH_TOKEN: process.env.DROPBOX_REFRESH_TOKEN,
};

export default config;