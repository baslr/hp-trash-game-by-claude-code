// scene4-dumbledore.js – "Dumbledore erscheint"
import * as THREE from 'three';
import { storyData } from '../story-data.js';

export class Scene4Dumbledore {
  constructor() {
    this.title = "Privet Drive — Nearly Midnight";
    this.sceneObjects = [];
    this.dumbledore = null;
    this.cat = null;
  }

  async init(game) {
    const { scene, world, characters } = game;

    // Night time
    world.setTimeOfDay('night', game.scene.fog);
    world.setWindowLights(false); // everyone asleep

    game.ambientLight.intensity = 0.15;
    game.directionalLight.intensity = 0.08;
    game.directionalLight.color.setHex(0x223344);

    // Moonlight
    this.moonLight = new THREE.DirectionalLight(0x6677aa, 0.2);
    this.moonLight.position.set(20, 40, -10);
    scene.add(this.moonLight);
    this.sceneObjects.push(this.moonLight);

    // Cat on the wall, waiting
    this.cat = characters.createTabbyCat();
    const wallPos = world.getWallPosition();
    this.cat.position.set(wallPos.x, wallPos.y, wallPos.z);
    this.cat.rotation.y = Math.PI / 2;
    scene.add(this.cat);
    this.sceneObjects.push(this.cat);

    // Dumbledore (hidden initially)
    this.dumbledore = characters.createDumbledore();
    this.dumbledore.visible = false;
    scene.add(this.dumbledore);
    this.sceneObjects.push(this.dumbledore);

    // Start shooting stars
    game.effects.startShootingStars(5000);

    // Camera on the dark, silent street
    game.cameraController.setPosition(
      new THREE.Vector3(0, 5, 15),
      new THREE.Vector3(-7.5, 2, -8)
    );
  }

  async start(game) {
    const { dialogue, cameraController, world, effects, audio } = game;
    const entries = storyData.scene4.entries;
    const wallPos = world.getWallPosition();

    // Phase 1: The silent night, cat waiting
    await cameraController.animateTo(
      new THREE.Vector3(-3, 3, 0),
      new THREE.Vector3(wallPos.x, 1, wallPos.z),
      3000
    );

    await this._showEntries(dialogue, [entries[0]]);

    // Phase 2: Dumbledore appears
    await cameraController.animateTo(
      new THREE.Vector3(5, 3, -20),
      new THREE.Vector3(-7.5, 1.5, -14),
      2000
    );

    // Apparition effect
    const apparitionPos = new THREE.Vector3(-7.5, 0, -20);
    audio.init();
    audio.playApparition();
    await effects.apparateDumbledore(this.dumbledore, apparitionPos);

    await this._showEntries(dialogue, entries.slice(1, 4));

    // Phase 3: The Put-Outer
    await cameraController.animateTo(
      new THREE.Vector3(-5, 4, -10),
      new THREE.Vector3(-7.5, 3, -14),
      2000
    );

    await this._showEntries(dialogue, [entries[4]]);

    // Phase 4: Lights go out dramatically!
    await this._showEntries(dialogue, [entries[5]]);

    // Put-Outer effect – turn off all lamps sequentially
    audio.playPutOuter();
    await world.putOutAllLamps();

    // Phase 5: Dumbledore walks to the wall, sits next to cat
    await cameraController.animateTo(
      new THREE.Vector3(wallPos.x + 8, 3, wallPos.z + 5),
      new THREE.Vector3(wallPos.x, 1.5, wallPos.z),
      2500
    );

    // Animate Dumbledore walking to wall
    await this._animateWalk(this.dumbledore, apparitionPos, new THREE.Vector3(wallPos.x - 1, 0, wallPos.z), 3000);

    await this._showEntries(dialogue, [entries[6]]);

    // Phase 6: "Fancy seeing you here, Professor McGonagall"
    await cameraController.animateTo(
      new THREE.Vector3(wallPos.x + 3, 2, wallPos.z + 3),
      new THREE.Vector3(wallPos.x, 1.2, wallPos.z),
      1500
    );

    await this._showEntries(dialogue, [entries[7]]);

    // Transition
    setTimeout(() => {
      game.sceneManager.nextScene();
    }, 1000);
  }

  _showEntries(dialogue, entries) {
    return new Promise((resolve) => {
      dialogue.showSequence(entries, resolve);
    });
  }

  _animateWalk(character, from, to, duration) {
    return new Promise((resolve) => {
      character.position.copy(from);
      const startTime = performance.now();

      // Face target
      character.lookAt(to);

      const animate = () => {
        const t = Math.min((performance.now() - startTime) / duration, 1);
        character.position.lerpVectors(from, to, t);
        character.position.y = Math.sin(t * Math.PI * 6) * 0.03; // walk bob

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          character.position.y = 0;
          resolve();
        }
      };
      animate();
    });
  }

  update(game, deltaTime) {
    // Subtle star twinkling
  }

  cleanup(game) {
    game.effects.stopShootingStars();
    this.sceneObjects.forEach(obj => {
      game.scene.remove(obj);
    });
    this.sceneObjects = [];
  }
}
