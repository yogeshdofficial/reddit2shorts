import puppeteer from "puppeteer";
import { commentTemplate, postTemplate } from "../../constants/templates";

export async function screenshotComment(
  body: string,
  username: string,
  time: string,
  upvotes: string,
  avatar: string,
  outputPath: string
) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(
    commentTemplate
      .replace("%body%", body)
      .replace("%time%", time)
      .replace("%upvotes%", upvotes)
      .replace("%username%", username)
      .replace("%avatar%", avatar),
    { waitUntil: "domcontentloaded" }
  );
  await page.waitForSelector("body");
  await page.evaluate(() => {
    return Promise.all(
      Array.from(document.images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((res) => {
          img.onload = img.onerror = res;
        });
      })
    );
  });
  const element = await page.$("body");

  if (!element) {
    throw new Error(`Element not found`);
  }

  await element.screenshot({ path: outputPath });

  await browser.close();
}
export async function screenshotPost(
  subreddit: string,
  body: string,
  username: string,
  time: string,
  upvotes: string,
  comments: string,
  avatar: string,
  outputPath: string
) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(
    postTemplate
      .replace("%body%", body)
      .replace("%subreddit%", subreddit)
      .replace("%comments%", comments)
      .replace("%time%", time)
      .replace("%upvotes%", upvotes)
      .replace("%username%", username)
      .replace("%avatar%", avatar),
    { waitUntil: "domcontentloaded" }
  );
  await page.waitForSelector("body");
  await page.evaluate(() => {
    return Promise.all(
      Array.from(document.images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((res) => {
          img.onload = img.onerror = res;
        });
      })
    );
  });
  const element = await page.$("body");

  if (!element) {
    throw new Error(`Element not found`);
  }

  await element.screenshot({ path: outputPath });

  await browser.close();
}
