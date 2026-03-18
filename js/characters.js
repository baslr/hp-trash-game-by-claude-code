// characters.js – Low-poly stylized character models
import * as THREE from 'three';

export class Characters {
  constructor() {
    this.models = {};
  }

  // Disable frustum culling on a group and all its children
  // to prevent Three.js from incorrectly hiding objects during animations
  _disableFrustumCulling(group) {
    group.traverse(child => {
      if (child.isMesh) {
        child.frustumCulled = false;
      }
    });
  }

  // Create Mr. Dursley – big, beefy, hardly any neck
  createDursley() {
    const group = new THREE.Group();
    group.userData.name = 'dursley';

    // Body (large, stocky)
    const bodyGeo = new THREE.CylinderGeometry(0.6, 0.5, 1.5, 8);
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x333344 }); // dark suit
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.25;
    body.castShadow = true;
    group.add(body);

    // Belly
    const bellyGeo = new THREE.SphereGeometry(0.55, 8, 8);
    const belly = new THREE.Mesh(bellyGeo, bodyMat);
    belly.position.set(0, 1.1, 0.15);
    belly.scale.set(1, 0.8, 1);
    group.add(belly);

    // Head (round, no neck)
    const headGeo = new THREE.SphereGeometry(0.35, 8, 8);
    const skinMat = new THREE.MeshLambertMaterial({ color: 0xf0c8a0 });
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 2.1;
    head.castShadow = true;
    group.add(head);

    // Mustache
    const mustacheGeo = new THREE.BoxGeometry(0.3, 0.06, 0.1);
    const mustacheMat = new THREE.MeshLambertMaterial({ color: 0x3a2a1a });
    const mustache = new THREE.Mesh(mustacheGeo, mustacheMat);
    mustache.position.set(0, 2.0, 0.32);
    group.add(mustache);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.15, 0.12, 0.8, 6);
    const legMat = new THREE.MeshLambertMaterial({ color: 0x333344 });
    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-0.2, 0.4, 0);
    group.add(leftLeg);
    const rightLeg = leftLeg.clone();
    rightLeg.position.x = 0.2;
    group.add(rightLeg);

    // Shoes
    const shoeGeo = new THREE.BoxGeometry(0.18, 0.1, 0.3);
    const shoeMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
    const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
    leftShoe.position.set(-0.2, 0.05, 0.05);
    group.add(leftShoe);
    const rightShoe = leftShoe.clone();
    rightShoe.position.x = 0.2;
    group.add(rightShoe);

    this.models.dursley = group;
    this._disableFrustumCulling(group);
    return group;
  }

  // Create Petunia Dursley – thin, blonde, long neck
  createPetunia() {
    const group = new THREE.Group();
    group.userData.name = 'petunia';

    // Body (thin)
    const bodyGeo = new THREE.CylinderGeometry(0.3, 0.35, 1.3, 8);
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0xaa6688 }); // pink/mauve
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.15;
    body.castShadow = true;
    group.add(body);

    // Neck (long!)
    const neckGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.4, 6);
    const skinMat = new THREE.MeshLambertMaterial({ color: 0xf0c8a0 });
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.y = 2;
    group.add(neck);

    // Head
    const headGeo = new THREE.SphereGeometry(0.28, 8, 8);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 2.35;
    head.castShadow = true;
    group.add(head);

    // Hair (blonde)
    const hairGeo = new THREE.SphereGeometry(0.3, 8, 8);
    const hairMat = new THREE.MeshLambertMaterial({ color: 0xddcc77 });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 2.4;
    hair.scale.set(1, 1.1, 0.9);
    group.add(hair);

    // Skirt
    const skirtGeo = new THREE.ConeGeometry(0.4, 0.6, 8);
    const skirt = new THREE.Mesh(skirtGeo, bodyMat);
    skirt.position.y = 0.5;
    skirt.rotation.x = Math.PI;
    group.add(skirt);

    this.models.petunia = group;
    this._disableFrustumCulling(group);
    return group;
  }

  // Create Dumbledore – tall, thin, long silver beard, half-moon glasses
  createDumbledore() {
    const group = new THREE.Group();
    group.userData.name = 'dumbledore';

    // Robes (tall, flowing)
    const robeGeo = new THREE.CylinderGeometry(0.35, 0.5, 2, 8);
    const robeMat = new THREE.MeshLambertMaterial({ color: 0x4a3080 }); // purple robes
    const robe = new THREE.Mesh(robeGeo, robeMat);
    robe.position.y = 1.2;
    robe.castShadow = true;
    group.add(robe);

    // Cloak overlay
    const cloakGeo = new THREE.ConeGeometry(0.55, 2.2, 8);
    const cloakMat = new THREE.MeshLambertMaterial({ color: 0x3a2070, transparent: true, opacity: 0.7 });
    const cloak = new THREE.Mesh(cloakGeo, cloakMat);
    cloak.position.y = 1.1;
    cloak.rotation.x = Math.PI;
    group.add(cloak);

    // Head
    const headGeo = new THREE.SphereGeometry(0.25, 8, 8);
    const skinMat = new THREE.MeshLambertMaterial({ color: 0xf0d0b0 });
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 2.55;
    head.castShadow = true;
    group.add(head);

    // Long beard (silver)
    const beardGeo = new THREE.ConeGeometry(0.2, 1.2, 6);
    const beardMat = new THREE.MeshLambertMaterial({ color: 0xcccccc });
    const beard = new THREE.Mesh(beardGeo, beardMat);
    beard.position.set(0, 1.7, 0.15);
    group.add(beard);

    // Hat (pointed wizard hat)
    const hatGeo = new THREE.ConeGeometry(0.3, 0.8, 8);
    const hatMat = new THREE.MeshLambertMaterial({ color: 0x3a2070 });
    const hat = new THREE.Mesh(hatGeo, hatMat);
    hat.position.y = 3.1;
    // Slight tilt
    hat.rotation.z = 0.1;
    hat.castShadow = true;
    group.add(hat);

    // Half-moon glasses (simple representation)
    const glassGeo = new THREE.TorusGeometry(0.08, 0.01, 4, 8, Math.PI);
    const glassMat = new THREE.MeshBasicMaterial({ color: 0xddddff });
    const leftGlass = new THREE.Mesh(glassGeo, glassMat);
    leftGlass.position.set(-0.1, 2.55, 0.24);
    leftGlass.rotation.x = -0.3;
    group.add(leftGlass);
    const rightGlass = leftGlass.clone();
    rightGlass.position.x = 0.1;
    group.add(rightGlass);

    // Put-Outer in hand (small cylinder)
    const putOuterGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.15, 6);
    const putOuterMat = new THREE.MeshLambertMaterial({ color: 0xc0c0c0 });
    const putOuter = new THREE.Mesh(putOuterGeo, putOuterMat);
    putOuter.position.set(0.4, 1.5, 0.3);
    putOuter.rotation.z = Math.PI / 4;
    putOuter.userData.isPutOuter = true;
    group.add(putOuter);

    this.models.dumbledore = group;
    this._disableFrustumCulling(group);
    return group;
  }

  // Create McGonagall – stern, black hair in bun, emerald robes
  createMcGonagall() {
    const group = new THREE.Group();
    group.userData.name = 'mcgonagall';

    // Robes (emerald green)
    const robeGeo = new THREE.CylinderGeometry(0.3, 0.45, 1.8, 8);
    const robeMat = new THREE.MeshLambertMaterial({ color: 0x2a6644 });
    const robe = new THREE.Mesh(robeGeo, robeMat);
    robe.position.y = 1.1;
    robe.castShadow = true;
    group.add(robe);

    // Head
    const headGeo = new THREE.SphereGeometry(0.22, 8, 8);
    const skinMat = new THREE.MeshLambertMaterial({ color: 0xf0d0b0 });
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 2.25;
    head.castShadow = true;
    group.add(head);

    // Hair bun (black)
    const bunGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const hairMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
    const bun = new THREE.Mesh(bunGeo, hairMat);
    bun.position.set(0, 2.4, -0.1);
    group.add(bun);

    // Witch hat
    const hatGeo = new THREE.ConeGeometry(0.28, 0.6, 8);
    const hatMat = new THREE.MeshLambertMaterial({ color: 0x1a1a2a });
    const hat = new THREE.Mesh(hatGeo, hatMat);
    hat.position.y = 2.7;
    hat.castShadow = true;
    group.add(hat);

    // Hat brim
    const brimGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.03, 12);
    const brim = new THREE.Mesh(brimGeo, hatMat);
    brim.position.y = 2.45;
    group.add(brim);

    // Square glasses
    const glassGeo = new THREE.BoxGeometry(0.12, 0.08, 0.01);
    const glassMat = new THREE.MeshBasicMaterial({ color: 0xddddff, transparent: true, opacity: 0.5 });
    const leftGlass = new THREE.Mesh(glassGeo, glassMat);
    leftGlass.position.set(-0.08, 2.25, 0.22);
    group.add(leftGlass);
    const rightGlass = leftGlass.clone();
    rightGlass.position.x = 0.08;
    group.add(rightGlass);

    this.models.mcgonagall = group;
    this._disableFrustumCulling(group);
    return group;
  }

  // Create Tabby Cat (McGonagall's animagus form)
  createTabbyCat() {
    const group = new THREE.Group();
    group.userData.name = 'cat';

    const catMat = new THREE.MeshLambertMaterial({ color: 0x887755 }); // tabby

    // Body
    const bodyGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.5, 8);
    const body = new THREE.Mesh(bodyGeo, catMat);
    body.position.y = 0.35;
    body.rotation.z = Math.PI / 2;
    body.castShadow = true;
    group.add(body);

    // Head
    const headGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const head = new THREE.Mesh(headGeo, catMat);
    head.position.set(0.25, 0.4, 0);
    group.add(head);

    // Ears
    const earGeo = new THREE.ConeGeometry(0.04, 0.08, 4);
    const leftEar = new THREE.Mesh(earGeo, catMat);
    leftEar.position.set(0.25, 0.55, -0.06);
    group.add(leftEar);
    const rightEar = leftEar.clone();
    rightEar.position.z = 0.06;
    group.add(rightEar);

    // Tail
    const tailGeo = new THREE.CylinderGeometry(0.02, 0.015, 0.35, 6);
    const tail = new THREE.Mesh(tailGeo, catMat);
    tail.position.set(-0.3, 0.5, 0);
    tail.rotation.z = Math.PI / 3;
    group.add(tail);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.025, 0.02, 0.2, 4);
    const legPositions = [
      { x: 0.15, z: -0.08 }, { x: 0.15, z: 0.08 },
      { x: -0.15, z: -0.08 }, { x: -0.15, z: 0.08 }
    ];
    legPositions.forEach(pos => {
      const leg = new THREE.Mesh(legGeo, catMat);
      leg.position.set(pos.x, 0.15, pos.z);
      group.add(leg);
    });

    // Spectacle markings around eyes (McGonagall's distinctive mark)
    const markingGeo = new THREE.TorusGeometry(0.04, 0.005, 4, 8);
    const markingMat = new THREE.MeshBasicMaterial({ color: 0x554433 });
    const leftMark = new THREE.Mesh(markingGeo, markingMat);
    leftMark.position.set(0.35, 0.42, -0.04);
    leftMark.rotation.y = Math.PI / 2;
    group.add(leftMark);
    const rightMark = leftMark.clone();
    rightMark.position.z = 0.04;
    group.add(rightMark);

    // Scale the cat
    group.scale.set(1.5, 1.5, 1.5);

    this.models.cat = group;
    this._disableFrustumCulling(group);
    return group;
  }

  // Create Hagrid – twice as tall, five times as wide
  createHagrid() {
    const group = new THREE.Group();
    group.userData.name = 'hagrid';

    // Massive body
    const bodyGeo = new THREE.CylinderGeometry(0.8, 0.7, 2.5, 8);
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x3a2a1a }); // moleskin overcoat
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 2;
    body.castShadow = true;
    group.add(body);

    // Belt
    const beltGeo = new THREE.TorusGeometry(0.75, 0.05, 4, 16);
    const beltMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
    const belt = new THREE.Mesh(beltGeo, beltMat);
    belt.position.y = 1.5;
    belt.rotation.x = Math.PI / 2;
    group.add(belt);

    // Head (big, bushy)
    const headGeo = new THREE.SphereGeometry(0.4, 8, 8);
    const skinMat = new THREE.MeshLambertMaterial({ color: 0xd0a080 });
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 3.5;
    head.castShadow = true;
    group.add(head);

    // Wild bushy hair
    const hairGeo = new THREE.SphereGeometry(0.5, 8, 8);
    const hairMat = new THREE.MeshLambertMaterial({ color: 0x2a1a0a });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 3.6;
    hair.scale.set(1.1, 1, 1.2);
    group.add(hair);

    // Wild bushy beard
    const beardGeo = new THREE.SphereGeometry(0.35, 8, 8);
    const beard = new THREE.Mesh(beardGeo, hairMat);
    beard.position.set(0, 3.1, 0.2);
    beard.scale.set(1, 1.3, 0.8);
    group.add(beard);

    // Eyes (small, beetle-like)
    const eyeGeo = new THREE.SphereGeometry(0.04, 6, 6);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.12, 3.55, 0.37);
    group.add(leftEye);
    const rightEye = leftEye.clone();
    rightEye.position.x = 0.12;
    group.add(rightEye);

    // Boots
    const bootGeo = new THREE.CylinderGeometry(0.2, 0.22, 0.6, 6);
    const bootMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
    const leftBoot = new THREE.Mesh(bootGeo, bootMat);
    leftBoot.position.set(-0.3, 0.3, 0);
    group.add(leftBoot);
    const rightBoot = leftBoot.clone();
    rightBoot.position.x = 0.3;
    group.add(rightBoot);

    // Hands (massive)
    const handGeo = new THREE.SphereGeometry(0.15, 6, 6);
    const handMat = new THREE.MeshLambertMaterial({ color: 0xd0a080 });
    const leftHand = new THREE.Mesh(handGeo, handMat);
    leftHand.position.set(-0.85, 2, 0);
    group.add(leftHand);
    const rightHand = leftHand.clone();
    rightHand.position.x = 0.85;
    group.add(rightHand);

    this.models.hagrid = group;
    this._disableFrustumCulling(group);
    return group;
  }

  // Create Baby Harry (bundle of blankets with a tiny face)
  createBabyHarry() {
    const group = new THREE.Group();
    group.userData.name = 'babyHarry';

    // Blanket bundle
    const blanketGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const blanketMat = new THREE.MeshLambertMaterial({ color: 0xeeeedd }); // cream blanket
    const blanket = new THREE.Mesh(blanketGeo, blanketMat);
    blanket.scale.set(1, 0.7, 1.3);
    blanket.position.y = 0.2;
    group.add(blanket);

    // Tiny face
    const faceGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const faceMat = new THREE.MeshLambertMaterial({ color: 0xf0d0b0 });
    const face = new THREE.Mesh(faceGeo, faceMat);
    face.position.set(0, 0.3, 0.15);
    group.add(face);

    // Dark hair tuft
    const hairGeo = new THREE.SphereGeometry(0.04, 6, 6);
    const hairMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 0.35, 0.12);
    group.add(hair);

    // Lightning bolt scar (tiny line)
    const scarGeo = new THREE.BoxGeometry(0.01, 0.03, 0.005);
    const scarMat = new THREE.MeshBasicMaterial({ color: 0xff3333 });
    const scar = new THREE.Mesh(scarGeo, scarMat);
    scar.position.set(0.01, 0.33, 0.21);
    scar.rotation.z = 0.3;
    group.add(scar);

    this.models.babyHarry = group;
    this._disableFrustumCulling(group);
    return group;
  }

  // Create a generic cloaked figure (for townspeople in cloaks)
  createCloakedFigure(color = 0x5a2080) {
    const group = new THREE.Group();

    const cloakGeo = new THREE.ConeGeometry(0.35, 1.8, 8);
    const cloakMat = new THREE.MeshLambertMaterial({ color });
    const cloak = new THREE.Mesh(cloakGeo, cloakMat);
    cloak.position.y = 0.9;
    cloak.rotation.x = Math.PI;
    group.add(cloak);

    const headGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const headMat = new THREE.MeshLambertMaterial({ color: 0xf0d0b0 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.9;
    group.add(head);

    // Hood
    const hoodGeo = new THREE.SphereGeometry(0.25, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const hood = new THREE.Mesh(hoodGeo, cloakMat);
    hood.position.y = 1.9;
    group.add(hood);

    this._disableFrustumCulling(group);
    return group;
  }

  // Create Dursley's car (drill company executive)
  createCar() {
    const group = new THREE.Group();

    // Car body
    const bodyGeo = new THREE.BoxGeometry(2, 0.8, 4);
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x2a2a3a }); // dark car
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.6;
    body.castShadow = true;
    group.add(body);

    // Car top
    const topGeo = new THREE.BoxGeometry(1.8, 0.6, 2.5);
    const top = new THREE.Mesh(topGeo, bodyMat);
    top.position.set(0, 1.3, -0.3);
    top.castShadow = true;
    group.add(top);

    // Windshield
    const windGeo = new THREE.BoxGeometry(1.6, 0.5, 0.05);
    const windMat = new THREE.MeshLambertMaterial({ color: 0x88aacc, transparent: true, opacity: 0.5 });
    const windshield = new THREE.Mesh(windGeo, windMat);
    windshield.position.set(0, 1.2, 0.95);
    windshield.rotation.x = 0.3;
    group.add(windshield);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.15, 8);
    const wheelMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
    const wheelPositions = [
      { x: -1, z: 1.2 }, { x: 1, z: 1.2 },
      { x: -1, z: -1.2 }, { x: 1, z: -1.2 }
    ];
    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.position.set(pos.x, 0.25, pos.z);
      wheel.rotation.x = Math.PI / 2;
      group.add(wheel);
    });

    // Headlights
    const lightGeo = new THREE.SphereGeometry(0.1, 6, 6);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffaa });
    const leftLight = new THREE.Mesh(lightGeo, lightMat);
    leftLight.position.set(-0.7, 0.6, 2);
    group.add(leftLight);
    const rightLight = leftLight.clone();
    rightLight.position.x = 0.7;
    group.add(rightLight);

    this.models.car = group;
    this._disableFrustumCulling(group);
    return group;
  }

  // Create flying motorcycle
  createMotorcycle() {
    const group = new THREE.Group();
    group.userData.name = 'motorcycle';

    const metalMat = new THREE.MeshLambertMaterial({ color: 0x444444 });
    const chromeMat = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });

    // Body frame
    const frameGeo = new THREE.BoxGeometry(0.4, 0.4, 2);
    const frame = new THREE.Mesh(frameGeo, metalMat);
    frame.position.y = 0.6;
    frame.castShadow = true;
    group.add(frame);

    // Engine
    const engineGeo = new THREE.BoxGeometry(0.5, 0.3, 0.6);
    const engine = new THREE.Mesh(engineGeo, metalMat);
    engine.position.set(0, 0.4, 0);
    group.add(engine);

    // Front wheel
    const wheelGeo = new THREE.TorusGeometry(0.3, 0.08, 8, 16);
    const wheelMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
    const frontWheel = new THREE.Mesh(wheelGeo, wheelMat);
    frontWheel.position.set(0, 0.3, 1.1);
    group.add(frontWheel);

    // Rear wheel
    const rearWheel = frontWheel.clone();
    rearWheel.position.z = -0.9;
    group.add(rearWheel);

    // Handlebars
    const handleGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 6);
    const handle = new THREE.Mesh(handleGeo, chromeMat);
    handle.position.set(0, 1, 0.8);
    handle.rotation.z = Math.PI / 2;
    group.add(handle);

    // Seat
    const seatGeo = new THREE.BoxGeometry(0.3, 0.1, 0.6);
    const seatMat = new THREE.MeshLambertMaterial({ color: 0x2a1a0a });
    const seat = new THREE.Mesh(seatGeo, seatMat);
    seat.position.set(0, 0.85, -0.2);
    group.add(seat);

    // Headlight
    const headlightGeo = new THREE.SphereGeometry(0.08, 6, 6);
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffaa });
    const headlight = new THREE.Mesh(headlightGeo, headlightMat);
    headlight.position.set(0, 0.7, 1.3);
    group.add(headlight);

    // Headlight beam
    const beamLight = new THREE.SpotLight(0xffffaa, 2, 20, 0.3);
    beamLight.position.set(0, 0.7, 1.3);
    beamLight.target.position.set(0, -1, 5);
    group.add(beamLight);
    group.add(beamLight.target);

    // Exhaust pipes
    const exhaustGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.8, 6);
    const exhaust = new THREE.Mesh(exhaustGeo, chromeMat);
    exhaust.position.set(0.25, 0.35, -0.8);
    exhaust.rotation.x = Math.PI / 6;
    group.add(exhaust);

    this.models.motorcycle = group;
    this._disableFrustumCulling(group);
    return group;
  }

  // Utility: Simple walking animation
  animateWalk(character, deltaTime) {
    const time = performance.now() * 0.005;
    // Simple body bob
    character.position.y = Math.sin(time * 3) * 0.02;
  }

  // Utility: Move character along a path
  moveAlongPath(character, points, speed, onComplete) {
    let currentPoint = 0;
    const move = () => {
      if (currentPoint >= points.length) {
        if (onComplete) onComplete();
        return;
      }

      const target = points[currentPoint];
      const direction = new THREE.Vector3().subVectors(target, character.position);
      const distance = direction.length();

      if (distance < 0.1) {
        currentPoint++;
        move();
        return;
      }

      direction.normalize().multiplyScalar(speed);
      character.position.add(direction);

      // Face direction of movement
      character.lookAt(target);

      requestAnimationFrame(move);
    };
    move();
  }
}
