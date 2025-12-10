import { google } from 'googleapis';
import fs from 'fs';
import { getOAuth2Client } from './auth';

export class YouTubeUploader {
    private auth: any;

    constructor(refreshToken: string) {
        this.auth = getOAuth2Client();
        this.auth.setCredentials({ refresh_token: refreshToken });
    }

    async uploadVideo(filePath: string, metadata: any) {
        const youtube = google.youtube({ version: 'v3', auth: this.auth });

        console.log(`[YouTube] Uploading ${filePath}...`);

        const fileSize = fs.statSync(filePath).size;

        const res = await youtube.videos.insert({
            part: ['snippet', 'status'],
            requestBody: {
                snippet: {
                    title: metadata.title,
                    description: metadata.description,
                    tags: metadata.tags,
                    categoryId: '10' // Music
                },
                status: {
                    privacyStatus: 'private', // Always upload as private first
                    publishAt: metadata.publishAt // Schedule if provided
                }
            },
            media: {
                body: fs.createReadStream(filePath)
            }
        }, {
            // Show upload progress
            onUploadProgress: evt => {
                const progress = (evt.bytesRead / fileSize) * 100;
                console.log(`[YouTube] Progress: ${Math.round(progress)}%`);
            }
        });

        console.log(`[YouTube] Upload complete! Video ID: ${res.data.id}`);
        return res.data;
    }
}
