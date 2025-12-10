import { Queue } from 'bullmq';
import { redisConnection } from './connection';

export const AUDIO_QUEUE_NAME = 'audio-generation';
export const VIDEO_QUEUE_NAME = 'video-rendering';
export const UPLOAD_QUEUE_NAME = 'youtube-upload';

export const audioQueue = new Queue(AUDIO_QUEUE_NAME, { connection: redisConnection });
export const videoQueue = new Queue(VIDEO_QUEUE_NAME, { connection: redisConnection });
export const uploadQueue = new Queue(UPLOAD_QUEUE_NAME, { connection: redisConnection });
