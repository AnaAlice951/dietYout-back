import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import mealsRoutes from './routes/meals';
import recipesRoutes from './routes/recipes';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/meals', mealsRoutes);
app.use('/recipes', recipesRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
