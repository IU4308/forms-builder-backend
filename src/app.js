import express from 'express';
import config from './config/config.js';
import authRouter from './routes/auth.routes.js';

const app = express();

app.use('/api/auth', authRouter)

app.get('/api', (req, res) => {
    console.log('Connected')
    res.send("Hello World")
})

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

export default app;