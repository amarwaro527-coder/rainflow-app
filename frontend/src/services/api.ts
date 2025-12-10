import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Job {
    id: string;
    data: {
        duration: number;
        seed: string;
        category: string;
    };
    status: string;
    progress?: number;
}

export const jobService = {
    // Create a new audio generation job
    createJob: async (duration: number, category: string) => {
        const response = await api.post('/api/jobs', {
            duration,
            category,
            seed: Math.random().toString(36).substring(7),
        });
        return response.data;
    },

    // Get health status
    getHealth: async () => {
        const response = await api.get('/health');
        return response.data;
    }
};
