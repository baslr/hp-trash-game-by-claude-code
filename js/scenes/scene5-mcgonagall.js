// scene5-mcgonagall.js – "McGonagall & das Gespräch"
import * as THREE from 'three';
import { storyData } from '../story-data.js';

export class Scene5McGonagall {
  constructor() {
    this.title = "The Conversation on the Wall";
    this.sceneObjects = [];
    this.dumbledore = null;
    this.mcgonagall = null;
    this.cat = null;
  }

  async init(game) {
    const { scene, world, characters } = game;

    // Still night
    world.setTimeOfDay('night', game.scene.fog);
    world.setWindowLights(false);

    game.ambientLight.intensity = 0.15;
    game.directionalLight.intensity = 0.08;
    game.directionalLight.color.setHex(0x223344);

    // Moonlight
    this.moonLight = new THREE.DirectionalLight(0x6677aa, 0.2);
    this.moonLight.position.set(20, 40, -10);
    scene.add(this.moonLight);
    this.sceneObjects.push(this.moonLight);

    const wallPos = world.getWallPosition();

    // Cat (will transform)
    this.cat = characters.createTabbyCat();
    this.cat.position.set(wallPos.x + 1, wallPos.y, wallPos.z);
    scene.add(this.cat);
    this.sceneObjects.push(this.cat);

    // Dumbledore sitting by wall
    this.dumbledore = characters.createDumbledore();
    this.dumbledore.position.set(wallPos.x - 1, 0, wallPos.z);
    this.dumbledore.rotation.y = Math.PI / 4;
    scene.add(this.dumbledore);
    this.sceneObjects.push(this.dumbledore);

    // McGonagall (hidden, appears after transformation)
    this.mcgonagall = characters.createMcGonagall();
    this.mcgonagall.visible = false;
    scene.add(this.mcgonagall);
    this.sceneObjects.push(this.mcgonagall);

    // Camera
    game.cameraController.setPosition(
      new THREE.Vector3(wallPos.x + 6, 3, wallPos.z + 5),
      new THREE.Vector3(wallPos.x, 1.5, wallPos.z)
    );
  }

  async start(game) {
    const { dialogue, cameraController, effects } = game;
    const entries = storyData.scene5.entries;
    const wallPos = game.world.getWallPosition();

    // Phase 1: Cat transforms into McGonagall
    await this._showEntries(dialogue, [entries[0]]);

    // Transformation effect!
    await effects.transformCatToMcGonagall(this.cat, this.mcgonagall);

    // Phase 2: Initial dialogue
    await cameraController.animateTo(
      new THREE.Vector3(wallPos.x + 4, 2.5, wallPos.z + 3),
      new THREE.Vector3(wallPos.x, 1.8, wallPos.z),
      2000
    );

    await this._showEntries(dialogue, entries.slice(1, 7));

    // Phase 3: Serious conversation about Voldemort and the Potters
    await cameraController.animateTo(
      new THREE.Vector3(wallPos.x + 3, 2, wallPos.z + 2),
      new THREE.Vector3(wallPos.x, 2, wallPos.z),
      2000
    );

    await this._showEntries(dialogue, entries.slice(7, 14));

    // Phase 4: The golden watch, waiting for Hagrid
    await cameraController.animateTo(
      new THREE.Vector3(wallPos.x + 2, 2.5, wallPos.z + 4),
      new THREE.Vector3(wallPos.x - 0.5, 1.5, wallPos.z),
      2000
    );

    await this._showEntries(dialogue, entries.slice(14, 18));

    // Phase 5: Debate about leaving Harry here
    await cameraController.animateTo(
      new THREE.Vector3(wallPos.x + 5, 2, wallPos.z + 2),
      new THREE.Vector3(wallPos.x, 2, wallPos.z),
      1500
    );

    await this._showEntries(dialogue, entries.slice(18, 24));

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

  update(game, deltaTime) {}

  cleanup(game) {
    this.sceneObjects.forEach(obj => {
      game.scene.remove(obj);
    });
    this.sceneObjects = [];
  }
}
