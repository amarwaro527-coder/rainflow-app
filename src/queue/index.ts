import { Queue, Worker } from 'bullmq';
import { redisConnection } from './connection';
import { audioProcessor } from '../workers/audioProcessor';

export const AUDIO_QUEUE_NAME = 'audio-generation';

// The Queue instance (used to add jobs)
export const audioQueue = new Queue(AUDIO_QUEUE_NAME, {
    connection: redisConnection
});

// Function to start the worker (consumer)
export const setupWorkers = () => {
    const worker = new Worker(AUDIO_QUEUE_NAME, audioProcessor, {
        connection: redisConnection,
        concurrency: 1 // Limit to 1 concurrent job to prevent CPU overload
    });

    worker.on('completed', job => {
        console.log(`✅ Job ${job.id} completed successfully`);
    });

    worker.on('failed', (job, err) => {
        console.error(`❌ Job ${job?.id} failed: ${err.message}`);
    });

    console.log('👷 Audio Worker initialized and listening...');
};
