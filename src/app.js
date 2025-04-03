import express from 'express';
import config from './config/env.js';
import authRouter from './routes/auth.routes.js';
import { getUsers } from './controllers/auth.controller.js';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors())
// app.use(cors({
//     origin: config.frontendUrl, 
//     methods: ["GET", "POST", "PUT", "DELETE"],  
//     allowedHeaders: ["Content-Type", "Authorization"],  
// }));

app.use('/api/auth', authRouter)
app.use(errorHandler)

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

export default app;