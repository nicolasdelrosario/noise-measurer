export class MicrophoneCapture {
  constructor(onLevel, onError, onEnded) {
    this.onLevel = onLevel;
    this.onError = onError;
    this.onEnded = onEnded;
    this.stream = null;
    this.context = null;
    this.analyser = null;
    this.source = null;
    this.frame = null;
    this.data = null;
    this.frequency = null;
    this.alertSource = null;
    this.alertToken = 0;
  }

  async start(isActive = () => true) {
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      throw new Error("secure-context");
    }
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error("audio-context");
    this.context = new AudioContextClass();
    try { await this.context.resume?.(); } catch { /* Capturing can still activate a suspended context. */ }
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (!isActive()) {
      this.stop();
      return false;
    }
    this.stream.getTracks().forEach((track) => track.addEventListener("ended", () => this.onEnded?.(), { once: true }));
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 1024;
    this.analyser.smoothingTimeConstant = 0.3;
    this.source = this.context.createMediaStreamSource(this.stream);
    this.source.connect(this.analyser);
    this.data = new Float32Array(this.analyser.fftSize);
    this.frequency = new Uint8Array(this.analyser.frequencyBinCount);
    this.sample();
    return true;
  }

  sample() {
    if (!this.analyser) return;
    this.analyser.getFloatTimeDomainData(this.data);
    this.analyser.getByteFrequencyData(this.frequency);
    let sum = 0;
    let peak = 0;
    for (const sample of this.data) {
      sum += sample * sample;
      peak = Math.max(peak, Math.abs(sample));
    }
    const rms = Math.sqrt(sum / this.data.length);
    const level = Math.max(30, Math.min(100, 90 + (rms ? 20 * Math.log10(rms) : -60)));
    const volume = this.frequency.reduce((sum, value) => sum + value, 0) / this.frequency.length * (navigator.standalone !== undefined ? 2 : 1);
    this.onLevel({ level, rms, peak, volume });
    this.frame = requestAnimationFrame(() => this.sample());
  }

  async playAlert() {
    if (!this.context) return false;
    if (this.alertSource) return true;
    const token = this.alertToken;
    try { await this.context.resume?.(); } catch { return false; }
    if (token !== this.alertToken) return false;
    if (this.context.state && this.context.state !== "running") return false;
    try {
      const duration = 0.55;
      const buffer = this.context.createBuffer(1, Math.ceil(this.context.sampleRate * duration), this.context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
      const source = this.context.createBufferSource();
      const filter = this.context.createBiquadFilter();
      const gain = this.context.createGain();
      const now = this.context.currentTime;
      source.buffer = buffer;
      filter.type = "bandpass";
      filter.frequency.value = 1800;
      filter.Q.value = 0.7;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.context.destination);
      source.onended = () => { this.alertSource = null; source.disconnect(); filter.disconnect(); gain.disconnect(); };
      this.alertSource = source;
      source.start(now);
      source.stop(now + duration);
      return true;
    } catch {
      return false;
    }
  }

  stopAlert() {
    this.alertToken += 1;
    this.alertSource?.stop();
    this.alertSource = null;
  }

  stop() {
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = null;
    this.stopAlert();
    this.source?.disconnect();
    this.analyser?.disconnect?.();
    this.stream?.getTracks().forEach((track) => track.stop());
    this.context?.close();
    this.stream = null;
    this.source = null;
    this.analyser = null;
    this.context = null;
    this.data = null;
    this.frequency = null;
  }
}
