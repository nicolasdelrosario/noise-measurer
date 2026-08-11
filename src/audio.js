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
  }

  async start(isActive = () => true) {
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      throw new Error("secure-context");
    }
    this.context = new AudioContext();
    await this.context.resume?.();
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

  stop() {
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = null;
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
