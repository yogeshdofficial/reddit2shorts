<!--
	README: professional, concise, and actionable.
	- Overview
	- Features
	- Quick start (install + run)
	- Configuration (environment variables)
	- Usage examples
	- Troubleshooting & contributing
-->

# reddit2shorts

Create short, shareable YouTube Shorts from Reddit text posts (title + top comments). The project automates:

- Fetching text posts and top comments from Reddit
- Generating speech using TTS providers (Google Cloud, TikTok)
- Creating screenshots for posts/comments
- Composing and combining video segments with `ffmpeg`
- Optional upload to YouTube

## Features

- Modular TTS support (Google Cloud, TikTok)
- Reusable screenshots for clean visuals
- Configurable comment count and background media
- Upload integration for YouTube

---

## Quick start

Prerequisites

- `node` (v16+ or v18+ recommended)
- `pnpm` or `npm`
- `ffmpeg` (available on PATH)
- `yt-dlp` or `youtube-dl` (for background assets)

Install and prepare

```bash
git clone https://github.com/yogeshdofficial/reddit2shorts.git
cd reddit2shorts
mv .env.example .env    # edit .env with your credentials (see below)
pnpm install            # or npm install
npx puppeteer browsers install chrome
```

Run a quick example

```bash
ts-node --logError src/cli.ts --random --upload youtube
```

---

## Configuration

All runtime secrets and options are provided via environment variables. Copy `.env.example` to `.env` and fill in values.

Required variables (short description):

- `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`, `REDDIT_USERNAME`, `REDDIT_PASSWORD` — Reddit API credentials (create a "script" app at https://www.reddit.com/prefs/apps).
- `GOOGLE_CREDENTIALS` — Service account JSON for Google APIs. You can set the JSON content directly or point to a file depending on your runtime; ensure the Text-to-Speech and YouTube Data APIs are enabled.
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_ACCESS_TOKEN`, `GOOGLE_REFRESH_TOKEN` — OAuth credentials for flows that require user consent (refer to Google OAuth docs or OAuth Playground).
- `GEMINI_API_KEY` — Optional (if using Gemini or other LLM integrations).
- `TIKTOK_SESSION_ID` — Required only when using the TikTok TTS implementation.

Security note: Do not commit `.env` or credential files to source control. Use secret managers for production deployments.

Helpful links

- Google Cloud Console: https://console.cloud.google.com/
- Reddit apps: https://www.reddit.com/prefs/apps

---

## Usage

Run `ts-node src/cli.ts --help` to view all options. Common flags:

- `--random` : choose a random text post from configured subreddits
- `--postId <id>` : create a short from a specific post id
- `--commentsCount <n>` : number of top comments to include (default: 10)
- `--tts google|tiktok` : select TTS provider (default: `google`)
- `--upload youtube` : upload the created short to YouTube

Example (generate & upload):

```bash
ts-node src/cli.ts --random --commentsCount 8 --tts google --upload youtube
```

Example (generate a short from a post id without upload):

```bash
ts-node src/cli.ts --postId t3_abcdef --commentsCount 5 --tts tiktok
```

### Background assets

You can specify background audio/video URLs via CLI options (`--bgAudio`, `--bgVideo`) or use the defaults in the code. The CLI accepts multiple values for each and will randomly select one when producing the short.

---

## Troubleshooting

- If audio/video generation fails, verify `ffmpeg` and `yt-dlp` are installed and reachable via PATH.
- For Google TTS/YouTube upload errors, confirm your `GOOGLE_CREDENTIALS` and OAuth tokens are valid and that the corresponding APIs are enabled.
- If Puppeteer fails to download browsers, run `npx puppeteer browsers install chrome` or check network/proxy settings.

---

## Contributing

Contributions welcome — please open issues or pull requests. Suggested workflow:

1. Fork the repository
2. Create a feature branch
3. Add tests where applicable
4. Open a PR with a clear description

---

## License & Contact

MIT License — see `LICENSE` file (if present).

Maintainer: @yogeshdofficial — https://github.com/yogeshdofficial
