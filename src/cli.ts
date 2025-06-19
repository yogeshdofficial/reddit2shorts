import { Command } from "commander";
import "dotenv/config";
import ora from "ora";
import { Submission } from "snoowrap";
import env from "./config/env";
import { subreddits } from "./constants/subreddits";
import { SnoowrapReddit } from "./reddit/impl/snoowrapReddit";
import { createShortFromPost } from "./shortsCreation";
import { GoogleCloudTts } from "./tts/impl/googleCloudTts";
import { TiktokTts } from "./tts/impl/tiktokTts";
import { TtsInterface } from "./tts/tts";
import { uploadToYoutube } from "./upload";
import { downloadBackgroundAssets } from "./utils/getBackgroundAudioVideo";
import { getShortTitle } from "./utils/getShortTitle";

const program = new Command()

program.name("reddit2shorts").description("Make youtube shorts from reddit posts").version("1.0.0").
    option("-s --subreddits <subreddit...>", "List of subreddits to choose text post from", subreddits).
    option("-r, --random ", "Make short from a random post").
    option("-p, --postId <postId>", "Make short from the post with id").
    option("-c --commentsCount <commentsCount>", "Number of comments to include", "10").
    option("-t --tts <tts>", "Which tts to use", "google").
    option("-u --upload <platform>", "Upload to platform").
    option("--gTtsVoice <gTtsVoice>", "Voice of google tts", "en-US-Wavenet-F",).
    option("--gTtsLang <gTtsLang>", "Language of google tts","en-US",).
    option("--gTtsGender <gTtsGender>", "Gender of google tts", "FEMALE").
    option("-x --category <category>", "Category to choose random from","hot").
    option("-y --timeSpan <timeSpan>", "Timespan to choose random from(only for categories top and controversial)","day").
    option("-g --tags <tags...>", "Tags for video title", ["shorts", "reddit", "redditstories"]).
    option("-a --bgAudio <bgAudio>", "Background audio", "https://www.youtube.com/watch?v=xy_NKN75Jhw").
    option("-v --bgVideo <bgVideo>", "Background video", "https://www.youtube.com/watch?v=XBIaqOm0RKQ")


program.parse(process.argv);

const options = program.opts();

async function main() {
    if (!options.postId && !options.random) {
        console.error("Error: You must provide either --id <postId> or --random");
        process.exit(1);
    }
    const reddit = new SnoowrapReddit(
        env.REDDIT_CLIENT_ID,
        env.REDDIT_CLIENT_SECRET,
        env.REDDIT_USERNAME,
        env.REDDIT_PASSWORD
    );

    let post: Submission | undefined;
    let tts: TtsInterface | undefined;
    if (options.random) {
        post = await reddit.getTextOnlyPostFromList(options.subreddits,options.category,options.timeSpan)
    } else if (options.postId) {
        post = await reddit.getPost(options.postId)
    }

    if (!post) {
        console.error("Error: Could not fetch the Reddit post.");
        process.exit(1);
    }

    if (options.tts == "google")
        tts = new GoogleCloudTts(options.gTtsLang,options.gTtsVoice,options.gTtsGender);
    else if (options.tts == "tiktok")
        tts = new TiktokTts()

    if (!tts) {
        console.error("Error: Invalid TTS option.");
        process.exit(1);
    }

    const spinner = ora("Getting background assets ready").start()
    await downloadBackgroundAssets(options.bgVideo, options.bgAudio)
    spinner.succeed("Background assets ready")

    const output = await createShortFromPost({ post, reddit, tts, commentsCount: options.commentsCount });

    if (options.upload == "youtube") {
        const shortTitle = await getShortTitle(post.title, post.subreddit_name_prefixed)
        // console.log(shortTitle);

        if (!shortTitle) {
            console.error("Coudn't get short title");
            process.exit(1);
        }
        try {
            const spinner = ora("Uploading to youtube").start()
            const url = await uploadToYoutube(output, `${shortTitle}`, "", [post.subreddit_name_prefixed.split("/")[1], ...options.tags])
            spinner.succeed(`Uploaded to youtube: ${url}`)
        } catch {
            spinner.fail(`Error uploading to youtube`)
        }
        
    }
}


main()