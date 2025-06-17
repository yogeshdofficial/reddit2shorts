import axios from "axios";
import fs from "fs/promises";
import chunkText from "chunk-text";
import { mergeMp3Buffers } from "../../shortsCreation/utils/ffmpeg";
import { TtsInterface } from "../tts";

export class TiktokTts implements TtsInterface {
  private sessionId: string;
  private speakerCode: string;
  private baseUrl: string;
  private userAgent: string;

  constructor(
    sessionId?: string,
    speakerCode = "en_us_001",
    baseUrl: string = "https://api16-normal-v6.tiktokv.com/media/api/text/speech/invoke",
    userAgent: string = "com.zhiliaoapp.musically/2022600030 (Linux; U; Android 7.1.2; es_ES; SM-G988N; Build/NRD90M;tt-ok/3.12.13.1)"
  ) {
    this.speakerCode = speakerCode;
    this.baseUrl = baseUrl;
    this.userAgent = userAgent;
    if (sessionId) {
      this.sessionId = sessionId;
    } else if (process.env.TIKTOK_SESSION_ID) {
      this.sessionId = process.env.TIKTOK_SESSION_ID;
    } else {
      throw new Error(
        "provide sessionId in constructor or set TIKTOK_SESSION_ID environment variable"
      );
    }
  }
  private async getSingleAudioBuffer(text: string) {
    const response = await axios.post(
      `${this.baseUrl}/?text_speaker=${this.speakerCode}&req_text=${text}&speaker_map_type=0&aid=1233`,
      null,
      {
        headers: {
          "User-Agent": this.userAgent,
          Cookie: `sessionid=${this.sessionId}`,
          "Accept-Encoding": "gzip,deflate,compress",
        },
      }
    );
    switch (response.data.status_code) {
      case 1:
        throw new Error(
          `Your TikTok session id might be invalid or expired. Try getting a new one.`
        );
      case 2:
        console.log(text);

        throw new Error(`The provided text is too long.`);
      case 4:
        throw new Error(
          `Invalid speaker, please check the list of valid speaker values.`
        );
      case 5:
        throw new Error(`No session id found.`);
    }

    return Buffer.from(response.data.data.v_str, "base64");
  }
  async getAudioAsBuffer(text: string) {
    const sentences = chunkText(text, 100);

    const buffers = await Promise.all(
      sentences.map((sentence) => this.getSingleAudioBuffer(sentence))
    );

    return mergeMp3Buffers(buffers);
  }

  async saveAudioBufferToFile(audio: Buffer, fileName: string) {
    await fs.writeFile(fileName, audio);
  }

  async getVoices() {
    const voiceList = [
      "en_us_001",
      "en_male_jomboy",
      "en_us_002",
      "es_mx_002",
      "en_male_funny",
      "en_us_ghostface",
      "en_female_samc",
      "en_male_cody",
      "en_female_makeup",
      "en_female_richgirl",
      "en_male_grinch",
      "en_us_006",
      "en_male_narration",
      "en_male_deadpool",
      "en_uk_001",
      "en_uk_003",
      "en_au_001",
      "en_male_jarvis",
      "en_male_ashmagic",
      "en_male_olantekkers",
      "en_male_ukneighbor",
      "en_male_ukbutler",
      "en_female_shenna",
      "en_female_pansino",
      "en_male_trevor",
      "en_female_f08_twinkle",
      "en_male_m03_classical",
      "en_female_betty",
      "en_male_cupid",
      "en_female_grandma",
      "en_male_m2_xhxs_m03_christmas",
      "en_male_santa_narration",
      "en_male_sing_deep_jingle",
      "en_male_santa_effect",
      "en_female_ht_f08_newyear",
      "en_male_wizard",
      "en_female_ht_f08_halloween",
      "en_female_ht_f08_glorious",
      "en_male_sing_funny_it_goes_up",
      "en_female_ht_f08_wonderful_world",
      "en_male_m2_xhxs_m03_silly",
      "en_female_emotional",
      "en_male_m03_sunshine_soon",
      "en_female_f08_warmy_breeze",
      "en_male_m03_lobby",
      "en_male_sing_funny_thanksgiving",
      "en_female_f08_salut_damour",
      "en_us_007",
      "en_us_009",
      "en_us_010",
      "en_au_002",
      "en_us_chewbacca",
      "en_us_c3po",
      "en_us_stitch",
      "en_us_stormtrooper",
      "en_us_rocket",
      "en_female_madam_leota",
      "en_male_ghosthost",
      "en_male_pirate",
      "fr_001",
      "fr_002",
      "es_002",
      "br_001",
      "br_003",
      "br_004",
      "br_005",
      "bp_female_ivete",
      "bp_female_ludmilla",
      "pt_female_lhays",
      "pt_female_laizza",
      "pt_male_bueno",
      "de_001",
      "de_002",
      "id_001",
      "jp_001",
      "jp_003",
      "jp_005",
      "jp_006",
      "jp_female_fujicochan",
      "jp_female_hasegawariona",
      "jp_male_keiichinakano",
      "jp_female_oomaeaika",
      "jp_male_yujinchigusa",
      "jp_female_shirou",
      "jp_male_tamawakazuki",
      "jp_female_kaorishoji",
      "jp_female_yagishaki",
      "jp_male_hikakin",
      "jp_female_rei",
      "jp_male_shuichiro",
      "jp_male_matsudake",
      "jp_female_machikoriiita",
      "jp_male_matsuo",
      "jp_male_osada",
      "kr_002",
      "kr_003",
      "kr_004",
      "BV074_streaming",
      "BV075_streaming",
    ];

    return voiceList;
  }
}

