import express, { Request, Response } from 'express';
import actorRoutes from './routes/actor.routes';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/actors', actorRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
