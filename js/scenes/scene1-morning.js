// scene1-morning.js – "Der Morgen bei den Dursleys"
import * as THREE from 'three';
import { storyData } from '../story-data.js';

export class Scene1Morning {
  constructor() {
    this.title = "Privet Drive — A Dull, Grey Tuesday Morning";
    this.sceneObjects = [];
    this.dursley = null;
    this.car = null;
    this.cat = null;
    this.phase = 0;
  }

  async init(game) {
    const { scene, world, characters } = game;

    // Set time of day
    world.setTimeOfDay('morning', game.scene.fog);
    world.setWindowLights(false);

    // Set up ambient light for grey morning
    game.ambientLight.intensity = 0.6;
    game.directionalLight.intensity = 0.4;
    game.directionalLight.color.setHex(0x9999aa); // grey overcast

    // Place Mr Dursley at front door of Nr 4
    this.dursley = characters.createDursley();
    const housePos = world.getNumberFourPosition();
    this.dursley.position.set(housePos.x, 0, housePos.z + 5);
    this.dursley.rotation.y = Math.PI / 2; // facing street
    scene.add(this.dursley);
    this.sceneObjects.push(this.dursley);

    // Place car in driveway
    this.car = characters.createCar();
    this.car.position.set(housePos.x - 2.5, 0, housePos.z + 8);
    this.car.rotation.y = Math.PI / 2;
    scene.add(this.car);
    this.sceneObjects.push(this.car);

    // Place tabby cat on the garden wall of Nr 4 (hidden initially, revealed in Phase 4)
    this.cat = characters.createTabbyCat();
    const wallPos = world.getWallPosition();
    this.cat.position.set(wallPos.x, wallPos.y, wallPos.z);
    this.cat.rotation.y = Math.PI / 2; // facing the street
    this.cat.visible = false;
    scene.add(this.cat);
    this.sceneObjects.push(this.cat);

    // Set camera
    game.cameraController.setPosition(
      new THREE.Vector3(housePos.x + 15, 8, housePos.z + 15),
      new THREE.Vector3(housePos.x, 2, housePos.z)
    );
  }

  async start(game) {
    const { dialogue, cameraController } = game;
    const entries = storyData.scene1.entries;
    const housePos = game.world.getNumberFourPosition();
    const wallPos = game.world.getWallPosition();

    // Phase 1: Introduction - narrator describes the Dursleys
    await cameraController.animateTo(
      new THREE.Vector3(housePos.x + 10, 6, housePos.z + 12),
      new THREE.Vector3(housePos.x, 2, housePos.z),
      3000
    );

    // Show intro text entries
    await this._showEntries(dialogue, entries.slice(0, 8));

    // Phase 2: Mr Dursley leaves house - animate to show him at door
    await cameraController.animateTo(
      new THREE.Vector3(housePos.x + 5, 3, housePos.z + 10),
      new THREE.Vector3(housePos.x, 1.5, housePos.z + 5),
      2000
    );

    await this._showEntries(dialogue, [entries[8]]); // tie for work

    // Phase 3: Dursley walks to car, animate movement
    await this._animateDursleyToCar(game);

    // Phase 4: Cat on the corner – reveal her now
    this.cat.visible = true;
    await cameraController.animateTo(
      new THREE.Vector3(wallPos.x + 5, 3, wallPos.z + 5),
      new THREE.Vector3(wallPos.x, 1, wallPos.z),
      2000
    );

    await this._showEntries(dialogue, entries.slice(9, 12)); // cat reading map

    // Phase 5: Dursley drives away
    await this._animateCarLeave(game);

    // Transition to next scene
    setTimeout(() => {
      game.sceneManager.nextScene();
    }, 1000);
  }

  _showEntries(dialogue, entries) {
    return new Promise((resolve) => {
      dialogue.showSequence(entries, resolve);
    });
  }

  async _animateDursleyToCar(game) {
    const housePos = game.world.getNumberFourPosition();
    const target = new THREE.Vector3(housePos.x - 2.5, 0, housePos.z + 8);
    const start = this.dursley.position.clone();

    return new Promise((resolve) => {
      const duration = 2000;
      const startTime = performance.now();

      const animate = () => {
        const t = Math.min((performance.now() - startTime) / duration, 1);
        this.dursley.position.lerpVectors(start, target, t);
        this.dursley.position.y = Math.sin(t * Math.PI * 4) * 0.02; // walk bob

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          // "Get in car" - hide dursley, he's "inside"
          this.dursley.visible = false;
          resolve();
        }
      };
      animate();
    });
  }

  async _animateCarLeave(game) {
    const start = this.car.position.clone();
    const end = new THREE.Vector3(start.x - 60, start.y, start.z);

    return new Promise((resolve) => {
      const duration = 3000;
      const startTime = performance.now();

      const animate = () => {
        const t = Math.min((performance.now() - startTime) / duration, 1);
        const eased = t * t; // accelerate
        this.car.position.lerpVectors(start, end, eased);

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          this.car.visible = false;
          resolve();
        }
      };
      animate();
    });
  }

  update(game, deltaTime) {
    // Cat subtle idle animation
    if (this.cat && this.cat.visible) {
      const time = performance.now() * 0.001;
      // Tail slight wag
      const tail = this.cat.children.find(c => c.geometry?.type === 'CylinderGeometry' &&
        c.position.x < -0.2);
      if (tail) {
        tail.rotation.y = Math.sin(time * 2) * 0.2;
      }
    }
  }

  cleanup(game) {
    this.sceneObjects.forEach(obj => {
      game.scene.remove(obj);
    });
    this.sceneObjects = [];
  }
}
