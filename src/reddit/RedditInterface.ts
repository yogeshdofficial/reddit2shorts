import { Comment, Submission } from "snoowrap";
import { Timespan } from "snoowrap/dist/objects/Subreddit";

export interface RedditInterface {
  getPost(is: string): Promise<Submission>;
  getTextOnlyPostFromList(
    subreddits: string[],
    category: "hot" | "new" | "top" | "controversial",
    topTime: Timespan,
    postLimit: number
  ): Promise<Submission>;
  getTopComments(
    post: Submission,
    count: number,
    textOnly: boolean,
    excludeMods: boolean
  ): Promise<Comment[]>;
  getUserAvatarIfExists(username: string): Promise<string | null>;
}
