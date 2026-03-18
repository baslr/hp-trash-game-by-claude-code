// main.js – Entry point and game loop
import * as THREE from 'three';
import { CameraController } from './camera.js';
import { DialogueSystem } from './dialogue.js';
import { SceneManager } from './scene-manager.js';
import { AudioManager } from './audio.js';
import { World } from './world.js';
import { Characters } from './characters.js';
import { Effects } from './effects.js';

// Scene imports
import { Scene1Morning } from './scenes/scene1-morning.js';
import { Scene2Town } from './scenes/scene2-town.js';
import { Scene3Evening } from './scenes/scene3-evening.js';
import { Scene4Dumbledore } from './scenes/scene4-dumbledore.js';
import { Scene5McGonagall } from './scenes/scene5-mcgonagall.js';
import { Scene6Hagrid } from './scenes/scene6-hagrid.js';
import { Scene7Doorstep } from './scenes/scene7-doorstep.js';

class Game {
  constructor() {
    this.clock = new THREE.Clock();
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.cameraController = null;
    this.dialogue = null;
    this.sceneManager = null;
    this.audio = null;
    this.world = null;
    this.characters = null;
    this.effects = null;

    // Lighting
    this.ambientLight = null;
    this.directionalLight = null;

    // Cursor light
    this.cursorLight = null;
    this.raycaster = new THREE.Raycaster();
    this.mouseNDC = new THREE.Vector2();
    this.cursorGlowEl = null;

    // UI elements
    this.loadingScreen = document.getElementById('loading-screen');
    this.titleScreen = document.getElementById('title-screen');
    this.gameUI = document.getElementById('game-ui');
    this.loadingBar = document.getElementById('loading-bar');
    this.loadingText = document.getElementById('loading-text');
  }

  async init() {
    this._updateLoading(10, 'Initialising renderer...');

    // Three.js setup
    this.scene = new THREE.Scene();
    // Fog – far enough to never hide characters, adjusted per scene
    this.scene.fog = new THREE.Fog(0x0a0a1a, 60, 180);

    // GLOBAL FIX: Disable frustum culling for every mesh added to the scene.
    // Three.js computes bounding spheres per individual mesh, not per group.
    // Small child meshes (lamp bulbs, window frames, character parts) get
    // culled at screen edges even though the parent group is clearly visible.
    // With our low-poly scene the performance cost is negligible.
    const originalAdd = this.scene.add.bind(this.scene);
    this.scene.add = (...objects) => {
      objects.forEach(obj => {
        obj.traverse(child => {
          if (child.isMesh) {
            child.frustumCulled = false;
          }
        });
      });
      return originalAdd(...objects);
    };

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    const container = document.getElementById('canvas-container');
    container.appendChild(this.renderer.domElement);

    this._updateLoading(25, 'Setting up lighting...');

    // Lighting
    this.ambientLight = new THREE.AmbientLight(0x404060, 0.4);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    this.directionalLight.position.set(20, 30, 10);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.mapSize.height = 2048;
    this.directionalLight.shadow.camera.near = 0.5;
    this.directionalLight.shadow.camera.far = 80;
    this.directionalLight.shadow.camera.left = -40;
    this.directionalLight.shadow.camera.right = 40;
    this.directionalLight.shadow.camera.top = 40;
    this.directionalLight.shadow.camera.bottom = -40;
    this.scene.add(this.directionalLight);

    // Cursor light – a warm point light that follows the mouse in 3D
    this.cursorLight = new THREE.PointLight(0xffdd88, 1.5, 20, 1.5);
    this.cursorLight.position.set(0, 5, 0);
    this.scene.add(this.cursorLight);

    // 2D glow element
    this.cursorGlowEl = document.getElementById('cursor-glow');

    // Track mouse for cursor light
    window.addEventListener('mousemove', (e) => {
      // NDC coords for raycaster
      this.mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;

      // Move 2D glow
      if (this.cursorGlowEl) {
        this.cursorGlowEl.style.left = e.clientX + 'px';
        this.cursorGlowEl.style.top = e.clientY + 'px';
      }
    });

    // Touch support
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        this.mouseNDC.x = (t.clientX / window.innerWidth) * 2 - 1;
        this.mouseNDC.y = -(t.clientY / window.innerHeight) * 2 + 1;
        if (this.cursorGlowEl) {
          this.cursorGlowEl.style.left = t.clientX + 'px';
          this.cursorGlowEl.style.top = t.clientY + 'px';
        }
      }
    });

    this._updateLoading(40, 'Building Privet Drive...');

    // Camera controller
    this.cameraController = new CameraController(this.camera, this.renderer.domElement);

    // Build world
    this.world = new World();
    const worldGroup = this.world.build();
    this.scene.add(worldGroup);

    this._updateLoading(60, 'Creating characters...');

    // Systems
    this.characters = new Characters();
    this.effects = new Effects(this.scene);
    this.dialogue = new DialogueSystem();
    this.audio = new AudioManager();

    this._updateLoading(75, 'Loading scenes...');

    // Scene manager
    this.sceneManager = new SceneManager(this);
    this.sceneManager.register('scene1-morning', new Scene1Morning());
    this.sceneManager.register('scene2-town', new Scene2Town());
    this.sceneManager.register('scene3-evening', new Scene3Evening());
    this.sceneManager.register('scene4-dumbledore', new Scene4Dumbledore());
    this.sceneManager.register('scene5-mcgonagall', new Scene5McGonagall());
    this.sceneManager.register('scene6-hagrid', new Scene6Hagrid());
    this.sceneManager.register('scene7-doorstep', new Scene7Doorstep());

    this._updateLoading(90, 'Preparing magic...');

    // Handle resize
    window.addEventListener('resize', () => this._onResize());

    // Prevent context menu on right-click
    this.renderer.domElement.addEventListener('contextmenu', e => e.preventDefault());

    this._updateLoading(100, 'Ready!');

    // Start render loop
    this._animate();

    // Show loading complete, then title screen
    await this._delay(500);
    this._showTitleScreen();
  }

  _updateLoading(percent, text) {
    if (this.loadingBar) this.loadingBar.style.width = percent + '%';
    if (this.loadingText) this.loadingText.textContent = text;
  }

  _showTitleScreen() {
    this.loadingScreen.classList.add('fade-out');

    setTimeout(() => {
      this.loadingScreen.classList.add('hidden');
      this.titleScreen.classList.remove('hidden');

      // Set initial camera for title view
      this.cameraController.setPosition(
        new THREE.Vector3(0, 12, 35),
        new THREE.Vector3(0, 2, 0)
      );
      this.cameraController.autoRotate = true;
      this.world.setTimeOfDay('evening', this.scene.fog);

      // Ensure enough ambient light so street lamps are clearly visible
      this.ambientLight.intensity = 0.35;
      this.directionalLight.intensity = 0.3;
      this.directionalLight.color.setHex(0x443355);

      // Click to start
      const startHandler = () => {
        this.titleScreen.removeEventListener('click', startHandler);
        this._startGame();
      };
      this.titleScreen.addEventListener('click', startHandler);
    }, 1000);
  }

  async _startGame() {
    // Initialize audio on user interaction
    this.audio.init();

    this.titleScreen.classList.add('fade-out');
    this.cameraController.autoRotate = false;

    await this._delay(1000);
    this.titleScreen.classList.add('hidden');
    this.gameUI.classList.remove('hidden');

    // Start Scene 1
    await this.sceneManager.loadScene('scene1-morning');
  }

  _animate() {
    requestAnimationFrame(() => this._animate());

    const deltaTime = this.clock.getDelta();

    // Update systems
    this.cameraController.update(deltaTime);
    this.sceneManager.update(deltaTime);
    this.effects.update(deltaTime);

    // Update cursor light position via raycasting
    this._updateCursorLight();

    // Render
    this.renderer.render(this.scene, this.camera);
  }

  _updateCursorLight() {
    if (!this.cursorLight) return;

    // Cast a ray from the camera through the mouse position
    this.raycaster.setFromCamera(this.mouseNDC, this.camera);

    // Check for intersection with scene objects
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    const target = new THREE.Vector3();

    if (intersects.length > 0) {
      // Hit something – place light slightly in front of the surface
      // along the ray direction (offset by a few units towards camera)
      const hit = intersects[0];
      const offsetDist = Math.min(3, hit.distance * 0.15);
      target.copy(hit.point);
      target.addScaledVector(this.raycaster.ray.direction, -offsetDist);
    } else {
      // No hit – fall back to fixed distance along ray
      this.raycaster.ray.at(15, target);
    }

    // Smoothly follow (lerp) so it feels organic, not jumpy
    this.cursorLight.position.lerp(target, 0.15);
  }

  _onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Start the game
const game = new Game();
game.init().catch(err => {
  console.error('Failed to initialise game:', err);
  const loadingText = document.getElementById('loading-text');
  if (loadingText) {
    loadingText.textContent = 'Error: ' + err.message;
    loadingText.style.color = '#ff4444';
  }
});
