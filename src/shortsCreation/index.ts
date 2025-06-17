import { Submission } from "snoowrap";
import { RedditInterface } from "../reddit/RedditInterface";
import { TtsInterface } from "../tts/tts";
import { combineVideos, addBackgroundMusic, addBackgroundVideo } from "./utils/ffmpeg";
import { mkdir, readdir, rm } from "fs/promises";
import { SnoowrapReddit } from "../reddit/impl/snoowrapReddit";
import { formatDistanceToNow, fromUnixTime } from "date-fns";
import * as cheerio from "cheerio";
import numbro from "numbro";
import path from "path";
import { createVideoFromImageAndAudio } from "./utils/ffmpeg";
import { screenshotComment, screenshotPost } from "./utils/redditScreenshot";
import { replaceRedditAbbreviations } from "./utils/replaceAbbrevations";
import ora from "ora";

export async function createShortFromPost({
    post,
    reddit,
    tts, commentsCount
}: {
    post: Submission;
    reddit: RedditInterface;
    tts: TtsInterface;
    commentsCount: number
}) {
    const comments = await reddit.getTopComments(post, commentsCount, true, true);

    const shortsFolderPath = `shorts`;
    const postFolderPath = `shorts/${post.permalink.split('/').filter(Boolean).pop()}`;
    const imgFolderPath = `${postFolderPath}/images`;
    const audioFolderPath = `${postFolderPath}/audio`;
    const videoFolderPath = `${postFolderPath}/video`;

    const spinner1 = ora("Creating required directories").start()
    await createRequiredDirectories({
        shortsFolderPath,
        postFolderPath,
        imgFolderPath,
        audioFolderPath,
        videoFolderPath,
    });
    spinner1.succeed("Created required directories")

    const spinner2 = ora("Creating title audio and screenshot").start()
    await createTitleAudioAndScreenshot({
        post,
        tts,
        reddit,
        audioFolderPath,
        imgFolderPath,
    });
    spinner2.succeed("Created title audio and screenshots")

    const spinner3 = ora("Creating comments audio").start()
    await createCommentsAudio({ comments, audioFolderPath, tts });
    spinner3.succeed("Created comment audios")

    const spinner4 = ora("Creating comments screenshots").start()
    await createCommentsScreenshots({ comments, imgFolderPath, reddit });
    spinner4.succeed("Created comments screenshots")

    const spinner5 = ora("Creating post and comments videos").start()
    await createCommentsPostVideos({
        imgFolderPath,
        audioFolderPath,
        videoFolderPath,
    });
    spinner5.succeed("Created post and comments videos")

    const spinner6 = ora("Combining all videos").start()
    await combineVideos(videoFolderPath, `${videoFolderPath}/combinedVideo.mp4`);
    spinner6.succeed("All videos combined")

    const spinner7 = ora("Adding background music").start()
    await addBackgroundMusic(
        `${videoFolderPath}/combinedVideo.mp4`,
        `${shortsFolderPath}/bgAudio.mp3`,
        `${videoFolderPath}/combinedVideoWithBgAudio.mp4`
    );
    spinner7.succeed("Background music added")

    const spinner8 = ora("Adding background video (this may take a few minutes)").start()
    await addBackgroundVideo(
        `${shortsFolderPath}/bgVideo.mp4`,
        `${videoFolderPath}/combinedVideoWithBgAudio.mp4`,
        `${postFolderPath}/output.mp4`
    );
    spinner8.succeed(`Video saved at ${postFolderPath}/output.mp4`)

    const spinner9 = ora("Removing useless folders").start()
    await removeUselessDirs({ audioFolderPath, imgFolderPath, videoFolderPath });
    spinner9.succeed("Useless folders removed")

    return `${postFolderPath}/output.mp4`
}


async function createRequiredDirectories({
    shortsFolderPath,
    postFolderPath,
    imgFolderPath,
    audioFolderPath,
    videoFolderPath,
}: {
    shortsFolderPath: string;
    postFolderPath: string;
    imgFolderPath: string;
    audioFolderPath: string;
    videoFolderPath: string;
}) {
    await mkdir(shortsFolderPath, { recursive: true });
    await mkdir(postFolderPath, { recursive: true });
    await mkdir(imgFolderPath, { recursive: true });
    await mkdir(audioFolderPath, { recursive: true });
    await mkdir(videoFolderPath, { recursive: true });
}
async function createTitleAudioAndScreenshot({
    post,
    tts,
    reddit,
    audioFolderPath,
    imgFolderPath,
}: {
    post: Submission;
    tts: TtsInterface;
    reddit: RedditInterface;
    audioFolderPath: string;
    imgFolderPath: string;
}) {
    const postAudio = await tts.getAudioAsBuffer(post.title);
    await tts.saveAudioBufferToFile(postAudio, `${audioFolderPath}/0.mp3`);
    await screenshotPost(
        post.subreddit.display_name,
        replaceRedditAbbreviations(post.title.trim()),
        post.author.name,
        formatDistanceToNow(fromUnixTime(post.created_utc), {
            addSuffix: true,
        }).replace("about ", ""),
        numbro(post.ups).format({ average: true }),
        numbro(post.num_comments).format({ average: true }),
        (await reddit.getUserAvatarIfExists(post.author.name)) || "",
        `${imgFolderPath}/${0}.png`
    );
} async function createCommentsAudio({
    comments,
    audioFolderPath,
    tts,
}: {
    comments: any[];
    audioFolderPath: string;
    tts: TtsInterface;
}) {
    for (const [index, comment] of comments.entries()) {
        const $ = cheerio.load(comment.body_html);
        const text = $("body")
            .text()
            .replace(/\s+/g, " ")
            .replace("NTA", "not the asshole")
            .trim();
        const commentAudio = await tts.getAudioAsBuffer(
            replaceRedditAbbreviations(text)
        );
        await tts.saveAudioBufferToFile(
            commentAudio,
            `${audioFolderPath}/${index + 1}.mp3`
        );
    }
} async function createCommentsScreenshots({
    comments,
    imgFolderPath,
    reddit,
}: {
    comments: any[];
    imgFolderPath: string;
    reddit: RedditInterface;
}) {
    for (const [index, comment] of comments.entries()) {
        // console.log(comment.body_html);

        await screenshotComment(
            comment.body_html.trim(),
            comment.author.name,
            formatDistanceToNow(fromUnixTime(comment.created_utc), {
                addSuffix: true,
            }).replace("about ", ""),
            numbro(comment.ups).format({ average: true }),
            (await reddit.getUserAvatarIfExists(comment.author.name)) || "",
            `${imgFolderPath}/${index + 1}.png`
        );
    }
}
async function createCommentsPostVideos({
    imgFolderPath,
    audioFolderPath,
    videoFolderPath,
}: {
    imgFolderPath: string;
    audioFolderPath: string;
    videoFolderPath: string;
}) {
    const files = (await readdir(audioFolderPath)).map(
        (file) => path.parse(file).name
    );

    for (const file of files) {
        try {
            await createVideoFromImageAndAudio(
                file,
                imgFolderPath,
                audioFolderPath,
                videoFolderPath
            );
        } catch (err) {
            console.error(`⚠️ Skipping comment video ${file}`);
        }
    }
} async function removeUselessDirs({
    audioFolderPath,
    imgFolderPath,
    videoFolderPath,
}: {
    audioFolderPath: string;
    imgFolderPath: string;
    videoFolderPath: string;
}) {
    await rm(audioFolderPath, { recursive: true, force: true });
    await rm(imgFolderPath, { recursive: true, force: true });
    await rm(videoFolderPath, { recursive: true, force: true });
}
