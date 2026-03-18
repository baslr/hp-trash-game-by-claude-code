// scene3-evening.js – "Abend bei den Dursleys"
import * as THREE from 'three';
import { storyData } from '../story-data.js';

export class Scene3Evening {
  constructor() {
    this.title = "Evening at the Dursleys";
    this.sceneObjects = [];
    this.tv = null;
    this.dursley = null;
    this.petunia = null;
    this.livingRoom = null;
  }

  async init(game) {
    const { scene, world, characters } = game;

    // Evening time
    world.setTimeOfDay('evening', game.scene.fog);
    world.setWindowLights(true);

    game.ambientLight.intensity = 0.3;
    game.directionalLight.intensity = 0.2;
    game.directionalLight.color.setHex(0x443355);

    // Create living room interior
    this._createLivingRoom(scene);

    // Place characters in living room
    this.dursley = characters.createDursley();
    this.dursley.position.set(-2, 0, 0);
    this.dursley.rotation.y = 0;
    scene.add(this.dursley);
    this.sceneObjects.push(this.dursley);

    this.petunia = characters.createPetunia();
    this.petunia.position.set(1, 0, -1);
    this.petunia.rotation.y = -0.3;
    scene.add(this.petunia);
    this.sceneObjects.push(this.petunia);

    // Camera looking into living room
    game.cameraController.setPosition(
      new THREE.Vector3(0, 4, 8),
      new THREE.Vector3(0, 2, 0)
    );
  }

  _createLivingRoom(scene) {
    this.livingRoom = new THREE.Group();

    // Floor
    const floorGeo = new THREE.PlaneGeometry(10, 8);
    const floorMat = new THREE.MeshLambertMaterial({ color: 0x8b7355 }); // carpet
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.livingRoom.add(floor);

    // Back wall
    const wallGeo = new THREE.BoxGeometry(10, 5, 0.2);
    const wallMat = new THREE.MeshLambertMaterial({ color: 0xd4c5a9 });
    const backWall = new THREE.Mesh(wallGeo, wallMat);
    backWall.position.set(0, 2.5, -4);
    this.livingRoom.add(backWall);

    // Side walls
    const sideWallGeo = new THREE.BoxGeometry(0.2, 5, 8);
    const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
    leftWall.position.set(-5, 2.5, 0);
    this.livingRoom.add(leftWall);

    const rightWall = leftWall.clone();
    rightWall.position.x = 5;
    this.livingRoom.add(rightWall);

    // Ceiling
    const ceilGeo = new THREE.PlaneGeometry(10, 8);
    const ceilMat = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
    const ceiling = new THREE.Mesh(ceilGeo, ceilMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 5;
    this.livingRoom.add(ceiling);

    // TV set
    const tvGroup = new THREE.Group();
    const tvBodyGeo = new THREE.BoxGeometry(1.5, 1.2, 0.8);
    const tvBodyMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const tvBody = new THREE.Mesh(tvBodyGeo, tvBodyMat);
    tvBody.position.y = 1.5;
    tvGroup.add(tvBody);

    // TV screen (emissive for glow)
    const tvScreenGeo = new THREE.BoxGeometry(1.3, 0.9, 0.05);
    const tvScreenMat = new THREE.MeshBasicMaterial({ color: 0x4488aa });
    this.tvScreen = new THREE.Mesh(tvScreenGeo, tvScreenMat);
    this.tvScreen.position.set(0, 1.5, 0.43);
    tvGroup.add(this.tvScreen);

    // TV stand
    const standGeo = new THREE.BoxGeometry(1.8, 0.8, 0.6);
    const standMat = new THREE.MeshLambertMaterial({ color: 0x5a3a1a });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.y = 0.4;
    tvGroup.add(stand);

    tvGroup.position.set(0, 0, -3);
    this.livingRoom.add(tvGroup);
    this.tv = tvGroup;

    // TV light
    const tvLight = new THREE.PointLight(0x4488aa, 0.5, 6);
    tvLight.position.set(0, 2, -2.5);
    this.livingRoom.add(tvLight);

    // Armchair (Dursley's)
    const chairGeo = new THREE.BoxGeometry(1.2, 0.5, 1);
    const chairMat = new THREE.MeshLambertMaterial({ color: 0x6a4a2a });
    const chair = new THREE.Mesh(chairGeo, chairMat);
    chair.position.set(-2, 0.25, 0);
    this.livingRoom.add(chair);

    // Chair back
    const chairBackGeo = new THREE.BoxGeometry(1.2, 1.2, 0.15);
    const chairBack = new THREE.Mesh(chairBackGeo, chairMat);
    chairBack.position.set(-2, 0.85, -0.43);
    this.livingRoom.add(chairBack);

    // Sofa
    const sofaGeo = new THREE.BoxGeometry(2.5, 0.5, 0.8);
    const sofaMat = new THREE.MeshLambertMaterial({ color: 0x7a5a3a });
    const sofa = new THREE.Mesh(sofaGeo, sofaMat);
    sofa.position.set(1.5, 0.25, -1);
    this.livingRoom.add(sofa);

    const sofaBackGeo = new THREE.BoxGeometry(2.5, 0.8, 0.15);
    const sofaBack = new THREE.Mesh(sofaBackGeo, sofaMat);
    sofaBack.position.set(1.5, 0.65, -1.33);
    this.livingRoom.add(sofaBack);

    // Ceiling light
    const ceilingLight = new THREE.PointLight(0xffeecc, 0.4, 10);
    ceilingLight.position.set(0, 4.5, 0);
    this.livingRoom.add(ceilingLight);

    // Fireplace
    const fireplaceGeo = new THREE.BoxGeometry(2, 2, 0.5);
    const fireplaceMat = new THREE.MeshLambertMaterial({ color: 0x554433 });
    const fireplace = new THREE.Mesh(fireplaceGeo, fireplaceMat);
    fireplace.position.set(3.5, 1, -3.7);
    this.livingRoom.add(fireplace);

    // Window (showing dark sky)
    const windowGeo = new THREE.BoxGeometry(1.5, 1.5, 0.1);
    const windowMat = new THREE.MeshBasicMaterial({ color: 0x223344 });
    const window1 = new THREE.Mesh(windowGeo, windowMat);
    window1.position.set(-3, 2.5, -3.85);
    this.livingRoom.add(window1);

    scene.add(this.livingRoom);
    this.sceneObjects.push(this.livingRoom);
  }

  async start(game) {
    const { dialogue, cameraController } = game;
    const entries = storyData.scene3.entries;

    // Phase 1: Arriving home
    await this._showEntries(dialogue, entries.slice(0, 2));

    // Phase 2: TV news - zoom into TV
    await cameraController.animateTo(
      new THREE.Vector3(0, 2.5, 1),
      new THREE.Vector3(0, 1.5, -3),
      2000
    );

    // Flicker TV screen
    this._flickerTV(true);

    await this._showEntries(dialogue, entries.slice(2, 5));

    this._flickerTV(false);

    // Phase 3: Dursley reacts
    await cameraController.animateTo(
      new THREE.Vector3(-1, 2.5, 3),
      new THREE.Vector3(-2, 1.5, 0),
      1500
    );

    await this._showEntries(dialogue, [entries[5]]);

    // Phase 4: Dialogue between Dursleys
    await cameraController.animateTo(
      new THREE.Vector3(0, 3, 5),
      new THREE.Vector3(0, 2, 0),
      2000
    );

    await this._showEntries(dialogue, entries.slice(6, 12));

    // Phase 5: Looking out window, cat still there
    await cameraController.animateTo(
      new THREE.Vector3(-2, 3, -2),
      new THREE.Vector3(-3, 2.5, -3.85),
      2000
    );

    await this._showEntries(dialogue, entries.slice(12, 15));

    // Transition to next scene
    setTimeout(() => {
      game.sceneManager.nextScene();
    }, 1000);
  }

  _flickerTV(on) {
    if (!this.tvScreen) return;
    if (on) {
      this._tvFlicker = setInterval(() => {
        const colors = [0x4488aa, 0x5599bb, 0x3377aa, 0x66aacc];
        this.tvScreen.material.color.setHex(colors[Math.floor(Math.random() * colors.length)]);
      }, 200);
    } else {
      if (this._tvFlicker) clearInterval(this._tvFlicker);
    }
  }

  _showEntries(dialogue, entries) {
    return new Promise((resolve) => {
      dialogue.showSequence(entries, resolve);
    });
  }

  update(game, deltaTime) {
    // Subtle TV glow flicker
  }

  cleanup(game) {
    this._flickerTV(false);
    this.sceneObjects.forEach(obj => {
      game.scene.remove(obj);
    });
    this.sceneObjects = [];
  }
}
