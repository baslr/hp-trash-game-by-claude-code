// camera.js – Cinematic + Free camera system
import * as THREE from 'three';

export class CameraController {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;

    // Orbit parameters
    this.target = new THREE.Vector3(0, 2, 0);
    this.spherical = new THREE.Spherical(15, Math.PI / 3, 0);
    this.minDistance = 5;
    this.maxDistance = 40;
    this.minPolarAngle = 0.2;
    this.maxPolarAngle = Math.PI / 2 - 0.05;

    // Mouse interaction
    this.isMouseDown = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.rotateSpeed = 0.003;

    // Cinematic animation
    this.animating = false;
    this.animationStart = null;
    this.animationDuration = 2000;
    this.startPosition = new THREE.Vector3();
    this.endPosition = new THREE.Vector3();
    this.startTarget = new THREE.Vector3();
    this.endTarget = new THREE.Vector3();
    this.startSpherical = new THREE.Spherical();
    this.endSpherical = new THREE.Spherical();
    this.onAnimationComplete = null;

    // Auto-rotate
    this.autoRotate = false;
    this.autoRotateSpeed = 0.001;

    this._bindEvents();
    this._updateCameraPosition();
  }

  _bindEvents() {
    this.domElement.addEventListener('mousedown', (e) => {
      if (e.button === 0 || e.button === 2) {
        this.isMouseDown = true;
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
      }
    });

    this.domElement.addEventListener('mousemove', (e) => {
      if (!this.isMouseDown || this.animating) return;
      const deltaX = e.clientX - this.mouseX;
      const deltaY = e.clientY - this.mouseY;
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      this.spherical.theta -= deltaX * this.rotateSpeed;
      this.spherical.phi -= deltaY * this.rotateSpeed;
      this.spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.spherical.phi));

      this._updateCameraPosition();
    });

    this.domElement.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });

    this.domElement.addEventListener('wheel', (e) => {
      if (this.animating) return;
      this.spherical.radius += e.deltaY * 0.01;
      this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius));
      this._updateCameraPosition();
    });

    // Touch support
    let touchStartX = 0, touchStartY = 0;
    this.domElement.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    });

    this.domElement.addEventListener('touchmove', (e) => {
      if (this.animating || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - touchStartX;
      const deltaY = e.touches[0].clientY - touchStartY;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;

      this.spherical.theta -= deltaX * this.rotateSpeed;
      this.spherical.phi -= deltaY * this.rotateSpeed;
      this.spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.spherical.phi));

      this._updateCameraPosition();
    });
  }

  _updateCameraPosition() {
    const offset = new THREE.Vector3();
    offset.setFromSpherical(this.spherical);
    this.camera.position.copy(this.target).add(offset);
    this.camera.lookAt(this.target);
  }

  // Animate camera to a new position/target
  animateTo(position, target, duration = 2000) {
    return new Promise((resolve) => {
      this.animating = true;
      this.animationStart = performance.now();
      this.animationDuration = duration;

      this.startPosition.copy(this.camera.position);
      this.endPosition.copy(position);
      this.startTarget.copy(this.target);
      this.endTarget.copy(target);

      this.onAnimationComplete = () => {
        // Update spherical from new position
        const offset = new THREE.Vector3().subVectors(this.camera.position, this.target);
        this.spherical.setFromVector3(offset);
        this.animating = false;
        resolve();
      };
    });
  }

  // Set camera instantly
  setPosition(position, target) {
    this.camera.position.copy(position);
    this.target.copy(target);
    this.camera.lookAt(this.target);

    const offset = new THREE.Vector3().subVectors(this.camera.position, this.target);
    this.spherical.setFromVector3(offset);
  }

  // Smooth easing
  _easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  update(deltaTime) {
    if (this.animating) {
      const elapsed = performance.now() - this.animationStart;
      let t = Math.min(elapsed / this.animationDuration, 1);
      t = this._easeInOutCubic(t);

      this.camera.position.lerpVectors(this.startPosition, this.endPosition, t);
      this.target.lerpVectors(this.startTarget, this.endTarget, t);
      this.camera.lookAt(this.target);

      if (t >= 1 && this.onAnimationComplete) {
        this.onAnimationComplete();
        this.onAnimationComplete = null;
      }
    } else if (this.autoRotate && !this.isMouseDown) {
      this.spherical.theta += this.autoRotateSpeed;
      this._updateCameraPosition();
    }
  }
}
