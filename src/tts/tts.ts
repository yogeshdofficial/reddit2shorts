export interface TtsInterface {
  getAudioAsBuffer(text: string): Promise<Buffer<ArrayBufferLike>>;
  saveAudioBufferToFile(audio: Buffer, fileName: string): void;
  getVoices(): Promise<unknown>;
}
