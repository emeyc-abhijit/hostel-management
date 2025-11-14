import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import roomsRoutes from './routes/rooms';
import studentsRoutes from './routes/students';
import feesRoutes from './routes/fees';
import { connectDB } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/fees', feesRoutes);

// health
app.get('/health', (_, res) => res.json({ ok: true }));

(async () => {
  const mongo = process.env.MONGO_URI || 'mongodb://localhost:27017/medhavi';
  await connectDB(mongo);
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
