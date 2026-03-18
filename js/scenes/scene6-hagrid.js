// scene6-hagrid.js – "Hagrids Ankunft"
import * as THREE from 'three';
import { storyData } from '../story-data.js';

export class Scene6Hagrid {
  constructor() {
    this.title = "A Roar from the Sky";
    this.sceneObjects = [];
    this.dumbledore = null;
    this.mcgonagall = null;
    this.hagrid = null;
    this.motorcycle = null;
    this.babyHarry = null;
  }

  async init(game) {
    const { scene, world, characters } = game;

    // Night
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

    // Dumbledore and McGonagall on the wall
    this.dumbledore = characters.createDumbledore();
    this.dumbledore.position.set(wallPos.x - 1, 0, wallPos.z);
    this.dumbledore.rotation.y = Math.PI / 4;
    scene.add(this.dumbledore);
    this.sceneObjects.push(this.dumbledore);

    this.mcgonagall = characters.createMcGonagall();
    this.mcgonagall.position.set(wallPos.x + 1.5, 0, wallPos.z);
    this.mcgonagall.rotation.y = -Math.PI / 4;
    scene.add(this.mcgonagall);
    this.sceneObjects.push(this.mcgonagall);

    // Hagrid (hidden, arrives on motorcycle)
    this.hagrid = characters.createHagrid();
    this.hagrid.visible = false;
    scene.add(this.hagrid);
    this.sceneObjects.push(this.hagrid);

    // Motorcycle (hidden initially)
    this.motorcycle = characters.createMotorcycle();
    this.motorcycle.visible = false;
    scene.add(this.motorcycle);
    this.sceneObjects.push(this.motorcycle);

    // Baby Harry (held by Hagrid later)
    this.babyHarry = characters.createBabyHarry();
    this.babyHarry.visible = false;
    scene.add(this.babyHarry);
    this.sceneObjects.push(this.babyHarry);

    // Camera
    game.cameraController.setPosition(
      new THREE.Vector3(wallPos.x + 8, 4, wallPos.z + 10),
      new THREE.Vector3(wallPos.x, 2, wallPos.z)
    );
  }

  async start(game) {
    const { dialogue, cameraController, effects, audio } = game;
    const entries = storyData.scene6.entries;
    const wallPos = game.world.getWallPosition();

    // Phase 1: The rumbling sound
    await this._showEntries(dialogue, [entries[0]]);

    // Look up at the sky
    await cameraController.animateTo(
      new THREE.Vector3(0, 5, 5),
      new THREE.Vector3(20, 30, -20),
      2000
    );

    // Phase 2: Motorcycle lands!
    audio.init();
    audio.playMotorcycle(5);

    const landingPos = new THREE.Vector3(wallPos.x + 3, 0, wallPos.z + 8);
    await effects.motorcycleEntrance(this.motorcycle, this.hagrid, landingPos, 4000);

    // Camera follows landing
    await cameraController.animateTo(
      new THREE.Vector3(wallPos.x + 10, 3, wallPos.z + 15),
      new THREE.Vector3(landingPos.x, 1.5, landingPos.z),
      1500
    );

    await this._showEntries(dialogue, entries.slice(1, 4));

    // Phase 3: Close up on Hagrid – description
    await cameraController.animateTo(
      new THREE.Vector3(landingPos.x + 3, 3, landingPos.z + 3),
      new THREE.Vector3(landingPos.x + 1, 2.5, landingPos.z),
      2000
    );

    // Show baby Harry in Hagrid's arms
    this.babyHarry.visible = true;
    this.babyHarry.position.set(this.hagrid.position.x + 0.5, 2, this.hagrid.position.z + 0.3);

    // Phase 4: Dialogue about the motorcycle and Sirius
    await this._showEntries(dialogue, entries.slice(4, 8));

    // Phase 5: Looking at baby Harry
    await cameraController.animateTo(
      new THREE.Vector3(this.hagrid.position.x + 1.5, 2.5, this.hagrid.position.z + 2),
      new THREE.Vector3(this.babyHarry.position.x, this.babyHarry.position.y, this.babyHarry.position.z),
      2000
    );

    await this._showEntries(dialogue, entries.slice(8, 12));

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
