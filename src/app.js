import express from 'express';
import config from './config/env.js';
import authRouter from './routes/auth.routes.js';
import { getUsers } from './controllers/auth.controller.js';

const app = express();

app.use('/api/auth', authRouter)

app.get('/api', getUsers)

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

export default app;