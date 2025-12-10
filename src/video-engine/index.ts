import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export class VideoEngine {

    /**
     * Creates a seamless "Boomerang" loop (Forward + Reverse) from a short video.
     * This prevents jump-cuts in the final video.
     */
    async createBoomerangLoop(inputPath: string, outputPath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            console.log(`[VideoEngine] Creating boomerang loop from ${inputPath}...`);

            // ffmpeg -i input.mp4 -filter_complex "[0:v]reverse[r];[0:v][r]concat=n=2:v=1:a=0" -c:v libx264 -preset fast -crf 18 temp_loop_base.mp4
            const args = [
                '-y',
                '-i', inputPath,
                '-filter_complex', '[0:v]reverse[r];[0:v][r]concat=n=2:v=1:a=0',
                '-c:v', 'libx264',
                '-preset', 'fast',
                '-crf', '18',
                outputPath
            ];

            const ffmpeg = spawn('ffmpeg', args);

            ffmpeg.stderr.on('data', (data) => {
                // FFmpeg logs to stderr
                // console.log(`[FFmpeg] ${data}`);
            });

            ffmpeg.on('close', (code) => {
                if (code === 0) {
                    console.log(`[VideoEngine] Boomerang loop created at ${outputPath}`);
                    resolve(outputPath);
                } else {
                    reject(new Error(`FFmpeg exited with code ${code}`));
                }
            });
        });
    }

    /**
     * Renders the final video by looping the boomerang base and merging with audio.
     * Uses stream copy for extreme speed.
     */
    async renderFinalVideo(videoLoopPath: string, audioPath: string, outputPath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            console.log(`[VideoEngine] Rendering final video to ${outputPath}...`);

            // ffmpeg -stream_loop -1 -i temp_loop_base.mp4 -i audio.wav -map 0:v -map 1:a -c:v copy -shortest output.mp4
            const args = [
                '-y',
                '-stream_loop', '-1',
                '-i', videoLoopPath,
                '-i', audioPath,
                '-map', '0:v',
                '-map', '1:a',
                '-c:v', 'copy', // Stream copy!
                '-c:a', 'aac',  // Encode audio to AAC
                '-b:a', '192k',
                '-shortest',
                outputPath
            ];

            const ffmpeg = spawn('ffmpeg', args);

            ffmpeg.stderr.on('data', (data) => {
                // console.log(`[FFmpeg] ${data}`);
            });

            ffmpeg.on('close', (code) => {
                if (code === 0) {
                    console.log(`[VideoEngine] Final video rendered successfully!`);
                    resolve(outputPath);
                } else {
                    reject(new Error(`FFmpeg exited with code ${code}`));
                }
            });
        });
    }
}
