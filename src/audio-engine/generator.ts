import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

export class AudioGenerator {
    private browser: any;

    async init() {
        this.browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
        });
    }

    async close() {
        if (this.browser) await this.browser.close();
    }

    async generateAudio(duration: number, seed: string, category: string, outputPath: string): Promise<string> {
        if (!this.browser) await this.init();

        const page = await this.browser.newPage();

        // Load the renderer HTML file
        const rendererPath = `file://${path.join(__dirname, 'renderer.html')}`;
        await page.goto(rendererPath);

        // Prepare Audio Data (Read from disk to avoid CORS in headless browser)
        const audioAssetsPath = path.join(process.cwd(), 'public', 'audio', category);
        const audioData: { [key: string]: string } = {};

        console.log(`[Generator] Loading audio assets from ${audioAssetsPath}...`);

        if (fs.existsSync(audioAssetsPath)) {
            for (let i = 0; i < 10; i++) {
                const fileA = path.join(audioAssetsPath, `${i}a.wav`);
                const fileB = path.join(audioAssetsPath, `${i}b.wav`);

                if (fs.existsSync(fileA)) audioData[`${i}a`] = fs.readFileSync(fileA).toString('base64');
                if (fs.existsSync(fileB)) audioData[`${i}b`] = fs.readFileSync(fileB).toString('base64');
            }
        } else {
            console.warn(`[Generator] Audio assets not found at ${audioAssetsPath}. Using silence.`);
        }

        // Inject logic to trigger render
        console.log(`[Generator] Triggering render on page...`);

        // Evaluate the render function in the browser context
        const base64Data = await page.evaluate(async (d: number, s: string, c: string, assets: any) => {
            // @ts-ignore
            return await window.engine.render(d, s, c, assets);
        }, duration, seed, category, audioData);

        // Save to file
        const buffer = Buffer.from(base64Data.split(',')[1], 'base64');
        fs.writeFileSync(outputPath, buffer);

        console.log(`[Generator] Audio saved to ${outputPath}`);

        await page.close();
        return outputPath;
    }
}
