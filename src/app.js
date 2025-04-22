import express from 'express';
import { createServer } from 'http';
import config from './config/env.js';
import authRouter from './routes/auth.routes.js';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import usersRouter from './routes/users.routes.js';
import cookieParser from 'cookie-parser';
import adminRouter from './routes/admin.routes.js';
import templatesRouter from './routes/templates.routes.js';
import formsRouter from './routes/forms.routes.js';
import homeRouter from './routes/home.routes.js';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app)
const io = new Server(server, {
  cors: {
      origin: '*',
  }
});
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors({
  origin: config.frontendUrl, 
  credentials: true
}))

app.use('/api', homeRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/admin', adminRouter)
app.use('/api/templates', templatesRouter)
app.use('/api/forms', formsRouter)

io.on('connection', async (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
})

app.use(errorHandler)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});