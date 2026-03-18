// scene2-town.js – "Seltsame Dinge in der Stadt"
import * as THREE from 'three';
import { storyData } from '../story-data.js';

export class Scene2Town {
  constructor() {
    this.title = "Strange Things in Town";
    this.sceneObjects = [];
    this.cloakedFigures = [];
    this.officeBuilding = null;
  }

  async init(game) {
    const { scene, world, characters, effects } = game;

    // Keep world but adjust lighting for late morning
    world.setTimeOfDay('morning', game.scene.fog);

    game.ambientLight.intensity = 0.5;
    game.directionalLight.intensity = 0.5;

    // Create town elements – simple office building representation
    this._createOfficeBuilding(scene);
    this._createCloakedFigures(scene, characters);

    // Start owls flying
    effects.startOwlFlyby(4);

    // Camera starts on street level
    game.cameraController.setPosition(
      new THREE.Vector3(5, 3, 20),
      new THREE.Vector3(0, 2, 0)
    );
  }

  _createOfficeBuilding(scene) {
    const building = new THREE.Group();

    // Main building
    const bodyGeo = new THREE.BoxGeometry(15, 18, 12);
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x667788 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 9;
    body.castShadow = true;
    building.add(body);

    // Windows grid
    for (let floor = 0; floor < 9; floor++) {
      for (let w = 0; w < 5; w++) {
        const winGeo = new THREE.BoxGeometry(1.5, 1.2, 0.1);
        const winMat = new THREE.MeshLambertMaterial({
          color: 0x88aacc,
          emissive: 0x223344,
          emissiveIntensity: 0.3
        });
        const win = new THREE.Mesh(winGeo, winMat);
        win.position.set(-5.5 + w * 2.8, 1.5 + floor * 2, 6.05);
        building.add(win);
      }
    }

    // Sign: GRUNNINGS
    const signGeo = new THREE.BoxGeometry(8, 1, 0.2);
    const signMat = new THREE.MeshLambertMaterial({ color: 0x333355 });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, 1, 6.1);
    building.add(sign);

    building.position.set(0, 0, -15);
    scene.add(building);
    this.officeBuilding = building;
    this.sceneObjects.push(building);

    // Baker's shop
    const bakery = new THREE.Group();
    const bakeryBody = new THREE.BoxGeometry(6, 4, 5);
    const bakeryMat = new THREE.MeshLambertMaterial({ color: 0xccaa77 });
    const bakeryMesh = new THREE.Mesh(bakeryBody, bakeryMat);
    bakeryMesh.position.y = 2;
    bakery.add(bakeryMesh);

    const bakeryRoof = new THREE.BoxGeometry(7, 0.3, 6);
    const roofMesh = new THREE.Mesh(bakeryRoof, new THREE.MeshLambertMaterial({ color: 0x885533 }));
    roofMesh.position.y = 4.15;
    bakery.add(roofMesh);

    bakery.position.set(15, 0, 5);
    scene.add(bakery);
    this.sceneObjects.push(bakery);
  }

  _createCloakedFigures(scene, characters) {
    const positions = [
      { x: 8, z: 3 },
      { x: 9, z: 4 },
      { x: 10, z: 3.5 },
      { x: 12, z: 6 },
      { x: 13, z: 5 },
    ];

    const colors = [0x5a2080, 0x206a40, 0x802040, 0x205a80, 0x608020];

    positions.forEach((pos, i) => {
      const figure = characters.createCloakedFigure(colors[i]);
      figure.position.set(pos.x, 0, pos.z);
      // Face each other
      figure.rotation.y = Math.atan2(10 - pos.x, 4 - pos.z);
      scene.add(figure);
      this.cloakedFigures.push(figure);
      this.sceneObjects.push(figure);
    });
  }

  async start(game) {
    const { dialogue, cameraController, effects } = game;
    const entries = storyData.scene2.entries;

    // Phase 1: Street with cloaked people
    await cameraController.animateTo(
      new THREE.Vector3(15, 4, 12),
      new THREE.Vector3(10, 1.5, 4),
      2500
    );

    await this._showEntries(dialogue, entries.slice(0, 4));

    // Phase 2: Grunnings office
    await cameraController.animateTo(
      new THREE.Vector3(8, 12, 5),
      new THREE.Vector3(0, 9, -15),
      2500
    );

    await this._showEntries(dialogue, [entries[4]]);

    // Phase 3: Back to street, near baker's – the whispering
    await cameraController.animateTo(
      new THREE.Vector3(8, 2.5, 8),
      new THREE.Vector3(12, 1.5, 5),
      2000
    );

    await this._showEntries(dialogue, entries.slice(5, 8));

    // Phase 4: "The Potters... their son, Harry..."
    // Zoom in on the whispering figures
    await cameraController.animateTo(
      new THREE.Vector3(10, 2, 6),
      new THREE.Vector3(11, 1.8, 5),
      1500
    );

    await this._showEntries(dialogue, entries.slice(8, 10));

    // Phase 5: Owls at five o'clock
    await cameraController.animateTo(
      new THREE.Vector3(5, 10, 10),
      new THREE.Vector3(0, 15, -10),
      2000
    );

    // Fire extra owls
    effects.startOwlFlyby(6);

    await this._showEntries(dialogue, [entries[10]]);

    // Transition
    setTimeout(() => {
      effects.removeOwls();
      game.sceneManager.nextScene();
    }, 1000);
  }

  _showEntries(dialogue, entries) {
    return new Promise((resolve) => {
      dialogue.showSequence(entries, resolve);
    });
  }

  update(game, deltaTime) {
    // Cloaked figures subtle idle - slight sway
    const time = performance.now() * 0.001;
    this.cloakedFigures.forEach((fig, i) => {
      fig.rotation.y += Math.sin(time + i) * 0.0005;
    });
  }

  cleanup(game) {
    game.effects.removeOwls();
    this.sceneObjects.forEach(obj => {
      game.scene.remove(obj);
    });
    this.sceneObjects = [];
    this.cloakedFigures = [];
  }
}
