// Web Audio API Procedural Sound Engine for Mochi Study Space

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  // Ambient sound nodes & gains
  private ambientGains: Record<string, GainNode> = {};
  private ambientSources: Record<string, any> = {};
  private isAmbientRunning: Record<string, boolean> = {};

  // Lo-Fi generator state
  private isLofiPlaying: boolean = false;
  private lofiIntervalId: number | null = null;
  private lofiCurrentChordIndex: number = 0;
  private lofiTrackId: string = 'song-morning';
  private lofiGain: GainNode | null = null;

  // Chord mappings for Lo-Fi synthesizer (Frequencies in Hz)
  private readonly CHORD_VOICINGS: Record<string, number[]> = {
    // Jazz 7th/9th lush chords
    'Cmaj7': [130.81, 196.00, 246.94, 329.63, 392.00], // C3, G3, B3, E4, G4
    'Am7': [110.00, 164.81, 220.00, 261.63, 329.63],   // A2, E3, A3, C4, E4
    'Dm7': [146.83, 220.00, 261.63, 349.23, 440.00],   // D3, A3, C4, F4, A4
    'G7sus4': [98.00, 146.83, 220.00, 261.63, 392.00], // G2, D3, A3, C4, G4
    'Fmaj7': [174.61, 220.00, 261.63, 329.63, 392.00], // F3, A3, C4, E4, G4
    'Em7': [164.81, 196.00, 246.94, 293.66, 392.00],   // E3, G3, B3, D4, G4
    'Abmaj7': [103.83, 155.56, 207.65, 261.63, 311.13],// Ab2, Eb3, Ab3, C4, Eb4
    'Fm7': [87.31, 130.81, 174.61, 207.65, 261.63],    // F2, C3, F3, Ab3, C4
    'Bbm7': [116.54, 174.61, 233.08, 277.18, 349.23],  // Bb2, F3, Bb3, Db4, F4
    'Eb7': [155.56, 196.00, 233.08, 277.18, 349.23],   // Eb3, G3, Bb3, Db4, F4
    'Gmaj7': [98.00, 146.83, 196.00, 246.94, 293.66],  // G2, D3, G3, B3, D4
    'E7': [164.81, 207.65, 246.94, 293.66, 329.63],    // E3, G#3, B3, D4, E4
    'D7': [146.83, 185.00, 220.00, 261.63, 369.99],    // D3, F#3, A3, C4, F#4
  };

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- AMBIENT SOUND GENERATORS ---

  public setAmbientVolume(soundKey: string, volume: number) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (!this.ambientGains[soundKey]) {
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.connect(this.masterGain);
      this.ambientGains[soundKey] = gain;
    }

    const gainNode = this.ambientGains[soundKey];
    gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime + 0.1);

    if (volume > 0.01 && !this.isAmbientRunning[soundKey]) {
      this.startAmbientGenerator(soundKey);
    } else if (volume <= 0.01 && this.isAmbientRunning[soundKey]) {
      this.stopAmbientGenerator(soundKey);
    }
  }

  private startAmbientGenerator(key: string) {
    if (!this.ctx) return;
    this.isAmbientRunning[key] = true;

    if (key === 'rain') {
      this.startRainSynth();
    } else if (key === 'fireplace') {
      this.startFireplaceSynth();
    } else if (key === 'cafe') {
      this.startCafeSynth();
    } else if (key === 'keyboard') {
      this.startKeyboardSynth();
    } else if (key === 'chimes') {
      this.startChimesSynth();
    } else if (key === 'waves') {
      this.startWavesSynth();
    }
  }

  private stopAmbientGenerator(key: string) {
    this.isAmbientRunning[key] = false;
    if (this.ambientSources[key]) {
      if (typeof this.ambientSources[key].stop === 'function') {
        try { this.ambientSources[key].stop(); } catch (_) {}
      }
      if (this.ambientSources[key].interval) {
        clearInterval(this.ambientSources[key].interval);
      }
      delete this.ambientSources[key];
    }
  }

  // Rain: Filtered Pink Noise + Random droplet pings
  private startRainSynth() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(150, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(highpass);
    highpass.connect(this.ambientGains['rain']);
    whiteNoise.start();

    // Occasional gentle droplet drops
    const dropletInterval = window.setInterval(() => {
      if (!this.isAmbientRunning['rain'] || !this.ctx) return;
      if (Math.random() > 0.4) {
        this.playWaterDrop();
      }
    }, 450);

    this.ambientSources['rain'] = {
      stop: () => whiteNoise.stop(),
      interval: dropletInterval,
    };
  }

  private playWaterDrop() {
    if (!this.ctx || !this.ambientGains['rain']) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const freq = 1200 + Math.random() * 800;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ambientGains['rain']);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // Fireplace: Low rumble + randomized crackle spikes
  private startFireplaceSynth() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(250, this.ctx.currentTime);

    noise.connect(lowpass);
    lowpass.connect(this.ambientGains['fireplace']);
    noise.start();

    // Random crackle pops
    const crackleInterval = window.setInterval(() => {
      if (!this.isAmbientRunning['fireplace'] || !this.ctx) return;
      if (Math.random() > 0.3) {
        const popOsc = this.ctx.createOscillator();
        const popGain = this.ctx.createGain();
        popOsc.type = 'triangle';
        popOsc.frequency.setValueAtTime(600 + Math.random() * 1800, this.ctx.currentTime);
        popGain.gain.setValueAtTime(0.05 + Math.random() * 0.08, this.ctx.currentTime);
        popGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.03);
        popOsc.connect(popGain);
        popGain.connect(this.ambientGains['fireplace']);
        popOsc.start();
        popOsc.stop(this.ctx.currentTime + 0.03);
      }
    }, 120);

    this.ambientSources['fireplace'] = {
      stop: () => noise.stop(),
      interval: crackleInterval,
    };
  }

  // Cafe: Murmur + soft ceramic clinks
  private startCafeSynth() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(450, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(1.5, this.ctx.currentTime);

    noise.connect(bandpass);
    bandpass.connect(this.ambientGains['cafe']);
    noise.start();

    // Occasional cafe cup clink
    const clinkInterval = window.setInterval(() => {
      if (!this.isAmbientRunning['cafe'] || !this.ctx) return;
      if (Math.random() > 0.65) {
        const clink = this.ctx.createOscillator();
        const clinkGain = this.ctx.createGain();
        clink.type = 'sine';
        clink.frequency.setValueAtTime(2400 + Math.random() * 600, this.ctx.currentTime);
        clinkGain.gain.setValueAtTime(0.025, this.ctx.currentTime);
        clinkGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.25);
        clink.connect(clinkGain);
        clinkGain.connect(this.ambientGains['cafe']);
        clink.start();
        clink.stop(this.ctx.currentTime + 0.25);
      }
    }, 1800);

    this.ambientSources['cafe'] = {
      stop: () => noise.stop(),
      interval: clinkInterval,
    };
  }

  // Mechanical Keyboard ASMR typing clacks
  private startKeyboardSynth() {
    if (!this.ctx) return;
    const typeInterval = window.setInterval(() => {
      if (!this.isAmbientRunning['keyboard'] || !this.ctx) return;
      if (Math.random() > 0.25) {
        this.playKeyboardClick();
      }
    }, 160);

    this.ambientSources['keyboard'] = {
      interval: typeInterval,
    };
  }

  private playKeyboardClick() {
    if (!this.ctx || !this.ambientGains['keyboard']) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    const pitch = 350 + Math.random() * 150;
    osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.04);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800 + Math.random() * 600, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambientGains['keyboard']);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  // Pentatonic Wind Chimes
  private startChimesSynth() {
    if (!this.ctx) return;
    const chimePitches = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // C5, D5, E5, G5, A5, C6
    const chimeInterval = window.setInterval(() => {
      if (!this.isAmbientRunning['chimes'] || !this.ctx) return;
      if (Math.random() > 0.45) {
        const pitch = chimePitches[Math.floor(Math.random() * chimePitches.length)];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(this.ambientGains['chimes']);
        osc.start();
        osc.stop(this.ctx.currentTime + 1.2);
      }
    }, 900);

    this.ambientSources['chimes'] = {
      interval: chimeInterval,
    };
  }

  // 432Hz Alpha Waves / Binaural Focus Drone
  private startWavesSynth() {
    if (!this.ctx) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(216, this.ctx.currentTime); // 432Hz subharmonic
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(224, this.ctx.currentTime); // 8Hz alpha difference

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ambientGains['waves']);

    osc1.start();
    osc2.start();

    this.ambientSources['waves'] = {
      stop: () => {
        osc1.stop();
        osc2.stop();
      },
    };
  }

  // --- LO-FI CHILL SYNTHESIZER BEATS ---

  public toggleLofi(playing?: boolean, trackId?: string) {
    this.initContext();
    if (trackId) this.lofiTrackId = trackId;

    const targetState = playing !== undefined ? playing : !this.isLofiPlaying;
    if (targetState === this.isLofiPlaying) return;

    this.isLofiPlaying = targetState;
    if (this.isLofiPlaying) {
      this.startLofiGenerator();
    } else {
      this.stopLofiGenerator();
    }
  }

  public setLofiVolume(vol: number) {
    this.initContext();
    if (!this.ctx) return;
    if (!this.lofiGain) {
      this.lofiGain = this.ctx.createGain();
      this.lofiGain.connect(this.masterGain!);
    }
    this.lofiGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
  }

  private startLofiGenerator() {
    if (!this.ctx) return;
    if (!this.lofiGain) {
      this.lofiGain = this.ctx.createGain();
      this.lofiGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
      this.lofiGain.connect(this.masterGain!);
    }

    const chordsList: Record<string, string[]> = {
      'song-morning': ['Cmaj7', 'Am7', 'Dm7', 'G7sus4'],
      'song-rainy': ['Fmaj7', 'Em7', 'Dm7', 'Cmaj7'],
      'song-starlight': ['Abmaj7', 'Fm7', 'Bbm7', 'Eb7'],
      'song-bakery': ['Gmaj7', 'E7', 'Am7', 'D7'],
    };

    const activeChords = chordsList[this.lofiTrackId] || chordsList['song-morning'];
    this.lofiCurrentChordIndex = 0;

    const playChordStep = () => {
      if (!this.isLofiPlaying || !this.ctx) return;

      const chordName = activeChords[this.lofiCurrentChordIndex % activeChords.length];
      const freqs = this.CHORD_VOICINGS[chordName] || this.CHORD_VOICINGS['Cmaj7'];

      // Play soft Rhodes electric piano chord
      freqs.forEach((freq, idx) => {
        // Slight strum delay
        const noteDelay = idx * 0.04;
        this.playRhodesNote(freq, this.ctx!.currentTime + noteDelay, 2.2);
      });

      // Play soft lo-fi sub-kick & gentle hi-hat
      this.playLofiBeat();

      this.lofiCurrentChordIndex++;
    };

    playChordStep();
    this.lofiIntervalId = window.setInterval(playChordStep, 2400);
  }

  private stopLofiGenerator() {
    if (this.lofiIntervalId) {
      clearInterval(this.lofiIntervalId);
      this.lofiIntervalId = null;
    }
  }

  private playRhodesNote(freq: number, startTime: number, duration: number) {
    if (!this.ctx || !this.lofiGain) return;

    // Carrier sine
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Warm vibrato
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(4.5, startTime);
    lfoGain.gain.setValueAtTime(2.0, startTime);
    lfo.connect(osc.frequency);
    lfo.start(startTime);
    lfo.stop(startTime + duration);

    // Soft warm filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, startTime);
    filter.frequency.exponentialRampToValueAtTime(350, startTime + duration);

    // ADSR Envelope
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.12, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.06, startTime + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.lofiGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private playLofiBeat() {
    if (!this.ctx || !this.lofiGain) return;
    const now = this.ctx.currentTime;

    // Soft Sub Kick on Beat 1
    const kickOsc = this.ctx.createOscillator();
    const kickGain = this.ctx.createGain();
    kickOsc.frequency.setValueAtTime(110, now);
    kickOsc.frequency.exponentialRampToValueAtTime(38, now + 0.18);
    kickGain.gain.setValueAtTime(0.15, now);
    kickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    kickOsc.connect(kickGain);
    kickGain.connect(this.lofiGain);
    kickOsc.start(now);
    kickOsc.stop(now + 0.2);

    // Soft Vinyl Brush on Beat 2 (halfway)
    const brushTime = now + 1.2;
    const brushNoise = this.ctx.createOscillator();
    const brushGain = this.ctx.createGain();
    brushNoise.type = 'triangle';
    brushNoise.frequency.setValueAtTime(180, brushTime);
    brushGain.gain.setValueAtTime(0.03, brushTime);
    brushGain.gain.exponentialRampToValueAtTime(0.0001, brushTime + 0.12);
    brushNoise.connect(brushGain);
    brushGain.connect(this.lofiGain);
    brushNoise.start(brushTime);
    brushNoise.stop(brushTime + 0.12);
  }

  // --- INTERACTIVE SFX ---

  // Pet Mochi sound: Cute happy chirp / squeak
  public playMochiPetSfx() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const pitches = [587.33, 783.99, 987.77]; // D5, G5, B5
    pitches.forEach((pitch, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      const startTime = now + i * 0.07;
      osc.frequency.setValueAtTime(pitch, startTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.15, startTime + 0.1);

      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(startTime);
      osc.stop(startTime + 0.18);
    });
  }

  // Task complete & berry sparkle
  public playTaskCompleteSfx() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((pitch, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      const time = now + i * 0.05;
      osc.frequency.setValueAtTime(pitch, time);

      gain.gain.setValueAtTime(0.09, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(time);
      osc.stop(time + 0.35);
    });
  }

  // Timer complete chime (Meditative Singing Bowl / Cozy Marimba)
  public playTimerFinishedSfx() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const chord = [261.63, 392.00, 523.25, 659.25]; // C4, G4, C5, E5
    chord.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now);
      osc.stop(now + 3.0);
    });
  }

  // Level Up Fanfare
  public playLevelUpSfx() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const notes = [
      { f: 523.25, d: 0.12, t: 0 },
      { f: 659.25, d: 0.12, t: 0.12 },
      { f: 783.99, d: 0.12, t: 0.24 },
      { f: 1046.50, d: 0.4, t: 0.36 },
      { f: 1318.51, d: 0.6, t: 0.5 },
    ];
    notes.forEach((n) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      const time = now + n.t;
      osc.frequency.setValueAtTime(n.f, time);

      gain.gain.setValueAtTime(0.15, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + n.d);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(time);
      osc.stop(time + n.d);
    });
  }

  // Soft Button Click Pop
  public playClickSfx() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start(now);
    osc.stop(now + 0.05);
  }
}

export const audioEngine = new AudioEngine();
