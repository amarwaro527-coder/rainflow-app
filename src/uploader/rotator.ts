import { pool } from '../database';
import { YouTubeUploader } from './youtube';

export class AccountRotator {

    /**
     * Finds the next available account with sufficient quota.
     * Resets quota if the day has changed.
     */
    async getNextAvailableAccount(): Promise<YouTubeUploader | null> {
        const client = await pool.connect();
        try {
            // 1. Reset quotas if new day
            await client.query(`
                UPDATE accounts 
                SET daily_quota_used = 0, last_reset_date = CURRENT_DATE 
                WHERE last_reset_date < CURRENT_DATE
            `);

            // 2. Find active account with quota < limit
            // We assume an upload costs ~1600 units
            const res = await client.query(`
                SELECT * FROM accounts 
                WHERE is_active = true 
                AND daily_quota_used + 1600 <= quota_limit
                ORDER BY daily_quota_used ASC
                LIMIT 1
            `);

            if (res.rows.length === 0) {
                console.warn('[Rotator] No available accounts with quota!');
                return null;
            }

            const account = res.rows[0];
            console.log(`[Rotator] Selected account: ${account.email} (Quota: ${account.daily_quota_used}/${account.quota_limit})`);

            // 3. Return Uploader instance with this account's credentials
            // Note: In a real app, we might need to handle client_id/secret per account if they differ
            return new YouTubeUploader(account.refresh_token);

        } catch (error) {
            console.error('[Rotator] Error selecting account:', error);
            return null;
        } finally {
            client.release();
        }
    }

    /**
     * Updates the quota usage for an account after an upload.
     */
    async updateQuota(email: string, unitsUsed: number) {
        await pool.query(`
            UPDATE accounts 
            SET daily_quota_used = daily_quota_used + $1 
            WHERE email = $2
        `, [unitsUsed, email]);
    }
}
