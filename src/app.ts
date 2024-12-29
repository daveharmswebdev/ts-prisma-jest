import express from 'express';
import actorRoutes from './routes/actor.routes';
import filmRoutes from './routes/film.routes';
import { errorHandler } from './middleWares/errorHandler';

const app = express();

app.use(express.json());

app.use('/actors', actorRoutes);
app.use('/films', filmRoutes);

app.use(errorHandler);

export default app;
