import express from 'express';
import actorRoutes from './routes/actor.routes';
import filmRoutes from './routes/film.routes';

const app = express();

app.use(express.json());

app.use('/actors', actorRoutes);
app.use('/films', filmRoutes);

export default app;
