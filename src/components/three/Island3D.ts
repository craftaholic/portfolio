import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export interface Island3DOptions {
  onLoad?: () => void;
}

export class Island3D {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private model: THREE.Group | null = null;
  private groundPlane: THREE.Mesh | null = null;
  private isDragging = false;
  private previousMouse = { x: 0, y: 0 };
  private animationFrameId: number | null = null;

  // Camera orbit parameters
  private cameraAngle = 0; // Current horizontal angle
  private targetCameraAngle = 0; // Target horizontal angle for smooth interpolation
  private readonly cameraRadius = 6.85; // Distance from center
  private readonly cameraElevation = (15 * Math.PI) / 180; // 15 degrees in radians

  // Spin-in animation state
  private spinInStartTime: number | null = null;
  private readonly spinInDuration = 2000; // Duration in ms
  private readonly spinInStartSpeed = 0.32; // Fast initial spin (4x faster)
  private readonly spinInEndSpeed = 0.003; // Normal auto-rotate speed

  constructor(container: HTMLElement, options: Island3DOptions = {}) {
    // Scene setup
    this.scene = new THREE.Scene();

    // Camera setup
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.updateCameraPosition();
    this.camera.lookAt(0, 0, 0);

    // Renderer setup with transparent background
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Hide canvas initially until model loads
    this.renderer.domElement.style.opacity = '0';
    container.appendChild(this.renderer.domElement);

    // Lighting
    this.setupLighting();

    // Load the GLB model
    this.loadModel(options.onLoad);

    // Event listeners
    this.setupEventListeners(container);

    // Start animation
    this.animate();

    // Handle resize
    window.addEventListener('resize', () => this.onResize(container));
  }

  private loadModel(onLoad?: () => void): void {
    const loader = new GLTFLoader();

    loader.load(
      '/assets/model/voxel_3d.glb',
      (gltf) => {
        this.model = gltf.scene;

        // Center and scale the model
        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Center the model
        this.model.position.sub(center);

        // Scale to fit nicely in view (adjust as needed)
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = (4.2 / maxDim) * 1.3; // Scaled by 30%
        this.model.scale.setScalar(scale);

        // Enable shadows for all meshes
        this.model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        this.scene.add(this.model);

        // Position ground plane at the bottom of the scaled model
        const scaledBox = new THREE.Box3().setFromObject(this.model);
        if (this.groundPlane) {
          this.groundPlane.position.y = scaledBox.min.y;
        }

        // Start spin-in animation
        this.spinInStartTime = performance.now();

        // Show canvas and call onLoad
        this.renderer.domElement.style.opacity = '1';
        if (onLoad) {
          onLoad();
        }
      },
      (progress) => {
        // Loading progress (optional)
        console.log('Loading model:', (progress.loaded / progress.total) * 100 + '%');
      },
      (error) => {
        console.error('Error loading model:', error);
        // Show canvas even on error
        this.renderer.domElement.style.opacity = '1';
        if (onLoad) {
          onLoad();
        }
      }
    );
  }

  private setupLighting(): void {
    // Ambient light - reduced for more contrast
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    // Main directional light (sun) - stronger for visible shadows
    const directionalLight = new THREE.DirectionalLight(0xfff5e6, 1.5);
    directionalLight.position.set(5, 12, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.bias = -0.0001;
    directionalLight.shadow.normalBias = 0.02;
    this.scene.add(directionalLight);

    // Fill light from opposite side - softer
    const fillLight = new THREE.DirectionalLight(0xe6f0ff, 0.4);
    fillLight.position.set(-5, 5, -5);
    this.scene.add(fillLight);

    // Hemisphere light for ambient color variation
    const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x545454, 0.3);
    this.scene.add(hemisphereLight);

    // Ground plane to receive shadows - will be repositioned when model loads
    const groundGeometry = new THREE.PlaneGeometry(30, 30);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
    this.groundPlane = new THREE.Mesh(groundGeometry, groundMaterial);
    this.groundPlane.rotation.x = -Math.PI / 2;
    this.groundPlane.position.y = -2.5;
    this.groundPlane.receiveShadow = true;
    this.scene.add(this.groundPlane);
  }

  private setupEventListeners(container: HTMLElement): void {
    // Mouse events
    container.addEventListener('mousedown', (e) => this.onPointerDown(e.clientX, e.clientY));
    container.addEventListener('mousemove', (e) => this.onPointerMove(e.clientX, e.clientY));
    container.addEventListener('mouseup', () => this.onPointerUp());
    container.addEventListener('mouseleave', () => this.onPointerUp());

    // Touch events
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        this.onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    container.addEventListener('touchend', () => this.onPointerUp());
  }

  private onPointerDown(x: number, y: number): void {
    this.isDragging = true;
    this.previousMouse.x = x;
    this.previousMouse.y = y;
  }

  private onPointerMove(x: number, y: number): void {
    if (this.isDragging) {
      const deltaX = x - this.previousMouse.x;

      // Adjust camera orbit angle based on horizontal drag
      this.targetCameraAngle -= deltaX * 0.01;

      this.previousMouse.x = x;
      this.previousMouse.y = y;
    }
  }

  private updateCameraPosition(): void {
    // Calculate camera position on a circular orbit at 25 degrees elevation
    const x = this.cameraRadius * Math.cos(this.cameraElevation) * Math.sin(this.cameraAngle);
    const y = this.cameraRadius * Math.sin(this.cameraElevation);
    const z = this.cameraRadius * Math.cos(this.cameraElevation) * Math.cos(this.cameraAngle);

    this.camera.position.set(x, y, z);
    // Look slightly below center to shift model up in view
    this.camera.lookAt(0, -1, 0);
  }

  private onPointerUp(): void {
    this.isDragging = false;
  }

  private onResize(container: HTMLElement): void {
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Easing function for spin-in animation (ease-out cubic)
   * Starts fast, slows down smoothly
   */
  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  /**
   * Get current rotation speed based on spin-in animation progress
   */
  private getRotationSpeed(): number {
    if (this.spinInStartTime === null) {
      return this.spinInEndSpeed;
    }

    const elapsed = performance.now() - this.spinInStartTime;
    const progress = Math.min(elapsed / this.spinInDuration, 1);

    // Use easing to smoothly transition from fast to slow
    const easedProgress = this.easeOutCubic(progress);

    // Interpolate between start and end speed
    const speed = this.spinInStartSpeed + (this.spinInEndSpeed - this.spinInStartSpeed) * easedProgress;

    // Clear start time when animation is complete
    if (progress >= 1) {
      this.spinInStartTime = null;
    }

    return speed;
  }

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    // Auto-rotate camera when not dragging (with spin-in effect)
    if (!this.isDragging) {
      this.targetCameraAngle += this.getRotationSpeed();
    }

    // Smooth camera angle interpolation
    this.cameraAngle += (this.targetCameraAngle - this.cameraAngle) * 0.1;

    // Update camera position on orbit
    this.updateCameraPosition();

    this.renderer.render(this.scene, this.camera);
  };

  public dispose(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.renderer.dispose();
    this.scene.clear();
  }
}
