import { Job } from 'bullmq';
import { AudioGenerator } from '../audio-engine/generator';
import path from 'path';
import fs from 'fs';
import { config } from '../config/env';

// Singleton instance to reuse browser
const generator = new AudioGenerator();
let isGeneratorReady = false;

export const audioProcessor = async (job: Job) => {
    console.log(`[Worker] Processing job ${job.id}: ${job.name}`);
    const { duration, seed, category } = job.data;

    try {
        if (!isGeneratorReady) {
            await generator.init();
            isGeneratorReady = true;
        }

        // Ensure storage directory exists
        const outputDir = path.join(config.paths.storage, 'generated_audio');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const fileName = `rain_${category || 'default'}_${seed || 'random'}_${Date.now()}.wav`;
        const outputPath = path.join(outputDir, fileName);

        console.log(`[Worker] Generating audio (${duration}s)...`);
        await generator.generateAudio(duration || 10, seed || 'random', category || 'rain', outputPath);

        console.log(`[Worker] Audio generated at ${outputPath}`);

        // Chain: Trigger Video Generation
        const videoJob = await import('../queue/queues').then(m => m.videoQueue.add('render-video', {
            audioPath: outputPath,
            videoSourcePath: null, // Will use default
            seed,
            category
        }));
        console.log(`[Worker] Triggered Video Job: ${videoJob.id}`);

        return { filePath: outputPath };
    } catch (error) {
        console.error(`[Worker] Generation failed:`, error);
        // If browser crashed, reset ready state
        isGeneratorReady = false;
        throw error;
    }
};
