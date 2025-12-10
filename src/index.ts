import express from 'express';
import cors from 'cors';
import { config } from './config/env';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
import jobsRouter from './routes/jobs';
app.use('/api/jobs', jobsRouter);

// Basic Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start Server
const startServer = async () => {
    try {
        // Initialize Workers
        const { setupWorkers } = await import('./queue/workers');
        setupWorkers();

        app.listen(config.port, () => {
            console.log(`🚀 Rainflow Server running on port ${config.port}`);
            console.log(`   Environment: ${config.env}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
