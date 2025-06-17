
# reddit2shorts

Make youtube shorts from reddit posts


## Demo


https://github.com/user-attachments/assets/3fb76b45-5695-41e2-93d0-03a2b515aff4


## Installation

### dependencies 
install [yt_dlp](https://github.com/yt-dlp/yt-dlp) and add it to path

```bash
  git clone https://github.com/yogeshdofficial/reddit2shorts
  cd reddit2shorts
  mv .env.example .env # populate it
  npm install
  ts-node src/cli.ts --random --upload youtube
```
## Environment Variables

To run this project, you will need to rename .env.example to .env add the following

get from https://www.reddit.com/prefs/apps, set type to personal use script
`REDDIT_CLIENT_ID`  
`REDDIT_CLIENT_SECRET`  
`REDDIT_USERNAME`  
`REDDIT_PASSWORD`    

 get from [google cloud console](https://console.cloud.google.com/) ->IAM->service account ->create service account ->manage kes ->create and download key as json ans point this env variable to that file 
`GOOGLE_APPLICATION_CREDENTIALS`  

get from https://aistudio.google.com/app/apikey  
`GEMINI_API_KEY`  

get by following this [article](https://amandevelops.medium.com/how-to-generate-refresh-token-and-use-them-to-access-google-api-f7565413c548)   
`GOOGLE_CLIENT_ID`  
`GOOGLE_CLIENT_SECRET`  
`GOOGLE_ACCESS_TOKEN`  
`GOOGLE_REFRESH_TOKEN` 
get by installing [extension](https://cookie-editor.com/) and getting cookie from tiktok webiste's sessionid  
`TIKTOK_SESSION_ID`  
## Usage/Examples

```bash
Usage: reddit2shorts [options]

Make youtube shorts from reddit posts

Options:
  -V, --version                       output the version number
  -s --subreddits <subreddit...>      List of subreddits to choose text post from (default:
                                      ["AskReddit","TIFU"])
  -r, --random                        Make short from a random post
  -p, --postId <postId>               Make short from the post with id
  -c --commentsCount <commentsCount>  Number of comments to include (default: "10")
  -t --tts <tts>                      Which tts to use (default: "google")
  -u --upload <platform>              Upload to platform
  -g --tags <tags...>                 Tags for video title (default: ["shorts","reddit","redditstories"])
  -a --bgAudio <bgAudio>              Background audio (default: "https://www.youtube.com/watch?v=xy_NKN75Jhw")
  -v --bgVideo <bgVideo>              Background video (default: "https://www.youtube.com/watch?v=XBIaqOm0RKQ")
  -h, --help                          display help for command
```

## Authors

- [@yogeshdofficial](https://www.github.com/yogeshdofficial)

## Acknowledgements
Since it is my first difficult project, any help and advice is much appreciated
