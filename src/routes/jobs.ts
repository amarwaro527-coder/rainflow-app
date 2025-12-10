import { Router } from 'express';
import { audioQueue } from '../queue/queues';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const { duration, seed, category } = req.body;

        const job = await audioQueue.add('generate-audio', {
            duration: parseInt(duration) || 10,
            seed: seed || Math.random().toString(36).substring(7),
            category: category || 'rain noise'
        });

        res.json({
            status: 'success',
            message: 'Job added to queue',
            jobId: job.id
        });
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;
