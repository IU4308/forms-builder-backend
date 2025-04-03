import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: Number(process.env.PORT),
    nodeEnv: process.env.NODE_ENV,
};

export default config;