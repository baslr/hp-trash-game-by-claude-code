// effects.js – Special visual effects
import * as THREE from 'three';

export class Effects {
  constructor(scene) {
    this.scene = scene;
    this.activeEffects = [];
    this.owls = [];
    this.shootingStars = [];
  }

  // Create owls flying across the sky
  createOwl() {
    const group = new THREE.Group();

    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x8b7355 });

    // Body
    const bodyGeo = new THREE.SphereGeometry(0.15, 6, 6);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    // Head
    const headGeo = new THREE.SphereGeometry(0.1, 6, 6);
    const head = new THREE.Mesh(headGeo, bodyMat);
    head.position.set(0, 0.1, 0.1);
    group.add(head);

    // Wings
    const wingGeo = new THREE.PlaneGeometry(0.5, 0.15);
    const wingMat = new THREE.MeshLambertMaterial({ color: 0x7a6345, side: THREE.DoubleSide });
    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    leftWing.position.set(-0.25, 0.05, 0);
    leftWing.userData.isWing = true;
    group.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.position.set(0.25, 0.05, 0);
    rightWing.userData.isWing = true;
    group.add(rightWing);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.03, 4, 4);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.04, 0.14, 0.18);
    group.add(leftEye);
    const rightEye = leftEye.clone();
    rightEye.position.x = 0.04;
    group.add(rightEye);

    return group;
  }

  // Spawn owls flying across the sky
  startOwlFlyby(count = 5) {
    for (let i = 0; i < count; i++) {
      const owl = this.createOwl();
      const startX = -80 + Math.random() * 30;
      const startY = 15 + Math.random() * 25;
      const startZ = -40 + Math.random() * 80;
      const speed = 0.08 + Math.random() * 0.05;
      const direction = new THREE.Vector3(1, Math.random() * 0.1 - 0.05, Math.random() * 0.4 - 0.2).normalize();

      owl.position.set(startX, startY, startZ);
      owl.scale.set(2, 2, 2);
      this.scene.add(owl);

      this.owls.push({
        mesh: owl,
        speed,
        direction,
        time: Math.random() * Math.PI * 2
      });
    }
  }

  updateOwls(deltaTime) {
    this.owls.forEach(owl => {
      owl.time += deltaTime * 5;

      // Move
      owl.mesh.position.addScaledVector(owl.direction, owl.speed);

      // Wing flap
      owl.mesh.children.forEach(child => {
        if (child.userData.isWing) {
          const side = child.position.x > 0 ? 1 : -1;
          child.rotation.z = side * Math.sin(owl.time) * 0.5;
        }
      });

      // Reset position if too far
      if (owl.mesh.position.x > 80) {
        owl.mesh.position.x = -80;
        owl.mesh.position.y = 15 + Math.random() * 25;
        owl.mesh.position.z = -40 + Math.random() * 80;
      }

      // Face movement direction
      const lookTarget = owl.mesh.position.clone().add(owl.direction);
      owl.mesh.lookAt(lookTarget);
    });
  }

  removeOwls() {
    this.owls.forEach(owl => {
      this.scene.remove(owl.mesh);
    });
    this.owls = [];
  }

  // Create shooting stars
  createShootingStar() {
    const group = new THREE.Group();

    // Star head
    const starGeo = new THREE.SphereGeometry(0.2, 6, 6);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(starGeo, starMat);
    group.add(star);

    // Point light for glow
    const light = new THREE.PointLight(0xffffff, 1, 15);
    group.add(light);

    // Trail (line of small spheres)
    const trailGeo = new THREE.SphereGeometry(0.08, 4, 4);
    const trailMat = new THREE.MeshBasicMaterial({ color: 0xffffaa, transparent: true });
    for (let i = 1; i <= 8; i++) {
      const trail = new THREE.Mesh(trailGeo, trailMat.clone());
      trail.position.set(-i * 0.4, i * 0.15, 0);
      trail.material.opacity = 1 - (i / 8);
      trail.scale.setScalar(1 - (i / 10));
      group.add(trail);
    }

    return group;
  }

  fireShootingStar() {
    const star = this.createShootingStar();
    const startX = -60 + Math.random() * 40;
    const startY = 40 + Math.random() * 20;
    const startZ = -30 + Math.random() * 60;

    star.position.set(startX, startY, startZ);
    star.rotation.z = -0.5;
    this.scene.add(star);

    const speed = new THREE.Vector3(1.5, -0.5, 0.3);

    const animate = () => {
      star.position.add(speed);

      if (star.position.x > 80 || star.position.y < 0) {
        this.scene.remove(star);
        return;
      }

      requestAnimationFrame(animate);
    };
    animate();
  }

  // Start periodic shooting stars
  startShootingStars(interval = 4000) {
    this._shootingStarInterval = setInterval(() => {
      this.fireShootingStar();
    }, interval);
  }

  stopShootingStars() {
    if (this._shootingStarInterval) {
      clearInterval(this._shootingStarInterval);
      this._shootingStarInterval = null;
    }
  }

  // Cat to McGonagall transformation
  async transformCatToMcGonagall(cat, mcgonagall, duration = 2000) {
    return new Promise((resolve) => {
      const catPos = cat.position.clone();

      // Create particle burst
      const particles = new THREE.Group();
      const particleCount = 30;
      const particleGeo = new THREE.SphereGeometry(0.05, 4, 4);
      const particleMat = new THREE.MeshBasicMaterial({ color: 0x88ff88 });

      for (let i = 0; i < particleCount; i++) {
        const p = new THREE.Mesh(particleGeo, particleMat.clone());
        p.position.copy(catPos);
        p.userData.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.05,
          Math.random() * 0.05,
          (Math.random() - 0.5) * 0.05
        );
        particles.add(p);
      }
      this.scene.add(particles);

      // Phase 1: Cat fades, particles expand
      const startTime = performance.now();

      const animateTransform = () => {
        const elapsed = performance.now() - startTime;
        const t = Math.min(elapsed / duration, 1);

        // Particles expand outward then contract
        particles.children.forEach(p => {
          p.position.add(p.userData.velocity);
          if (t > 0.5) {
            // Contract towards McGonagall position
            const target = catPos.clone();
            target.y += 1;
            p.position.lerp(target, (t - 0.5) * 0.1);
          }
          p.material.opacity = 1 - t;
        });

        // Cat fades out
        if (t < 0.4) {
          cat.traverse(child => {
            if (child.isMesh) {
              child.material.transparent = true;
              child.material.opacity = 1 - (t / 0.4);
            }
          });
        } else if (t >= 0.4 && cat.visible) {
          cat.visible = false;
          // Show McGonagall
          mcgonagall.position.copy(catPos);
          mcgonagall.visible = true;
          mcgonagall.traverse(child => {
            if (child.isMesh) {
              child.material.transparent = true;
              child.material.opacity = 0;
            }
          });
        }

        // McGonagall fades in
        if (t > 0.5) {
          mcgonagall.traverse(child => {
            if (child.isMesh) {
              child.material.opacity = (t - 0.5) * 2;
            }
          });
        }

        if (t < 1) {
          requestAnimationFrame(animateTransform);
        } else {
          // Cleanup
          this.scene.remove(particles);
          mcgonagall.traverse(child => {
            if (child.isMesh) {
              child.material.transparent = false;
              child.material.opacity = 1;
            }
          });
          resolve();
        }
      };

      animateTransform();
    });
  }

  // Dumbledore apparition (fade in from thin air)
  async apparateDumbledore(dumbledore, position, duration = 1500) {
    return new Promise((resolve) => {
      dumbledore.position.copy(position);
      dumbledore.visible = true;

      // Start fully transparent
      dumbledore.traverse(child => {
        if (child.isMesh) {
          child.material.transparent = true;
          child.material.opacity = 0;
        }
      });

      // Shimmer/distortion particles
      const shimmer = new THREE.Group();
      for (let i = 0; i < 20; i++) {
        const geo = new THREE.SphereGeometry(0.03, 4, 4);
        const mat = new THREE.MeshBasicMaterial({ color: 0xaabbff, transparent: true, opacity: 0.6 });
        const p = new THREE.Mesh(geo, mat);
        p.position.set(
          position.x + (Math.random() - 0.5) * 1,
          position.y + Math.random() * 3,
          position.z + (Math.random() - 0.5) * 1
        );
        p.userData.baseY = p.position.y;
        shimmer.add(p);
      }
      this.scene.add(shimmer);

      const startTime = performance.now();
      const animate = () => {
        const elapsed = performance.now() - startTime;
        const t = Math.min(elapsed / duration, 1);

        // Fade in Dumbledore
        dumbledore.traverse(child => {
          if (child.isMesh) {
            child.material.opacity = t;
          }
        });

        // Animate shimmer particles
        shimmer.children.forEach((p, i) => {
          p.position.y = p.userData.baseY + Math.sin(elapsed * 0.005 + i) * 0.2;
          p.material.opacity = 0.6 * (1 - t);
        });

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          this.scene.remove(shimmer);
          dumbledore.traverse(child => {
            if (child.isMesh) {
              child.material.transparent = false;
              child.material.opacity = 1;
            }
          });
          resolve();
        }
      };
      animate();
    });
  }

  // Put-Outer light orb effect (ball of light from lamp to Put-Outer)
  async putOuterEffect(lampPosition, putOuterPosition, duration = 800) {
    return new Promise((resolve) => {
      const orb = new THREE.Group();
      const orbGeo = new THREE.SphereGeometry(0.15, 8, 8);
      const orbMat = new THREE.MeshBasicMaterial({ color: 0xffdd88 });
      const orbMesh = new THREE.Mesh(orbGeo, orbMat);
      orb.add(orbMesh);

      const orbLight = new THREE.PointLight(0xffdd88, 1, 8);
      orb.add(orbLight);

      orb.position.copy(lampPosition);
      this.scene.add(orb);

      const startTime = performance.now();
      const startPos = lampPosition.clone();
      const endPos = putOuterPosition.clone();

      const animate = () => {
        const elapsed = performance.now() - startTime;
        const t = Math.min(elapsed / duration, 1);

        // Arc trajectory
        const arcHeight = 2;
        orb.position.lerpVectors(startPos, endPos, t);
        orb.position.y += Math.sin(t * Math.PI) * arcHeight;

        // Shrink as it reaches destination
        const scale = 1 - t * 0.5;
        orbMesh.scale.setScalar(scale);
        orbLight.intensity = 1 - t;

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          this.scene.remove(orb);
          resolve();
        }
      };
      animate();
    });
  }

  // Flying motorcycle entrance
  async motorcycleEntrance(motorcycle, hagrid, landingPos, duration = 5000) {
    return new Promise((resolve) => {
      // Start far away and high
      const startPos = new THREE.Vector3(landingPos.x + 80, 40, landingPos.z - 60);
      motorcycle.position.copy(startPos);
      motorcycle.visible = true;
      if (hagrid) {
        hagrid.visible = true;
      }

      // Headlight
      const headlight = new THREE.SpotLight(0xffffaa, 3, 50, 0.4);
      headlight.position.copy(startPos);
      headlight.target.position.copy(landingPos);
      this.scene.add(headlight);
      this.scene.add(headlight.target);

      const startTime = performance.now();

      const animate = () => {
        const elapsed = performance.now() - startTime;
        const t = Math.min(elapsed / duration, 1);

        // Smooth descent
        const eased = this._easeInOutCubic(t);
        motorcycle.position.lerpVectors(startPos, landingPos, eased);

        // Tilt during descent
        motorcycle.rotation.x = -0.2 * (1 - eased);
        motorcycle.rotation.z = Math.sin(elapsed * 0.002) * 0.05 * (1 - eased);

        // Hagrid rides on motorcycle
        if (hagrid) {
          hagrid.position.copy(motorcycle.position);
          hagrid.position.y += 1;
        }

        // Update headlight
        headlight.position.copy(motorcycle.position);

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          this.scene.remove(headlight);
          this.scene.remove(headlight.target);
          motorcycle.rotation.set(0, 0, 0);
          if (hagrid) {
            hagrid.position.copy(landingPos);
            hagrid.position.x += 1;
            hagrid.position.y = 0;
          }
          resolve();
        }
      };
      animate();
    });
  }

  // Motorcycle departure (flying away)
  async motorcycleDeparture(motorcycle, rider, duration = 4000) {
    return new Promise((resolve) => {
      const startPos = motorcycle.position.clone();
      const endPos = new THREE.Vector3(startPos.x - 80, 50, startPos.z + 60);

      const startTime = performance.now();
      const animate = () => {
        const elapsed = performance.now() - startTime;
        const t = Math.min(elapsed / duration, 1);

        const eased = this._easeInCubic(t);
        motorcycle.position.lerpVectors(startPos, endPos, eased);

        if (rider) {
          rider.position.copy(motorcycle.position);
          rider.position.y += 1;
        }

        motorcycle.rotation.x = 0.15 * eased;

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          motorcycle.visible = false;
          if (rider) rider.visible = false;
          resolve();
        }
      };
      animate();
    });
  }

  // Dumbledore disappearance
  async disappearDumbledore(dumbledore, duration = 1000) {
    return new Promise((resolve) => {
      const startTime = performance.now();
      const animate = () => {
        const elapsed = performance.now() - startTime;
        const t = Math.min(elapsed / duration, 1);

        dumbledore.traverse(child => {
          if (child.isMesh) {
            child.material.transparent = true;
            child.material.opacity = 1 - t;
          }
        });

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          dumbledore.visible = false;
          resolve();
        }
      };
      animate();
    });
  }

  _easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  _easeInCubic(t) {
    return t * t * t;
  }

  // Update all active effects
  update(deltaTime) {
    this.updateOwls(deltaTime);
  }

  // Clean up all effects
  cleanup() {
    this.removeOwls();
    this.stopShootingStars();
  }
}
