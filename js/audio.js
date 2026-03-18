// audio.js – Sound manager with procedural ambient music per scene
export class AudioManager {
  constructor() {
    this.context = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.initialized = false;

    // Music state
    this.musicNodes = [];
    this.musicTimers = [];
    this.currentMood = null;
    this.isFadingOut = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)();

      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = 0.6;
      this.masterGain.connect(this.context.destination);

      // Separate buses for music and SFX
      this.musicGain = this.context.createGain();
      this.musicGain.gain.value = 0.35;
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.context.createGain();
      this.sfxGain.gain.value = 0.5;
      this.sfxGain.connect(this.masterGain);

      this.initialized = true;
    } catch (e) {
      console.warn('Audio not available:', e);
    }
  }

  // ═══════════════════════════════════════════════════
  //  PROCEDURAL AMBIENT MUSIC SYSTEM
  // ═══════════════════════════════════════════════════

  /*
   * Mood definitions — each scene gets a unique sonic palette.
   *
   * Scene 1 – Morning:    Mundane, ironic unease. Dry, slightly off major pads.
   * Scene 2 – Town:       Paranoia, strangeness. Dissonant clusters, restless.
   * Scene 3 – Evening:    Domestic tension, growing dread. Deep drones, eerie.
   * Scene 4 – Dumbledore: Dark majesty, magic awakens. Deep awe, sparkling highs.
   * Scene 5 – McGonagall: Grief, gravity, sorrow. Slow minor pads, mournful.
   * Scene 6 – Hagrid:     Dramatic arrival → rough tenderness. Thunder → warmth.
   * Scene 7 – Doorstep:   Farewell, hope, bittersweet. Celesta-like, ascending.
   */

  startSceneMusic(sceneName) {
    if (!this.initialized) return;
    this.stopMusic();
    this.isFadingOut = false;
    this.currentMood = sceneName;

    // Fade in
    this.musicGain.gain.setValueAtTime(0, this.context.currentTime);
    this.musicGain.gain.linearRampToValueAtTime(0.35, this.context.currentTime + 3);

    switch (sceneName) {
      case 'scene1-morning':  this._moodMorning(); break;
      case 'scene2-town':     this._moodTown(); break;
      case 'scene3-evening':  this._moodEvening(); break;
      case 'scene4-dumbledore': this._moodDumbledore(); break;
      case 'scene5-mcgonagall': this._moodMcGonagall(); break;
      case 'scene6-hagrid':   this._moodHagrid(); break;
      case 'scene7-doorstep': this._moodDoorstep(); break;
      default: this._moodDumbledore(); break;
    }
  }

  stopMusic() {
    // Stop all running music oscillators/nodes
    this.musicNodes.forEach(node => {
      try { node.stop(this.context.currentTime + 0.1); } catch (e) { /* already stopped */ }
    });
    this.musicNodes = [];

    // Clear scheduled timers
    this.musicTimers.forEach(id => clearTimeout(id));
    this.musicTimers = [];

    this.currentMood = null;
  }

  fadeOutMusic(duration = 2) {
    if (!this.initialized || this.isFadingOut) return;
    this.isFadingOut = true;
    this.musicGain.gain.linearRampToValueAtTime(0, this.context.currentTime + duration);
    const tid = setTimeout(() => this.stopMusic(), duration * 1000 + 100);
    this.musicTimers.push(tid);
  }

  // ── Helper: create a sustained pad tone ──
  _createPad(freq, type = 'sine', detune = 0) {
    const osc = this.context.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = detune;

    const gain = this.context.createGain();
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(this.musicGain);
    osc.start();
    this.musicNodes.push(osc);
    return { osc, gain };
  }

  // ── Helper: slow fade a pad in/out ──
  _fadePad(gainNode, targetVol, duration) {
    gainNode.gain.linearRampToValueAtTime(targetVol, this.context.currentTime + duration);
  }

  // ── Helper: create a reverb-like convolution via feedback delay ──
  _createReverb(delayTime = 0.15, feedback = 0.3) {
    const delay = this.context.createDelay();
    delay.delayTime.value = delayTime;
    const fbGain = this.context.createGain();
    fbGain.gain.value = feedback;
    const filter = this.context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000;

    delay.connect(filter);
    filter.connect(fbGain);
    fbGain.connect(delay);

    const wet = this.context.createGain();
    wet.gain.value = 0.4;
    delay.connect(wet);
    wet.connect(this.musicGain);

    return { input: delay, wet };
  }

  // ── Helper: schedule a repeating note pattern ──
  _schedulePattern(callback, intervalMs, variance = 0) {
    const loop = () => {
      if (this.isFadingOut) return;
      callback();
      const next = intervalMs + (Math.random() - 0.5) * 2 * variance;
      const tid = setTimeout(loop, Math.max(500, next));
      this.musicTimers.push(tid);
    };
    loop();
  }

  // ── Helper: play a single short note into the music bus ──
  _playNote(freq, duration, type = 'sine', volume = 0.08, attackTime = 0.05) {
    if (!this.initialized) return;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = type;
    osc.frequency.value = freq;

    const now = this.context.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + attackTime);
    gain.gain.setValueAtTime(volume, now + duration - 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.musicGain);
    osc.start(now);
    osc.stop(now + duration + 0.05);
    this.musicNodes.push(osc);
  }

  // ═══════════════════════════════════════════════════
  //  SCENE 1 – MUNDANE MORNING
  //  Dry, slightly unsettling major-ish pads.
  //  Like a suburban morning that feels *too* normal.
  // ═══════════════════════════════════════════════════
  _moodMorning() {
    // Dull, breathy pad cluster in C major – but with a slight sourness
    const pad1 = this._createPad(130.81, 'sine');        // C3
    const pad2 = this._createPad(164.81, 'sine', 5);     // E3 slightly sharp
    const pad3 = this._createPad(196.00, 'triangle', -3); // G3 slightly flat

    this._fadePad(pad1.gain, 0.12, 4);
    this._fadePad(pad2.gain, 0.07, 5);
    this._fadePad(pad3.gain, 0.06, 6);

    // Very slow LFO wobble on the E to create unease
    const lfo = this.context.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.3;
    const lfoGain = this.context.createGain();
    lfoGain.gain.value = 3; // subtle pitch drift
    lfo.connect(lfoGain);
    lfoGain.connect(pad2.osc.detune);
    lfo.start();
    this.musicNodes.push(lfo);

    // Occasional high, thin "clock-tick" note — suburban mundanity
    this._schedulePattern(() => {
      const notes = [523.25, 587.33, 659.25]; // C5, D5, E5
      const note = notes[Math.floor(Math.random() * notes.length)];
      this._playNote(note, 0.3, 'sine', 0.03, 0.01);
    }, 4000, 2000);
  }

  // ═══════════════════════════════════════════════════
  //  SCENE 2 – STRANGE TOWN
  //  Unsettled, paranoid. Clusters, restless arpeggios.
  // ═══════════════════════════════════════════════════
  _moodTown() {
    // Dissonant bed: tritone drone
    const pad1 = this._createPad(110, 'sine');           // A2
    const pad2 = this._createPad(155.56, 'triangle', 8); // D#3/Eb3 – tritone!
    const pad3 = this._createPad(82.41, 'sine');          // E2 sub bass

    this._fadePad(pad1.gain, 0.10, 3);
    this._fadePad(pad2.gain, 0.06, 4);
    this._fadePad(pad3.gain, 0.08, 5);

    // Nervous, irregular high notes – like whispered conversations
    const whisperNotes = [880, 932.33, 987.77, 1046.5, 1108.73]; // A5-C#6 chromatic
    this._schedulePattern(() => {
      const n1 = whisperNotes[Math.floor(Math.random() * whisperNotes.length)];
      this._playNote(n1, 0.15, 'sine', 0.025, 0.01);
      // Sometimes a second note for a "whisper cluster"
      if (Math.random() > 0.5) {
        const n2 = whisperNotes[Math.floor(Math.random() * whisperNotes.length)];
        setTimeout(() => this._playNote(n2, 0.12, 'sine', 0.02, 0.01), 80);
      }
    }, 1800, 1200);

    // Periodic low "something is wrong" throb
    this._schedulePattern(() => {
      this._playNote(55, 2.0, 'sine', 0.10, 0.5);
    }, 8000, 3000);
  }

  // ═══════════════════════════════════════════════════
  //  SCENE 3 – TENSE EVENING
  //  Domestic dread. Deep drone, eerie TV flickers.
  // ═══════════════════════════════════════════════════
  _moodEvening() {
    // Dark, low drone in D minor
    const pad1 = this._createPad(73.42, 'sine');          // D2
    const pad2 = this._createPad(87.31, 'triangle', -5);  // F2
    const pad3 = this._createPad(110, 'sine');             // A2

    this._fadePad(pad1.gain, 0.12, 4);
    this._fadePad(pad2.gain, 0.07, 5);
    this._fadePad(pad3.gain, 0.05, 6);

    // Slow pulsing – heartbeat-like anxiety
    const pulseOsc = this.context.createOscillator();
    pulseOsc.type = 'sine';
    pulseOsc.frequency.value = 55; // low A
    const pulseGain = this.context.createGain();
    pulseGain.gain.value = 0;
    pulseOsc.connect(pulseGain);
    pulseGain.connect(this.musicGain);
    pulseOsc.start();
    this.musicNodes.push(pulseOsc);

    // LFO drives the pulse like a slow heartbeat
    const pulseLFO = this.context.createOscillator();
    pulseLFO.type = 'sine';
    pulseLFO.frequency.value = 0.8; // ~48 bpm heartbeat
    const pulseLFOGain = this.context.createGain();
    pulseLFOGain.gain.value = 0.06;
    pulseLFO.connect(pulseLFOGain);
    pulseLFOGain.connect(pulseGain.gain);
    pulseLFO.start();
    this.musicNodes.push(pulseLFO);
    this._fadePad(pulseGain, 0.06, 3);

    // Occasional eerie high harmonic — like a distant owl or creak
    this._schedulePattern(() => {
      const eerieNotes = [1318.5, 1396.9, 1568]; // E6, F6, G6
      const n = eerieNotes[Math.floor(Math.random() * eerieNotes.length)];
      this._playNote(n, 1.5, 'sine', 0.015, 0.3);
    }, 6000, 3000);
  }

  // ═══════════════════════════════════════════════════
  //  SCENE 4 – DUMBLEDORE ARRIVES
  //  Dark majesty. Magic awakens. Awe, wonder, power.
  //  Deep orchestral feel with sparkling upper register.
  // ═══════════════════════════════════════════════════
  _moodDumbledore() {
    // Majestic open fifth drone – Bb minor feel
    const pad1 = this._createPad(58.27, 'sine');           // Bb1
    const pad2 = this._createPad(87.31, 'sine', 2);        // F2 (fifth)
    const pad3 = this._createPad(116.54, 'triangle');       // Bb2 octave
    const pad4 = this._createPad(138.59, 'sine', -3);      // Db3 (minor third)

    this._fadePad(pad1.gain, 0.14, 5);
    this._fadePad(pad2.gain, 0.08, 6);
    this._fadePad(pad3.gain, 0.06, 7);
    this._fadePad(pad4.gain, 0.05, 8);

    // Magical sparkle — high celesta-like notes, irregular
    const sparkleNotes = [
      1864.66, 2093.00, 2349.32, 2637.02, 2793.83, // Bb6, C7, D7, E7, F7
      1396.91, 1567.98, 1760.00                       // F6, G6, A6
    ];

    this._schedulePattern(() => {
      const n = sparkleNotes[Math.floor(Math.random() * sparkleNotes.length)];
      this._playNote(n, 0.8, 'sine', 0.02, 0.02);
      // Occasionally play two for a magical shimmer
      if (Math.random() > 0.6) {
        const n2 = sparkleNotes[Math.floor(Math.random() * sparkleNotes.length)];
        setTimeout(() => this._playNote(n2, 0.6, 'sine', 0.015, 0.02), 150);
      }
    }, 2500, 1500);

    // Deep "power" pulse – very slow, majestic
    this._schedulePattern(() => {
      this._playNote(29.14, 4.0, 'sine', 0.12, 1.0); // Bb0 sub-bass swell
    }, 10000, 4000);
  }

  // ═══════════════════════════════════════════════════
  //  SCENE 5 – MCGONAGALL / THE CONVERSATION
  //  Grief, gravity, emotional weight. Mournful.
  //  Slow minor pads, sparse melody fragments.
  // ═══════════════════════════════════════════════════
  _moodMcGonagall() {
    // E minor — the saddest key. Slow, heavy pads.
    const pad1 = this._createPad(82.41, 'sine');          // E2
    const pad2 = this._createPad(123.47, 'sine', -2);     // B2
    const pad3 = this._createPad(98.00, 'triangle');       // G2
    const pad4 = this._createPad(146.83, 'sine');          // D3

    this._fadePad(pad1.gain, 0.12, 6);
    this._fadePad(pad2.gain, 0.07, 7);
    this._fadePad(pad3.gain, 0.06, 8);
    this._fadePad(pad4.gain, 0.04, 9);

    // Slow, mournful melody fragments — like someone trying not to cry
    const melodyNotes = [
      { freq: 329.63, dur: 1.5 },  // E4
      { freq: 293.66, dur: 2.0 },  // D4
      { freq: 246.94, dur: 1.8 },  // B3
      { freq: 261.63, dur: 1.2 },  // C4
      { freq: 220.00, dur: 2.5 },  // A3
      { freq: 196.00, dur: 2.0 },  // G3
    ];
    let melodyIndex = 0;

    this._schedulePattern(() => {
      const note = melodyNotes[melodyIndex % melodyNotes.length];
      this._playNote(note.freq, note.dur, 'sine', 0.04, 0.3);
      melodyIndex++;
    }, 5000, 2000);

    // Very subtle, slow vibrato on the root — emotional trembling
    const vibrato = this.context.createOscillator();
    vibrato.type = 'sine';
    vibrato.frequency.value = 4.5; // gentle vibrato
    const vibGain = this.context.createGain();
    vibGain.gain.value = 2;
    vibrato.connect(vibGain);
    vibGain.connect(pad1.osc.detune);
    vibrato.start();
    this.musicNodes.push(vibrato);
  }

  // ═══════════════════════════════════════════════════
  //  SCENE 6 – HAGRID'S ARRIVAL
  //  Thunder from the sky → rough tenderness.
  //  Starts dramatic/rumbling, settles into warm low tones.
  // ═══════════════════════════════════════════════════
  _moodHagrid() {
    // Start with rumbling tension – low, powerful
    const rumble1 = this._createPad(41.20, 'sawtooth');   // E1 – raw, rough
    const rumble2 = this._createPad(61.74, 'triangle');   // B1
    const warmPad = this._createPad(82.41, 'sine');       // E2 – warm foundation

    // Rumble fades in fast, then slowly recedes
    this._fadePad(rumble1.gain, 0.08, 2);
    this._fadePad(rumble2.gain, 0.05, 3);
    this._fadePad(warmPad.gain, 0.10, 4);

    // After 8 seconds, transition: rumble fades, warmth grows
    const t1 = setTimeout(() => {
      rumble1.gain.gain.linearRampToValueAtTime(0.02, this.context.currentTime + 4);
      rumble2.gain.gain.linearRampToValueAtTime(0.01, this.context.currentTime + 5);
      warmPad.gain.gain.linearRampToValueAtTime(0.14, this.context.currentTime + 4);

      // Add warm major third — tenderness
      const warmThird = this._createPad(103.83, 'sine');   // G#2 → gives E major feel
      this._fadePad(warmThird.gain, 0.06, 5);

      // Gentle, deep notes — like a giant's careful footsteps
      this._schedulePattern(() => {
        const notes = [82.41, 110, 123.47, 98]; // E2, A2, B2, G2
        const n = notes[Math.floor(Math.random() * notes.length)];
        this._playNote(n, 1.5, 'sine', 0.06, 0.3);
      }, 4000, 2000);
    }, 8000);
    this.musicTimers.push(t1);

    // Occasional deep "thud" — Hagrid's presence
    this._schedulePattern(() => {
      this._playNote(32.70, 1.0, 'sine', 0.10, 0.05); // C1 thud
    }, 6000, 3000);
  }

  // ═══════════════════════════════════════════════════
  //  SCENE 7 – DOORSTEP (FINALE)
  //  Bittersweet farewell. Hope amidst sorrow.
  //  Celesta-like ascending figures. The most emotional.
  // ═══════════════════════════════════════════════════
  _moodDoorstep() {
    // Ab major — warm, hopeful, but with a touch of sadness
    const pad1 = this._createPad(51.91, 'sine');           // Ab1
    const pad2 = this._createPad(65.41, 'sine', 3);        // C2
    const pad3 = this._createPad(77.78, 'triangle');        // Eb2
    const pad4 = this._createPad(103.83, 'sine');           // Ab2

    this._fadePad(pad1.gain, 0.12, 6);
    this._fadePad(pad2.gain, 0.06, 7);
    this._fadePad(pad3.gain, 0.05, 8);
    this._fadePad(pad4.gain, 0.04, 9);

    // Celesta-like ascending arpeggios — hope rising
    const arpeggioSets = [
      [415.30, 523.25, 622.25, 830.61],   // Ab4, C5, Eb5, Ab5
      [466.16, 554.37, 698.46, 932.33],   // Bb4, Db5, F5, Bb5
      [415.30, 493.88, 622.25, 830.61],   // Ab4, B4, Eb5, Ab5
      [349.23, 415.30, 523.25, 622.25],   // F4, Ab4, C5, Eb5
    ];
    let arpIndex = 0;

    this._schedulePattern(() => {
      const arp = arpeggioSets[arpIndex % arpeggioSets.length];
      arp.forEach((freq, i) => {
        setTimeout(() => {
          this._playNote(freq, 2.0 - i * 0.3, 'sine', 0.03, 0.02);
        }, i * 300);
      });
      arpIndex++;
    }, 6000, 2000);

    // After a while, add a gentle high sustained note — like a lullaby
    const t1 = setTimeout(() => {
      const lullaby = this._createPad(1661.22, 'sine'); // Ab6 – very high, very quiet
      this._fadePad(lullaby.gain, 0.012, 8);

      // Gentle vibrato
      const vib = this.context.createOscillator();
      vib.type = 'sine';
      vib.frequency.value = 5;
      const vibGain = this.context.createGain();
      vibGain.gain.value = 3;
      vib.connect(vibGain);
      vibGain.connect(lullaby.osc.detune);
      vib.start();
      this.musicNodes.push(vib);
    }, 12000);
    this.musicTimers.push(t1);

    // Warm sub-bass swells — emotional gravity
    this._schedulePattern(() => {
      this._playNote(51.91, 5.0, 'sine', 0.08, 1.5); // Ab1 slow swell
    }, 12000, 4000);
  }

  // ═══════════════════════════════════════════════════
  //  SFX (unchanged)
  // ═══════════════════════════════════════════════════

  playTone(frequency = 440, duration = 0.5, type = 'sine', volume = 0.3) {
    if (!this.initialized) return;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.context.currentTime + duration);
  }

  playApparition() {
    if (!this.initialized) return;
    this.playTone(100, 0.8, 'sine', 0.2);
    setTimeout(() => this.playTone(200, 0.4, 'sine', 0.15), 200);
    setTimeout(() => this.playTone(400, 0.3, 'sine', 0.1), 400);
  }

  playPutOuter() {
    if (!this.initialized) return;
    this.playTone(800, 0.1, 'square', 0.15);
    setTimeout(() => this.playTone(200, 0.3, 'sine', 0.1), 100);
  }

  playMotorcycle(duration = 3) {
    if (!this.initialized) return;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = 60;
    gain.gain.setValueAtTime(0, this.context.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, this.context.currentTime + 0.5);
    gain.gain.setValueAtTime(0.15, this.context.currentTime + duration - 0.5);
    gain.gain.linearRampToValueAtTime(0, this.context.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.context.currentTime + duration);
  }

  playOwlHoot() {
    if (!this.initialized) return;
    this.playTone(500, 0.3, 'sine', 0.1);
    setTimeout(() => this.playTone(400, 0.5, 'sine', 0.08), 400);
  }

  playLightOut() {
    if (!this.initialized) return;
    this.playTone(600, 0.15, 'sine', 0.1);
    setTimeout(() => this.playTone(100, 0.2, 'sine', 0.05), 150);
  }

  setVolume(v) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, v));
    }
  }

  setMusicVolume(v) {
    if (this.musicGain) {
      this.musicGain.gain.linearRampToValueAtTime(
        Math.max(0, Math.min(1, v)),
        this.context.currentTime + 0.5
      );
    }
  }
}
