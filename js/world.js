// world.js – Privet Drive world geometry
import * as THREE from 'three';

export class World {
  constructor() {
    this.group = new THREE.Group();
    this.streetLamps = [];
    this.lampLights = [];
    this.houses = [];
    this.timeOfDay = 'morning'; // morning, afternoon, evening, night
  }

  build() {
    this._createGround();
    this._createStreet();
    this._createSidewalks();
    this._createHouses();
    this._createStreetLamps();
    this._createVegetation();
    this._createSky();

    // Disable frustum culling on ALL world meshes.
    // Three.js calculates bounding spheres per-mesh, not per-group.
    // Small meshes inside groups (lamp bulbs, window frames, etc.) get
    // incorrectly culled at screen edges because their tiny individual
    // bounding sphere leaves the frustum even though the parent group
    // is still clearly visible.
    this.group.traverse(child => {
      if (child.isMesh) {
        child.frustumCulled = false;
      }
    });

    return this.group;
  }

  _createGround() {
    // Grass areas
    const grassGeo = new THREE.PlaneGeometry(200, 200);
    const grassMat = new THREE.MeshLambertMaterial({ color: 0x3a7d44 });
    const grass = new THREE.Mesh(grassGeo, grassMat);
    grass.rotation.x = -Math.PI / 2;
    grass.position.y = -0.01;
    grass.receiveShadow = true;
    this.group.add(grass);
  }

  _createStreet() {
    // Main road
    const roadGeo = new THREE.PlaneGeometry(10, 120);
    const roadMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.y = 0.01;
    road.receiveShadow = true;
    this.group.add(road);

    // Road markings (center line)
    for (let z = -55; z < 55; z += 5) {
      const markGeo = new THREE.PlaneGeometry(0.15, 2);
      const markMat = new THREE.MeshBasicMaterial({ color: 0xcccccc });
      const mark = new THREE.Mesh(markGeo, markMat);
      mark.rotation.x = -Math.PI / 2;
      mark.position.set(0, 0.02, z);
      this.group.add(mark);
    }

    // Curb stones on both sides
    const curbGeo = new THREE.BoxGeometry(0.3, 0.15, 120);
    const curbMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
    const leftCurb = new THREE.Mesh(curbGeo, curbMat);
    leftCurb.position.set(-5.15, 0.075, 0);
    leftCurb.castShadow = true;
    this.group.add(leftCurb);

    const rightCurb = leftCurb.clone();
    rightCurb.position.set(5.15, 0.075, 0);
    this.group.add(rightCurb);
  }

  _createSidewalks() {
    // Sidewalks on both sides
    const walkGeo = new THREE.PlaneGeometry(2.5, 120);
    const walkMat = new THREE.MeshLambertMaterial({ color: 0x999999 });

    const leftWalk = new THREE.Mesh(walkGeo, walkMat);
    leftWalk.rotation.x = -Math.PI / 2;
    leftWalk.position.set(-6.5, 0.02, 0);
    leftWalk.receiveShadow = true;
    this.group.add(leftWalk);

    const rightWalk = leftWalk.clone();
    rightWalk.position.set(6.5, 0.02, 0);
    this.group.add(rightWalk);
  }

  _createHouses() {
    // Create row of houses on both sides of the street
    const housePositions = [
      // Left side (even numbers) – Nr. 2, 4, 6, 8, 10, 12
      { x: -14, z: -20, num: 2, side: 'left' },
      { x: -14, z: -8, num: 4, side: 'left', special: true },   // Number 4!
      { x: -14, z: 4, num: 6, side: 'left' },
      { x: -14, z: 16, num: 8, side: 'left' },
      { x: -14, z: 28, num: 10, side: 'left' },
      { x: -14, z: 40, num: 12, side: 'left' },
      // Right side (odd numbers) – Nr. 1, 3, 5, 7, 9, 11
      { x: 14, z: -20, num: 1, side: 'right' },
      { x: 14, z: -8, num: 3, side: 'right' },
      { x: 14, z: 4, num: 5, side: 'right' },
      { x: 14, z: 16, num: 7, side: 'right' },
      { x: 14, z: 28, num: 9, side: 'right' },
      { x: 14, z: 40, num: 11, side: 'right' },
    ];

    housePositions.forEach(pos => {
      const house = this._createHouse(pos.special || false, pos.side);
      house.position.set(pos.x, 0, pos.z);
      if (pos.side === 'right') house.rotation.y = Math.PI;
      house.userData.number = pos.num;
      this.houses.push(house);
      this.group.add(house);
    });
  }

  _createHouse(isNumberFour = false, side = 'left') {
    const houseGroup = new THREE.Group();
    const wallColor = isNumberFour ? 0xd4c5a9 : 0xc4b599;
    const roofColor = isNumberFour ? 0x6b3a3a : 0x5a4a3a;

    // Main body
    const bodyGeo = new THREE.BoxGeometry(7, 5, 8);
    const bodyMat = new THREE.MeshLambertMaterial({ color: wallColor });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 2.5;
    body.castShadow = true;
    body.receiveShadow = true;
    houseGroup.add(body);

    // Roof
    const roofGeo = new THREE.ConeGeometry(5.5, 3, 4);
    const roofMat = new THREE.MeshLambertMaterial({ color: roofColor });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 6.5;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    houseGroup.add(roof);

    // Door
    const doorGeo = new THREE.BoxGeometry(1, 2.2, 0.1);
    const doorMat = new THREE.MeshLambertMaterial({ color: isNumberFour ? 0x4a2828 : 0x3a2a1a });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, 1.1, 4.05);
    houseGroup.add(door);

    // Door step
    const stepGeo = new THREE.BoxGeometry(1.8, 0.15, 0.6);
    const stepMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
    const step = new THREE.Mesh(stepGeo, stepMat);
    step.position.set(0, 0.075, 4.3);
    houseGroup.add(step);

    // Windows (2 downstairs, 2 upstairs)
    const windowGeo = new THREE.BoxGeometry(1.2, 1.2, 0.1);
    const windowMat = new THREE.MeshLambertMaterial({ color: 0x88aabb, emissive: 0x112233, emissiveIntensity: 0.2 });

    const windowPositions = [
      { x: -2, y: 1.8, z: 4.05 }, // downstairs left
      { x: 2, y: 1.8, z: 4.05 },  // downstairs right
      { x: -2, y: 4, z: 4.05 },   // upstairs left
      { x: 2, y: 4, z: 4.05 },    // upstairs right
    ];

    windowPositions.forEach(pos => {
      const win = new THREE.Mesh(windowGeo, windowMat.clone());
      win.position.set(pos.x, pos.y, pos.z);
      houseGroup.add(win);
    });

    // Window frames
    windowPositions.forEach(pos => {
      const frameH = new THREE.BoxGeometry(1.4, 0.08, 0.12);
      const frameV = new THREE.BoxGeometry(0.08, 1.4, 0.12);
      const frameMat = new THREE.MeshLambertMaterial({ color: 0xffffff });

      const top = new THREE.Mesh(frameH, frameMat);
      top.position.set(pos.x, pos.y + 0.66, pos.z + 0.02);
      houseGroup.add(top);

      const bottom = top.clone();
      bottom.position.y = pos.y - 0.66;
      houseGroup.add(bottom);

      const left = new THREE.Mesh(frameV, frameMat);
      left.position.set(pos.x - 0.66, pos.y, pos.z + 0.02);
      houseGroup.add(left);

      const right = left.clone();
      right.position.x = pos.x + 0.66;
      houseGroup.add(right);
    });

    // Chimney (embedded in sloped roof – roof base y=5, peak y=8)
    const chimneyGeo = new THREE.BoxGeometry(0.8, 2.5, 0.8);
    const chimneyMat = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
    const chimney = new THREE.Mesh(chimneyGeo, chimneyMat);
    chimney.position.set(2, 5.8, -1);
    chimney.castShadow = true;
    houseGroup.add(chimney);

    if (isNumberFour) {
      // Garden wall
      const wallGeo = new THREE.BoxGeometry(0.3, 1, 12);
      const wallMat = new THREE.MeshLambertMaterial({ color: 0x887766 });
      const gardenWall = new THREE.Mesh(wallGeo, wallMat);
      gardenWall.position.set(3.8, 0.5, -1);
      gardenWall.castShadow = true;
      houseGroup.add(gardenWall);

      const gardenWall2 = new THREE.Mesh(
        new THREE.BoxGeometry(8, 1, 0.3),
        wallMat
      );
      gardenWall2.position.set(0, 0.5, 5);
      houseGroup.add(gardenWall2);

      // Driveway
      const driveGeo = new THREE.PlaneGeometry(3, 6);
      const driveMat = new THREE.MeshLambertMaterial({ color: 0x666666 });
      const drive = new THREE.Mesh(driveGeo, driveMat);
      drive.rotation.x = -Math.PI / 2;
      drive.position.set(-2.5, 0.02, 7);
      houseGroup.add(drive);

      // House number "4"
      const numberGeo = new THREE.BoxGeometry(0.4, 0.4, 0.05);
      const numberMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const numberPlate = new THREE.Mesh(numberGeo, numberMat);
      numberPlate.position.set(0.8, 2.5, 4.06);
      houseGroup.add(numberPlate);

      // Mark this as number 4 for interactions
      houseGroup.userData.isNumberFour = true;

      // The doorstep where Harry will be placed
      const doorstepGeo = new THREE.BoxGeometry(2.5, 0.1, 1);
      const doorstepMat = new THREE.MeshLambertMaterial({ color: 0x776655 });
      const doorstep = new THREE.Mesh(doorstepGeo, doorstepMat);
      doorstep.position.set(0, 0.05, 4.6);
      doorstep.userData.isDoorstep = true;
      houseGroup.add(doorstep);
    }

    // Front garden path
    const pathGeo = new THREE.PlaneGeometry(1.2, 4);
    const pathMat = new THREE.MeshLambertMaterial({ color: 0x777777 });
    const path = new THREE.Mesh(pathGeo, pathMat);
    path.rotation.x = -Math.PI / 2;
    path.position.set(0, 0.02, 6);
    houseGroup.add(path);

    return houseGroup;
  }

  _createStreetLamps() {
    const lampPositions = [
      // Left side
      { x: -7.5, z: -50 },
      { x: -7.5, z: -38 },
      { x: -7.5, z: -26 },
      { x: -7.5, z: -14 },
      { x: -7.5, z: -2 },
      { x: -7.5, z: 10 },
      { x: -7.5, z: 22 },
      { x: -7.5, z: 34 },
      { x: -7.5, z: 46 },
      // Right side
      { x: 7.5, z: -44 },
      { x: 7.5, z: -32 },
      { x: 7.5, z: -20 },
      { x: 7.5, z: -8 },
      { x: 7.5, z: 4 },
      { x: 7.5, z: 16 },
      { x: 7.5, z: 28 },
      { x: 7.5, z: 40 },
    ];

    lampPositions.forEach((pos, index) => {
      const lamp = this._createStreetLamp(index);
      lamp.position.set(pos.x, 0, pos.z);
      this.group.add(lamp);
    });
  }

  _createStreetLamp(index) {
    const lampGroup = new THREE.Group();

    // Pole – emissive so it's visible even in very dark scenes
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.1, 4, 8);
    const poleMat = new THREE.MeshLambertMaterial({
      color: 0x444444,
      emissive: 0x181818,
      emissiveIntensity: 1
    });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 2;
    pole.castShadow = true;
    lampGroup.add(pole);

    // Base plate – so the lamp is grounded and visible
    const baseGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.15, 8);
    const base = new THREE.Mesh(baseGeo, poleMat);
    base.position.y = 0.075;
    lampGroup.add(base);

    // Arm
    const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 6);
    const arm = new THREE.Mesh(armGeo, poleMat);
    arm.position.set(0.5, 3.9, 0);
    arm.rotation.z = -Math.PI / 4;
    lampGroup.add(arm);

    // Lamp housing
    const housingGeo = new THREE.BoxGeometry(0.5, 0.4, 0.5);
    const housingMat = new THREE.MeshLambertMaterial({
      color: 0x555555,
      emissive: 0x181818,
      emissiveIntensity: 1
    });
    const housing = new THREE.Mesh(housingGeo, housingMat);
    housing.position.set(0.9, 4.3, 0);
    lampGroup.add(housing);

    // Lamp bulb (emissive – bright MeshBasicMaterial ignores lighting)
    const bulbGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffdd88 });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(0.9, 4.05, 0);
    lampGroup.add(bulb);

    // Point light
    const light = new THREE.PointLight(0xffdd88, 1.2, 18);
    light.position.set(0.9, 4.05, 0);
    light.castShadow = false; // Performance
    lampGroup.add(light);

    // Store references for Put-Outer effect
    this.streetLamps.push({ group: lampGroup, bulb, light, index, isOn: true });
    this.lampLights.push(light);

    return lampGroup;
  }

  _createVegetation() {
    // Hedges between houses
    const hedgeGeo = new THREE.BoxGeometry(1, 1.2, 5);
    const hedgeMat = new THREE.MeshLambertMaterial({ color: 0x2d5a27 });

    for (let i = 0; i < 6; i++) {
      // Left side
      const hedgeL = new THREE.Mesh(hedgeGeo, hedgeMat);
      hedgeL.position.set(-10, 0.6, -20 + i * 12 + 6);
      hedgeL.castShadow = true;
      this.group.add(hedgeL);

      // Right side
      const hedgeR = hedgeL.clone();
      hedgeR.position.x = 10;
      this.group.add(hedgeR);
    }

    // Trees
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 3, 6);
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x5a3a1a });
    const crownGeo = new THREE.SphereGeometry(2, 8, 8);
    const crownMat = new THREE.MeshLambertMaterial({ color: 0x2a6a22 });

    const treePositions = [
      { x: -20, z: -15 }, { x: -22, z: 10 }, { x: -18, z: 35 },
      { x: 20, z: -25 }, { x: 22, z: 5 }, { x: 18, z: 30 },
    ];

    treePositions.forEach(pos => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.5;
      trunk.castShadow = true;
      tree.add(trunk);

      const crown = new THREE.Mesh(crownGeo, crownMat);
      crown.position.y = 4;
      crown.castShadow = true;
      tree.add(crown);

      tree.position.set(pos.x, 0, pos.z);
      this.group.add(tree);
    });
  }

  _createSky() {
    // Sky dome
    const skyGeo = new THREE.SphereGeometry(90, 32, 16);
    const skyMat = new THREE.MeshBasicMaterial({
      color: 0x87ceeb,
      side: THREE.BackSide
    });
    this.skyMesh = new THREE.Mesh(skyGeo, skyMat);
    this.group.add(this.skyMesh);

    // Stars (initially invisible, shown at night)
    this.stars = new THREE.Group();
    const starGeo = new THREE.SphereGeometry(0.1, 4, 4);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < 200; i++) {
      const star = new THREE.Mesh(starGeo, starMat);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.5;
      const r = 85;
      star.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi) + 10,
        r * Math.sin(phi) * Math.sin(theta)
      );
      this.stars.add(star);
    }
    this.stars.visible = false;
    this.group.add(this.stars);
  }

  // Set time of day – affects sky color, lamp states, ambient, and fog
  setTimeOfDay(time, sceneFog) {
    this.timeOfDay = time;
    const skyColors = {
      morning: 0x8899aa,    // grey overcast morning
      afternoon: 0x87ceeb,
      evening: 0x443355,
      night: 0x0a0a1a
    };

    const fogColors = {
      morning: 0x8899aa,
      afternoon: 0x87ceeb,
      evening: 0x332244,
      night: 0x070710
    };

    const grassColors = {
      morning: 0x3a7d44,
      afternoon: 0x4a8d54,
      evening: 0x1a3d24,
      night: 0x0a1d0e
    };

    if (this.skyMesh) {
      this.skyMesh.material.color.setHex(skyColors[time] || skyColors.morning);
    }

    // Update fog color to match sky
    if (sceneFog) {
      sceneFog.color.setHex(fogColors[time] || fogColors.morning);
    }

    this.stars.visible = (time === 'night');

    // Turn lamps on/off based on time
    const lampsOn = (time === 'evening' || time === 'night');
    this.streetLamps.forEach(lamp => {
      lamp.light.intensity = lampsOn ? 1.2 : 0;
      lamp.bulb.material.color.setHex(lampsOn ? 0xffdd88 : 0x888888);
      lamp.isOn = lampsOn;
    });
  }

  // Put-Outer effect – turn off a specific lamp with animation
  async putOutLamp(index, delay = 0) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lamp = this.streetLamps[index];
        if (!lamp) { resolve(); return; }

        // Animate light going out
        const startIntensity = lamp.light.intensity;
        const startTime = performance.now();
        const duration = 500;

        const animate = () => {
          const elapsed = performance.now() - startTime;
          const t = Math.min(elapsed / duration, 1);
          lamp.light.intensity = startIntensity * (1 - t);
          lamp.bulb.material.color.lerpColors(
            new THREE.Color(0xffdd88),
            new THREE.Color(0x222222),
            t
          );

          if (t < 1) {
            requestAnimationFrame(animate);
          } else {
            lamp.isOn = false;
            resolve();
          }
        };
        animate();
      }, delay);
    });
  }

  // Put-Outer – turn all lamps off sequentially
  async putOutAllLamps() {
    const promises = this.streetLamps.map((lamp, i) =>
      this.putOutLamp(i, i * 400)
    );
    await Promise.all(promises);
  }

  // Restore lamps
  async restoreLamps() {
    for (const lamp of this.streetLamps) {
      lamp.light.intensity = 1.2;
      lamp.bulb.material.color.setHex(0xffdd88);
      lamp.isOn = true;
      await new Promise(r => setTimeout(r, 200));
    }
  }

  // Set window lights (for evening/night scenes)
  setWindowLights(on) {
    this.houses.forEach(house => {
      house.traverse(child => {
        if (child.isMesh && child.material.emissive) {
          const intensity = on ? 0.5 : 0.2;
          child.material.emissiveIntensity = intensity;
        }
      });
    });
  }

  // Get Number 4's position
  getNumberFourPosition() {
    const house = this.houses.find(h => h.userData.isNumberFour);
    if (house) return house.position.clone();
    return new THREE.Vector3(-14, 0, -8);
  }

  // Get doorstep position
  getDoorstepPosition() {
    const pos = this.getNumberFourPosition();
    return new THREE.Vector3(pos.x + 0, 0.15, pos.z + 4.6);
  }

  // Get wall position (where Dumbledore sits)
  getWallPosition() {
    const pos = this.getNumberFourPosition();
    return new THREE.Vector3(pos.x + 3.8, 1, pos.z + 4);
  }
}
