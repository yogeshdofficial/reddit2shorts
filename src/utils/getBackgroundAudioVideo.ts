import { mkdir, access } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { error } from 'console';

const execAsync = promisify(exec);
async function fileExists(filePath: string) {
    try {
        await access(filePath);
        return true;
    } catch {
        return false;
    }
}

export async function downloadBackgroundAssets(videoUrl: string, audioUrl: string) {
    const shortsDir = "shorts"
    const mp3Path = path.join(shortsDir, 'background.mp3');
    const mp4Path = path.join(shortsDir, 'background.mp4');

    try {
        // Ensure 'shorts/' directory exists
        await mkdir(shortsDir, { recursive: true });

        // Download MP3 if it doesn't exist
        if (!(await fileExists(mp3Path))) {
            console.log('Downloading MP3...');
            await execAsync(`yt-dlp -x --audio-format mp3 -o "${shortsDir}/background.%(ext)s" "${videoUrl}"`);
        } else {
            // console.log('MP3 already exists.');
        }

        // Download MP4 if it doesn't exist
        if (!(await fileExists(mp4Path))) {
            console.log('Downloading MP4...');
            await execAsync(`yt-dlp -f bestvideo+bestaudio --merge-output-format mp4 -o "${shortsDir}/background.%(ext)s" "${audioUrl}"`);
        } else {
            // console.log('MP4 already exists.');
        }

    } catch (err) {
        let message = "Unkown error"
        if (error instanceof Error)
            message = error.message
        console.error('Error:', message);
    }
}

