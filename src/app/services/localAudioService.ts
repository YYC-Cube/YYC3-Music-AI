type PlayMode = 'sequential' | 'shuffle' | 'repeat-one' | 'repeat-all';

class LocalAudioService {
  private audio: HTMLAudioElement | null = null;
  private path: string | null = null;
  private loaded = false;
  private stateCallbacks: Array<(playing: boolean) => void> = [];
  private endCallbacks: Array<() => void> = [];
  private vol = 1;
  private muted = false;
  private mode: PlayMode = 'sequential';
  private loadId = 0;

  async loadAudio(audioPath: string): Promise<void> {
    const myId = ++this.loadId;

    this.stop();

    this.path = audioPath;
    this.loaded = false;

    const el = new Audio();
    el.preload = 'auto';
    el.volume = this.muted ? 0 : this.vol;
    this.audio = el;

    return new Promise((resolve, reject) => {
      let settled = false;

      const done = (ok: boolean, err?: string) => {
        if (settled || myId !== this.loadId) return;
        settled = true;
        el.removeEventListener('canplaythrough', onOk);
        el.removeEventListener('error', onFail);

        if (ok) {
          this.loaded = true;
          el.addEventListener('ended', onEnded);
          console.log('音频加载成功:', audioPath);
          resolve();
        } else {
          this.loaded = false;
          console.error('音频加载失败:', audioPath, err || '未知错误');
          reject(new Error(err || '音频加载失败'));
        }
      };

      const onOk = () => done(true);
      const onFail = () => {
        const code = el.error ? el.error.code : 0;
        const msgs: Record<number, string> = {
          1: '加载被中止',
          2: '网络错误',
          3: '解码失败',
          4: '格式不支持'
        };
        done(false, msgs[code] || `音频加载失败 (错误码 ${code})`);
      };
      const onEnded = () => {
        this.notifyState(false);
        this.endCallbacks.forEach(cb => cb());
      };

      el.addEventListener('canplaythrough', onOk);
      el.addEventListener('error', onFail);

      el.src = encodeURI(audioPath).replace(/;/g, '%3B');

      setTimeout(() => {
        if (!settled && myId === this.loadId) {
          done(false, '音频加载超时');
        }
      }, 15000);
    });
  }

  private stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.removeAttribute('src');
      this.audio.load();
      this.audio = null;
    }
    this.loaded = false;
  }

  async play(): Promise<void> {
    if (!this.audio || !this.loaded) {
      console.error('音频未就绪');
      return;
    }
    try {
      await this.audio.play();
      this.notifyState(true);
    } catch (e) {
      this.notifyState(false);
      throw e;
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
      this.notifyState(false);
    }
  }

  async togglePlay(): Promise<boolean> {
    if (!this.audio || !this.loaded) return false;
    if (this.audio.paused) {
      try { await this.play(); return true; }
      catch { return false; }
    } else {
      this.pause();
      return false;
    }
  }

  getIsPlaying(): boolean { return this.audio ? !this.audio.paused : false; }
  getIsReady(): boolean { return this.loaded && this.audio !== null; }
  getCurrentTime(): number { return this.audio?.currentTime ?? 0; }
  getDuration(): number { return this.audio?.duration ?? 0; }

  seek(t: number) { if (this.audio && this.loaded) this.audio.currentTime = t; }

  getVolume(): number { return this.vol; }
  setVolume(v: number) {
    this.vol = Math.max(0, Math.min(1, v));
    if (this.audio && !this.muted) this.audio.volume = this.vol;
  }

  getIsMuted(): boolean { return this.muted; }
  toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.audio) this.audio.volume = this.muted ? 0 : this.vol;
    return this.muted;
  }

  getPlayMode(): PlayMode { return this.mode; }
  cyclePlayMode(): PlayMode {
    const modes: PlayMode[] = ['sequential', 'repeat-all', 'repeat-one', 'shuffle'];
    this.mode = modes[(modes.indexOf(this.mode) + 1) % modes.length];
    return this.mode;
  }

  onStateChange(cb: (playing: boolean) => void): () => void {
    this.stateCallbacks.push(cb);
    return () => { this.stateCallbacks = this.stateCallbacks.filter(c => c !== cb); };
  }

  onSongEnd(cb: () => void): () => void {
    this.endCallbacks.push(cb);
    return () => { this.endCallbacks = this.endCallbacks.filter(c => c !== cb); };
  }

  private notifyState(playing: boolean) {
    this.stateCallbacks.forEach(cb => cb(playing));
  }

  destroy() {
    this.stop();
    this.path = null;
    this.stateCallbacks = [];
    this.endCallbacks = [];
  }
}

export type { PlayMode };
export const localAudioService = new LocalAudioService();
