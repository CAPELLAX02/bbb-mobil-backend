import path from 'path';
import express from 'express';
import cors from 'cors';
// import dotenv from 'dotenv';
// dotenv.config();
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import issueRoutes from './routes/issueRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import helmet from 'helmet';

const port = process.env.PORT || 8000;

const app = express();

connectDB(); // Connect to database

app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

// CORS için yapılandırma
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('INTERVAL SERVER HATASI!');
});

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Bu middleware'lar, JSON ve URL kodlu verileri işleyerek req.body içinde kullanılabilir hale getirir.

// Allow using jwt's
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('API is running');
});

// Use Issue Routes
app.use('/api/issues', issueRoutes);

// Use User Routes
app.use('/api/users', userRoutes);

// Use Upload Routes
app.use('/api/upload', uploadRoutes);

// Use Admin Routes
app.use('/api/admin', adminRoutes);

// Set __dirname to current directory
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
