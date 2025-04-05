import express from 'express';
import config from './config/env.js';
import authRouter from './routes/auth.routes.js';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import usersRouter from './routes/users.routes.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors({
  origin: config.frontendUrl, 
  credentials: true
}))

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)

app.use(errorHandler)

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

export default app;