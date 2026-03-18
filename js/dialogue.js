// dialogue.js – Typewriter text system with narrator and dialogue formatting
export class DialogueSystem {
  constructor() {
    this.dialogueBox = document.getElementById('dialogue-box');
    this.speakerEl = document.getElementById('dialogue-speaker');
    this.textEl = document.getElementById('dialogue-text');
    this.continueEl = document.getElementById('dialogue-continue');

    this.isTyping = false;
    this.typewriterInterval = null;
    this.currentText = '';
    this.displayedChars = 0;
    this.typeSpeed = 25; // ms per character
    this.queue = [];
    this.onComplete = null;
    this.waitingForInput = false;
    this.autoAdvance = false;
    this.autoAdvanceDelay = 1000;

    this._bindEvents();
  }

  _bindEvents() {
    // Click or space to advance
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        this._handleAdvance();
      }
    });

    document.addEventListener('click', (e) => {
      // Only advance dialogue when the dialogue box is visible
      if (!this.dialogueBox.classList.contains('hidden') &&
          !e.target.closest('#interaction-prompt') &&
          !e.target.closest('#title-screen')) {
        this._handleAdvance();
      }
    });
  }

  _handleAdvance() {
    if (this.isTyping) {
      // Skip to end of current text
      this._finishTyping();
    } else if (this.waitingForInput) {
      this.waitingForInput = false;
      this.continueEl.classList.add('hidden');

      if (this.queue.length > 0) {
        const next = this.queue.shift();
        this._showEntry(next);
      } else {
        this.hide();
        if (this.onComplete) {
          const cb = this.onComplete;
          this.onComplete = null;
          cb();
        }
      }
    }
  }

  // Show a sequence of dialogue entries
  // entries: [{ text, speaker?, type: 'narration'|'dialogue'|'thought', auto?: bool }]
  showSequence(entries, onComplete) {
    this.queue = [...entries];
    this.onComplete = onComplete || null;

    if (this.queue.length > 0) {
      const first = this.queue.shift();
      this._showEntry(first);
    }
  }

  // Show a single text entry
  show(text, speaker = '', type = 'narration') {
    return new Promise((resolve) => {
      this.showSequence([{ text, speaker, type }], resolve);
    });
  }

  _showEntry(entry) {
    this.dialogueBox.classList.remove('hidden');
    this.continueEl.classList.add('hidden');

    // Set speaker
    if (entry.speaker) {
      this.speakerEl.textContent = entry.speaker;
    } else if (entry.type === 'narration') {
      this.speakerEl.textContent = '';
    } else {
      this.speakerEl.textContent = '';
    }

    // Format text based on type
    this.currentText = entry.text;
    this.autoAdvance = entry.auto || false;
    this.autoAdvanceDelay = entry.autoDelay || 1500;

    // Start typewriter
    this._startTyping();
  }

  _startTyping() {
    this.isTyping = true;
    this.displayedChars = 0;
    this.textEl.textContent = '';

    if (this.typewriterInterval) clearInterval(this.typewriterInterval);

    this.typewriterInterval = setInterval(() => {
      if (this.displayedChars < this.currentText.length) {
        this.displayedChars++;
        this.textEl.textContent = this.currentText.substring(0, this.displayedChars);
      } else {
        this._finishTyping();
      }
    }, this.typeSpeed);
  }

  _finishTyping() {
    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval);
      this.typewriterInterval = null;
    }
    this.isTyping = false;
    this.textEl.textContent = this.currentText;

    if (this.autoAdvance) {
      setTimeout(() => {
        this.waitingForInput = false;
        if (this.queue.length > 0) {
          const next = this.queue.shift();
          this._showEntry(next);
        } else {
          this.hide();
          if (this.onComplete) {
            const cb = this.onComplete;
            this.onComplete = null;
            cb();
          }
        }
      }, this.autoAdvanceDelay);
    } else {
      this.waitingForInput = true;
      this.continueEl.classList.remove('hidden');
    }
  }

  hide() {
    this.dialogueBox.classList.add('hidden');
    this.waitingForInput = false;
    this.isTyping = false;
    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval);
      this.typewriterInterval = null;
    }
  }

  // Check if dialogue is currently active
  isActive() {
    return this.isTyping || this.waitingForInput || this.queue.length > 0;
  }
}
