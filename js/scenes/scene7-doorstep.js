// scene7-doorstep.js – "Harry auf der Türschwelle"
import * as THREE from 'three';
import { storyData } from '../story-data.js';

export class Scene7Doorstep {
  constructor() {
    this.title = "The Doorstep of Number Four";
    this.sceneObjects = [];
    this.dumbledore = null;
    this.mcgonagall = null;
    this.hagrid = null;
    this.motorcycle = null;
    this.babyHarry = null;
  }

  async init(game) {
    const { scene, world, characters } = game;

    // Deep night
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

    const housePos = world.getNumberFourPosition();
    const doorstepPos = world.getDoorstepPosition();
    const wallPos = world.getWallPosition();

    // All three characters present
    this.dumbledore = characters.createDumbledore();
    this.dumbledore.position.set(wallPos.x - 1, 0, wallPos.z + 2);
    scene.add(this.dumbledore);
    this.sceneObjects.push(this.dumbledore);

    this.mcgonagall = characters.createMcGonagall();
    this.mcgonagall.position.set(wallPos.x + 2, 0, wallPos.z + 2);
    scene.add(this.mcgonagall);
    this.sceneObjects.push(this.mcgonagall);

    this.hagrid = characters.createHagrid();
    this.hagrid.position.set(wallPos.x + 5, 0, wallPos.z + 5);
    scene.add(this.hagrid);
    this.sceneObjects.push(this.hagrid);

    // Motorcycle parked nearby
    this.motorcycle = characters.createMotorcycle();
    this.motorcycle.position.set(wallPos.x + 7, 0, wallPos.z + 8);
    scene.add(this.motorcycle);
    this.sceneObjects.push(this.motorcycle);

    // Baby Harry (will be placed on doorstep)
    this.babyHarry = characters.createBabyHarry();
    this.babyHarry.position.set(this.hagrid.position.x + 0.5, 2, this.hagrid.position.z + 0.3);
    scene.add(this.babyHarry);
    this.sceneObjects.push(this.babyHarry);

    // Camera
    game.cameraController.setPosition(
      new THREE.Vector3(housePos.x + 8, 4, housePos.z + 12),
      new THREE.Vector3(housePos.x, 2, housePos.z + 5)
    );
  }

  async start(game) {
    const { dialogue, cameraController, world, effects, audio } = game;
    const entries = storyData.scene7.entries;
    const housePos = world.getNumberFourPosition();
    const doorstepPos = world.getDoorstepPosition();

    // Phase 1: Dumbledore takes Harry
    await this._showEntries(dialogue, entries.slice(0, 1));

    // Phase 2: Hagrid says goodbye
    await cameraController.animateTo(
      new THREE.Vector3(this.hagrid.position.x + 3, 3, this.hagrid.position.z + 3),
      new THREE.Vector3(this.hagrid.position.x, 2.5, this.hagrid.position.z),
      2000
    );

    await this._showEntries(dialogue, entries.slice(1, 6));

    // Phase 3: Dumbledore places Harry on the doorstep
    await cameraController.animateTo(
      new THREE.Vector3(housePos.x + 4, 2.5, housePos.z + 8),
      new THREE.Vector3(housePos.x, 0.5, housePos.z + 4.6),
      2500
    );

    // Animate Dumbledore walking to door
    await this._animateWalk(this.dumbledore, this.dumbledore.position.clone(),
      new THREE.Vector3(housePos.x, 0, housePos.z + 4.2), 2000);

    // Place baby Harry on doorstep
    this.babyHarry.position.set(doorstepPos.x, doorstepPos.y, doorstepPos.z);

    await this._showEntries(dialogue, entries.slice(6, 8));

    // Dumbledore walks back
    await this._animateWalk(this.dumbledore, this.dumbledore.position.clone(),
      new THREE.Vector3(housePos.x + 3, 0, housePos.z + 6), 1500);

    // Phase 4: The three look at Harry
    await cameraController.animateTo(
      new THREE.Vector3(housePos.x + 6, 3, housePos.z + 10),
      new THREE.Vector3(doorstepPos.x, 0.3, doorstepPos.z),
      2500
    );

    await this._showEntries(dialogue, [entries[8]]);

    // Phase 5: Hagrid leaves on motorcycle
    await this._showEntries(dialogue, entries.slice(9, 11));

    // Motorcycle departure
    audio.init();
    audio.playMotorcycle(4);

    await cameraController.animateTo(
      new THREE.Vector3(0, 8, 10),
      new THREE.Vector3(0, 20, -20),
      2000
    );

    await effects.motorcycleDeparture(this.motorcycle, this.hagrid, 3000);

    // Phase 6: Put-Outer – lights come back on
    await cameraController.animateTo(
      new THREE.Vector3(5, 4, 5),
      new THREE.Vector3(-7.5, 3, -8),
      2000
    );

    await this._showEntries(dialogue, [entries[11]]);

    // Restore lamps!
    audio.playPutOuter();
    await world.restoreLamps();

    await this._showEntries(dialogue, entries.slice(12, 14));

    // Phase 7: "Good luck, Harry"
    await cameraController.animateTo(
      new THREE.Vector3(housePos.x + 3, 2, housePos.z + 7),
      new THREE.Vector3(this.dumbledore.position.x, 2, this.dumbledore.position.z),
      2000
    );

    await this._showEntries(dialogue, [entries[14]]);

    // Dumbledore disappears
    await effects.disappearDumbledore(this.dumbledore);

    // Phase 8: Final narration – zoom out
    await cameraController.animateTo(
      new THREE.Vector3(0, 15, 25),
      new THREE.Vector3(0, 2, 0),
      4000
    );

    await this._showEntries(dialogue, entries.slice(15, 18));

    // Show ending title
    this._showEndScreen();
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
      character.lookAt(to.x, 0, to.z);

      const animate = () => {
        const t = Math.min((performance.now() - startTime) / duration, 1);
        character.position.lerpVectors(from, to, t);
        character.position.y = Math.sin(t * Math.PI * 6) * 0.03;

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

  _showEndScreen() {
    const endScreen = document.createElement('div');
    endScreen.id = 'end-screen';
    endScreen.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0);
      display: flex; align-items: center; justify-content: center;
      flex-direction: column;
      z-index: 300;
      transition: background 3s ease;
      pointer-events: none;
    `;

    const title = document.createElement('h1');
    title.style.cssText = `
      font-family: 'Cinzel', serif; font-size: 3rem;
      color: #d4a843; text-shadow: 0 0 40px rgba(212, 168, 67, 0.5);
      opacity: 0; transition: opacity 2s ease 1s;
      text-align: center; letter-spacing: 0.1em;
    `;
    title.textContent = 'To Harry Potter — The Boy Who Lived';

    const subtitle = document.createElement('p');
    subtitle.style.cssText = `
      font-family: 'Crimson Text', serif; font-style: italic;
      font-size: 1.2rem; color: #998866;
      opacity: 0; transition: opacity 2s ease 2s;
      margin-top: 1em;
    `;
    subtitle.textContent = 'End of Chapter 1';

    const restartBtn = document.createElement('p');
    restartBtn.style.cssText = `
      font-family: 'Crimson Text', serif;
      font-size: 1rem; color: #d4a843;
      opacity: 0; transition: opacity 2s ease 4s;
      margin-top: 2em; cursor: pointer;
      pointer-events: auto;
    `;
    restartBtn.textContent = 'Click to restart';
    restartBtn.addEventListener('click', () => {
      location.reload();
    });

    endScreen.appendChild(title);
    endScreen.appendChild(subtitle);
    endScreen.appendChild(restartBtn);
    document.body.appendChild(endScreen);

    requestAnimationFrame(() => {
      endScreen.style.background = 'rgba(0, 0, 0, 0.85)';
      title.style.opacity = '1';
      subtitle.style.opacity = '1';
      restartBtn.style.opacity = '1';
    });
  }

  update(game, deltaTime) {}

  cleanup(game) {
    this.sceneObjects.forEach(obj => {
      game.scene.remove(obj);
    });
    this.sceneObjects = [];
    const endScreen = document.getElementById('end-screen');
    if (endScreen) endScreen.remove();
  }
}
