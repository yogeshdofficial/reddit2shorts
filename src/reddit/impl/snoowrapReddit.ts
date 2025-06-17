import Snoowrap, { Comment, Submission } from "snoowrap";
import { Timespan } from "snoowrap/dist/objects/Subreddit";
import { RedditInterface } from "../RedditInterface";

export class SnoowrapReddit implements RedditInterface {
  private client;

  constructor(
    clientId: string,
    clientSecret: string,
    username: string,
    password: string,
    userAgent: string = "reddit-maker"
  ) {
    this.client = new Snoowrap({
      clientId: clientId,
      clientSecret: clientSecret,
      username: username,
      password: password,
      userAgent: userAgent,
    });
  }
  async getPost(id: string): Promise<Submission> {
    return await this.client.getSubmission(id).fetch();
  }
  async getTextOnlyPostFromList(
    subreddits: string[],
    category: "hot" | "new" | "top" | "controversial" = "hot",
    topTime: Timespan = "day",
    postLimit = 30
  ): Promise<Submission> {
    for (const subName of subreddits) {
      try {
        const subreddit = this.client.getSubreddit(subName);
        let posts;

        // Choose which method to call based on category
        if (category === "hot") {
          posts = await subreddit.getHot({ limit: postLimit });
        } else if (category === "new") {
          posts = await subreddit.getNew({ limit: postLimit });
        } else if (category === "top") {
          posts = await subreddit.getTop({ time: topTime, limit: postLimit });
        } else if (category === "controversial") {
          posts = await subreddit.getControversial({
            time: topTime,
            limit: postLimit,
          });
        } else {
          throw new Error(`Invalid category: ${category}`);
        }

        // Filter for text-only posts
        const textOnlyPosts = posts.filter(
          (post) =>
            post.is_self &&
            !post.is_video &&
            !post.media &&
            !post.url.match(/\.(jpg|jpeg|png|gif|mp4|webm)$/i) &&
            !post.url.includes("i.redd.it") &&
            !post.url.includes("imgur.com")
        );

        if (textOnlyPosts.length > 0) {
          const post =
            textOnlyPosts[Math.floor(Math.random() * textOnlyPosts.length)];
          return post;
        }
      } catch (error) {
        let message = "Unknown error"
        if (error instanceof Error)
          message = error.message
        console.warn(`⚠️ Error fetching from r/${subName}: ${message}`);
      }
    }

    console.log("❌ No text-only post found in the given list.");
    return null;
  }
  async getTopComments(
    post: Submission,
    count: number = 5,
    textOnly: boolean = true,
    excludeMods: boolean = true
  ): Promise<Comment[]> {
    // Fetch full comment tree with sorting
    const refreshedPost = await post.fetch();
    const comments = await refreshedPost.comments.fetchMore({
      amount: 100,
      skipReplies: true,
    });
    // console.log(comments.length);

    // Filter and sort manually (Reddit's API default sort is unreliable via snoowrap)
    const sorted = [...comments].sort((a, b) => b.score - a.score);
    // console.log(sorted.length);

    const filtered = sorted.filter((comment) => {
      if (comment.body == "[deleted]" || comment.body == "[removed]") {
        return false;
      }
      if (comment.body.length > 500) return false;
      if (comment.ups < 10) return false;
      return true;
    });
    // console.log(filtered.length);

    return filtered.slice(0, count);
  }
  async getUserAvatarIfExists(username: string): Promise<string | null> {
    if (username != "[deleted]") {
      return (await this.client.getUser(username).fetch()).icon_img;
    } else {
      return null;
    }
  }
}
