// scene-manager.js – State machine for scene transitions
export class SceneManager {
  constructor(game) {
    this.game = game;
    this.scenes = {};
    this.currentScene = null;
    this.currentSceneName = '';
    this.transitioning = false;

    this.sceneTitleEl = document.getElementById('scene-title');
    this.sceneTitleTextEl = document.getElementById('scene-title-text');
  }

  register(name, scene) {
    this.scenes[name] = scene;
  }

  async loadScene(name) {
    if (this.transitioning) return;
    if (!this.scenes[name]) {
      console.error(`Scene "${name}" not found`);
      return;
    }

    this.transitioning = true;

    // Hide dialogue during transition
    if (this.game.dialogue) {
      this.game.dialogue.hide();
    }

    // Cleanup current scene
    if (this.currentScene) {
      // Fade out music during visual transition
      if (this.game.audio && this.game.audio.initialized) {
        this.game.audio.fadeOutMusic(1);
      }
      await this._fadeOut();
      this.currentScene.cleanup(this.game);
    } else {
      // First scene – create overlay for fade-in effect
      await this._fadeOut();
    }

    // Load new scene
    this.currentSceneName = name;
    this.currentScene = this.scenes[name];

    // Initialize the scene
    await this.currentScene.init(this.game);

    // Start scene music
    if (this.game.audio && this.game.audio.initialized) {
      this.game.audio.startSceneMusic(name);
    }

    // Show scene title
    if (this.currentScene.title) {
      await this._showSceneTitle(this.currentScene.title);
    }

    // Fade in
    await this._fadeIn();

    this.transitioning = false;

    // Start the scene
    this.currentScene.start(this.game);
  }

  _showSceneTitle(title) {
    return new Promise((resolve) => {
      this.sceneTitleTextEl.textContent = title;
      this.sceneTitleEl.classList.remove('hidden');
      // Remove and re-add to reset animation
      this.sceneTitleEl.style.animation = 'none';
      this.sceneTitleEl.offsetHeight; // Force reflow
      this.sceneTitleEl.style.animation = '';

      setTimeout(() => {
        this.sceneTitleEl.classList.add('hidden');
        resolve();
      }, 4000);
    });
  }

  _fadeOut() {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.id = 'scene-transition';
      overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: #000; opacity: 0; z-index: 200;
        transition: opacity 1s ease;
      `;
      document.body.appendChild(overlay);
      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        setTimeout(resolve, 1000);
      });
    });
  }

  _fadeIn() {
    return new Promise((resolve) => {
      const overlay = document.getElementById('scene-transition');
      if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
          resolve();
        }, 1000);
      } else {
        resolve();
      }
    });
  }

  update(deltaTime) {
    if (this.currentScene && this.currentScene.update && !this.transitioning) {
      this.currentScene.update(this.game, deltaTime);
    }
  }

  nextScene() {
    const sceneOrder = [
      'scene1-morning',
      'scene2-town',
      'scene3-evening',
      'scene4-dumbledore',
      'scene5-mcgonagall',
      'scene6-hagrid',
      'scene7-doorstep'
    ];

    const currentIndex = sceneOrder.indexOf(this.currentSceneName);
    if (currentIndex < sceneOrder.length - 1) {
      this.loadScene(sceneOrder[currentIndex + 1]);
    }
  }
}
