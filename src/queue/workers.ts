import { Worker } from 'bullmq';
import { redisConnection } from './connection';
import { AUDIO_QUEUE_NAME, VIDEO_QUEUE_NAME, UPLOAD_QUEUE_NAME } from './queues';
import { audioProcessor } from '../workers/audioProcessor';
import { videoProcessor } from '../workers/videoProcessor';
import { uploadProcessor } from '../workers/uploadProcessor';

export const setupWorkers = () => {
    // Audio Worker
    const audioWorker = new Worker(AUDIO_QUEUE_NAME, audioProcessor, {
        connection: redisConnection,
        concurrency: 1
    });

    audioWorker.on('completed', job => console.log(`✅ Audio Job ${job.id} done`));
    audioWorker.on('failed', (job, err) => console.error(`❌ Audio Job ${job?.id} failed: ${err.message}`));

    // Video Worker
    const videoWorker = new Worker(VIDEO_QUEUE_NAME, videoProcessor, {
        connection: redisConnection,
        concurrency: 1
    });

    videoWorker.on('completed', job => console.log(`✅ Video Job ${job.id} done`));
    videoWorker.on('failed', (job, err) => console.error(`❌ Video Job ${job?.id} failed: ${err.message}`));

    // Upload Worker
    const uploadWorker = new Worker(UPLOAD_QUEUE_NAME, uploadProcessor, {
        connection: redisConnection,
        concurrency: 1
    });

    uploadWorker.on('completed', job => console.log(`✅ Upload Job ${job.id} done`));
    uploadWorker.on('failed', (job, err) => console.error(`❌ Upload Job ${job?.id} failed: ${err.message}`));

    console.log('👷 Workers initialized: Audio, Video, & Upload');
};
