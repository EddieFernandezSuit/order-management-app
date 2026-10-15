import express from 'express';
import cors from 'cors';
import menuRouter from './routes/menu.js';
import ordersRouter from './routes/orders.js';

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS;
app.use(cors(allowedOrigins ? { origin: allowedOrigins.split(',') } : {}));
app.use(express.json());
app.use('/api/menu', menuRouter);
app.use('/api/orders', ordersRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status >= 500) {
    console.error(err);
  }
  res.status(status).json({ error: err.message || 'Internal server error' });
});

export default app;