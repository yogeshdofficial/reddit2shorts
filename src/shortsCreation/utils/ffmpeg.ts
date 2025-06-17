import ffmpeg from "fluent-ffmpeg";
import { tmpdir } from "os";
import { writeFile, unlink, readFile } from "fs/promises";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";

const getVideoMetadata = (file: string): Promise<ffmpeg.FfprobeData> =>
  new Promise((resolve, reject) => {
    ffmpeg.ffprobe(file, (err, metadata) => {
      if (err) reject(err);
      else resolve(metadata);
    });
  });

export async function addBackgroundVideo(
  background: string,
  overlay: string,
  output: string
) {
  try {
    // Get durations
    const [bgMeta, ovMeta] = await Promise.all([
      getVideoMetadata(background),
      getVideoMetadata(overlay),
    ]);

    const bgDuration = bgMeta.format.duration || 0;
    const ovDuration = ovMeta.format.duration || 0;

    // Ensure there's enough space to seek
    if (bgDuration <= ovDuration) {
      throw new Error("Background video must be longer than overlay video.");
    }

    // Pick random start time (with a buffer)
    const maxStart = bgDuration - ovDuration;
    const randomStart = parseFloat((Math.random() * maxStart).toFixed(2));

    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(background)
        .inputOptions([`-ss ${randomStart}`]) // seek background input
        .input(overlay)
        .complexFilter([
          {
            filter: "crop",
            options: {
              out_w: "if(gt(a\\,9/16)\\,ih*9/16\\,iw)",
              out_h: "if(gt(a\\,9/16)\\,ih\\,iw*16/9)",
              x: "(iw - (if(gt(a\\,9/16)\\,ih*9/16\\,iw)))/2",
              y: "(ih - (if(gt(a\\,9/16)\\,ih\\,iw*16/9)))/2",
            },
            inputs: "[0:v]",
            outputs: "cropped",
          },
          {
            filter: "scale",
            options: {
              w: 1080,
              h: 1920,
            },
            inputs: "cropped",
            outputs: "bg",
          },
          {
            filter: "scale",
            options: {
              w: 900,
              h: -1,
            },
            inputs: "[1:v]",
            outputs: "ovr",
          },
          {
            filter: "overlay",
            options: {
              x: "(W-w)/2",
              y: "(H-h)/2",
              format: "auto",
            },
            inputs: ["bg", "ovr"],
            outputs: "outv",
          },
        ])
        .outputOptions([
          "-map [outv]",
          "-map 1:a",           // use audio from overlay
          "-c:v libx264",       // H.264 software encoder
          "-preset medium",       // Better compression at same quality (slower)
          "-crf 19",            // Very high visual quality
          "-pix_fmt yuv420p",   // Ensures compatibility
          "-profile:v high",    // Improve decoding compatibility & quality
          "-level 4.2",         // Recommended for 1080p60
          "-threads 0",         // Use all available CPU cores
          "-c:a aac",
          "-b:a 192k",          // Slightly higher audio quality
          "-movflags +faststart",
          "-shortest",
        ])
        .on("error", (err) => {
          reject(err);
        })
        .on("end", () => resolve(output))
        .save(output);
    });
  } catch (err) {
    throw new Error("Failed to process video: " + err);
  }
}

export async function addBackgroundMusic(
  inputVideo: string,
  backgroundMusic: string,
  outputVideo: string
) {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputVideo)
      .input(backgroundMusic)
      .complexFilter([
        "[1:a]volume=0.3[bgmusic]", // lower background music volume
        "[0:a][bgmusic]amix=inputs=2:duration=first:dropout_transition=3[mixed]",
      ])
      .outputOptions(["-map 0:v:0", "-map [mixed]", "-c:v copy", "-shortest"])
      .save(outputVideo)
      .on("end", () => {
        resolve(outputVideo);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

export async function combineVideos(
  videoDir: string,
  outputPath: string
): Promise<void> {
  const files = await fs.readdir(videoDir);
  const mp4Files = files
    .filter((f) => f.endsWith(".mp4") && f !== outputPath)
    .sort((a, b) => parseInt(a) - parseInt(b)); // Sort numerically

  const concatList = mp4Files.map((f) => `file '${f}'`).join("\n");
  const concatFilePath = path.join(videoDir, "concat.txt");

  await fs.writeFile(concatFilePath, concatList);

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(concatFilePath)
      .inputOptions(["-f", "concat", "-safe", "0"])
      .outputOptions(["-c", "copy"])
      .output(outputPath)
      .on("error", (err) => {
        reject(err);
      })
      .on("end", () => {
        resolve();
      })
      .run();
  });
}
export async function mergeMp3Buffers(buffers: Buffer[]): Promise<Buffer> {
  const tmpBase = tmpdir();
  const uuids = buffers.map(() => randomUUID());
  const filePaths = uuids.map((id) => `${tmpBase}/${id}.mp3`);
  const concatPath = `${tmpBase}/${randomUUID()}_concat.txt`;
  const outputPath = `${tmpBase}/${randomUUID()}_output.mp3`;

  // Write each buffer to disk
  await Promise.all(buffers.map((buf, i) => writeFile(filePaths[i], buf)));

  // Create concat list
  const listFileContent = filePaths.map((f) => `file '${f}'`).join("\n");
  await writeFile(concatPath, listFileContent);

  return new Promise<Buffer>((resolve, reject) => {
    ffmpeg()
      .input(concatPath)
      .inputOptions("-f", "concat", "-safe", "0")
      .outputOptions("-c", "copy")
      .output(outputPath)
      .on("end", async () => {
        const merged = await readFile(outputPath);
        // Cleanup
        await Promise.all([
          ...filePaths.map((f) => unlink(f)),
          unlink(concatPath),
          unlink(outputPath),
        ]);
        resolve(merged);
      })
      .on("error", reject)
      .run();
  });
}
export function createVideoFromImageAndAudio(
  name: string,
  imgDir: string,
  audioDir: string,
  outputDir: string
): Promise<void> {
  const imgPath = `${imgDir}/${name}.png`;
  const audioPath = `${audioDir}/${name}.mp3`;
  const outPath = `${outputDir}/${name}.mp4`;

  return new Promise<void>((resolve, reject) => {
    // 1) Probe the audio duration
    ffmpeg.ffprobe(audioPath, (err, metadata) => {
      if (err) return reject(err);
      const duration = metadata.format.duration; // in seconds, float

      // 2) Build the ffmpeg command
      ffmpeg()
        .input(imgPath)
        .inputOptions(["-loop 1", "-framerate 1"]) // loop still image
        .input(audioPath)

        // 3) Make dimensions even
        .videoFilters("scale=trunc(iw/2)*2:trunc(ih/2)*2")

        // 4) Output options:
        .outputOptions([
          `-t ${duration}`, // cut video to audio length
          "-c:v libx264",
          "-tune stillimage",
          "-r 30", // standard output fps
          "-pix_fmt yuv420p",
          "-c:a aac",
          "-b:a 192k",
          "-shortest", // also stop at audio end
          "-movflags +faststart",
        ])

        .output(outPath)
        .on("start", () => {
          // console.log("🔄 ffmpeg command:\n", cmd);
        })
        .on("end", () => {
          resolve();
        })
        .on("error", reject)
        .run();
    });
  });
}
