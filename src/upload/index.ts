import env from "../config/env";
import fs from 'fs';
import { google } from 'googleapis';

export async function uploadToYoutube(videoPath: string, title: string, description: string, tags: string[]) {
    const CLIENT_ID = env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;
    const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

    const ACCESS_TOKEN = env.GOOGLE_ACCESS_TOKEN;
    const REFRESH_TOKEN = env.GOOGLE_REFRESH_TOKEN;

    // Initialize OAuth2 client
    const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    oauth2Client.setCredentials({
        access_token: ACCESS_TOKEN,
        refresh_token: REFRESH_TOKEN, expiry_date: Date.now() - 1000
    });

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    try {
        const res = await youtube.videos.insert({
            part: ['snippet', 'status'],
            requestBody: {
                snippet: {
                    title,
                    description,
                    tags: tags.slice(0, 3), defaultLanguage: 'en', // UI language (e.g., 'en', 'fr', 'es')
                    defaultAudioLanguage: 'en'
                },
                status: {
                    privacyStatus: 'public', // 'public', 'private', or 'unlisted'
                    madeForKids: false
                }
            },
            media: {
                body: fs.createReadStream(videoPath)
            }
        });

        return `https://www.youtube.com/watch?v=${res.data.id}`
    } catch (error) {
        let message = "Unkown error"
        if (error instanceof Error)
            message = error.message
        throw error

    }
}

