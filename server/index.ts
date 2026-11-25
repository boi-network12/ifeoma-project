// index.ts
import 'dotenv/config';
import { env } from './src/config/env';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { getCorsOptions } from './src/config/corsConfig';
import { logger, logRequest } from './src/config/logger';
import { corsDebug } from './src/middleware/corsDebug';
import connectDB, { getDBStatus } from './src/config/db';
import errorHandler from './src/middleware/errorHandler';
import routes from './src/routes';


const app = express();
const PORT = Number(env.PORT || 5000);

// ------------ Middleware Setup ------------
app.set('trust proxy', 1); 
app.use(helmet() as never);
app.use(cors(getCorsOptions()) as never);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logRequest);
app.use(corsDebug);

const mockDetails = {
  "email": "kamdilichukwu2020@gmail.com",
  "username": "2023/2024/ADMIN/1067",
  "password": "KAMDILIc1#",
  "role": "admin",
  "name" : {
    "firstName": "Kamdilichukwu",
    "lastName": "samuel"
  }
}

// also add here when engine starts and no admin to create admin with these mock details

// ------------ Routes Setup ------------
app.use('/api', routes);

// ----------- Health ------------
app.get('/health', async (_req, res) => {
  const dbStatus = getDBStatus();
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    database: {
      status:
        dbStatus.readyState === 1
          ? 'connected'
          : dbStatus.readyState === 2
          ? 'connecting'
          : 'disconnected',
      host: dbStatus.host,
      name: dbStatus.name,
    },
    uptime: Math.floor(process.uptime()),
  });
});

app.get('/', (_req, res) => {
  res.json({ message: 'Tesla Server', version: '1.0.0', status: 'running' });
});

// ------------ Error Handling Middleware ------------
app.use(errorHandler);

// ---------- DB connect (non-blocking) ----------
const connectWithRetry = async (retries = 5, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await connectDB();
      logger.info('✅ Database connected');
      return;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown';
      logger.error(`⚠️ DB attempt ${i + 1}/${retries} failed: ${msg}`);
      if (i < retries - 1) await new Promise((r) => setTimeout(r, delay));
    }
  }
  logger.error('❌ All DB attempts failed');
};

connectWithRetry();

// ---------- Local server + crons ----------
if (env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
    logger.info(`📍 Health: http://localhost:${PORT}/health`);
  });
}

export default app;