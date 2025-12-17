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
  private isMobile: boolean;

  // Camera orbit parameters
  private cameraAngle = 0; // Current horizontal angle
  private targetCameraAngle = 0; // Target horizontal angle for smooth interpolation
  private cameraElevation = (15 * Math.PI) / 180; // Current vertical angle in radians
  private targetCameraElevation = (15 * Math.PI) / 180; // Target vertical angle
  private readonly cameraRadius = 6.85; // Distance from center
  private readonly minElevation = (5 * Math.PI) / 180; // Minimum 5 degrees
  private readonly maxElevation = (60 * Math.PI) / 180; // Maximum 60 degrees

  // Spin-in animation state
  private spinInStartTime: number | null = null;
  private lastFrameTime: number = 0;
  private readonly spinInDuration = 1200; // Duration in ms
  private readonly spinInStartSpeed = 80; // Fast initial spin (radians per second)
  private readonly spinInEndSpeed = 0.36; // Normal auto-rotate speed (radians per second)

  constructor(container: HTMLElement, options: Island3DOptions = {}) {
    // Scene setup
    this.scene = new THREE.Scene();

    // Camera setup
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.updateCameraPosition();
    this.camera.lookAt(0, 0, 0);

    // Detect mobile device
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Renderer setup with transparent background
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isMobile, // Disable antialiasing on mobile for performance
      alpha: true,
      premultipliedAlpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    // Lower pixel ratio on mobile for smoother performance
    this.renderer.setPixelRatio(this.isMobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    // Use simpler shadow map on mobile
    this.renderer.shadowMap.type = this.isMobile ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap;

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

        // Enable shadows and find light objects to make them glow
        this.model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;

          }
        });

        this.scene.add(this.model);

        // Add a glowing lamp light - adjust position to match lamp location
        const lampGlow = new THREE.Mesh(
          new THREE.SphereGeometry(0.15, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0xffeeaa })
        );
        // Starting position - adjust these values to match the lamp
        lampGlow.position.set(3.4, 2.8, 2.6);
        this.model.add(lampGlow);

        // Add point light at lamp position for illumination effect
        const lampLight = new THREE.PointLight(0xffeeaa, 5, 8);
        lampLight.position.copy(lampGlow.position);
        this.model.add(lampLight);

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
      undefined,
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
    // Minimal ambient - dark room feel
    const ambientLight = new THREE.AmbientLight(0x222222, 0.2);
    this.scene.add(ambientLight);

    // Key light - main studio light, slightly warm white
    const keyLight = new THREE.DirectionalLight(0xfff8f0, 2.5);
    keyLight.position.set(4, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.camera.left = -10;
    keyLight.shadow.camera.right = 10;
    keyLight.shadow.camera.top = 10;
    keyLight.shadow.camera.bottom = -10;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    keyLight.shadow.normalBias = 0.02;
    this.scene.add(keyLight);

    // Fill light - very subtle, just to soften harsh shadows
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-4, 4, -3);
    this.scene.add(fillLight);

    // Rim/back light - subtle edge highlight
    const rimLight = new THREE.DirectionalLight(0xffeedd, 0.4);
    rimLight.position.set(0, 6, -8);
    this.scene.add(rimLight);

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
      if (e.touches.length === 1 && this.isDragging) {
        e.preventDefault(); // Prevent page scroll when interacting with 3D model
        this.onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false }); // Must be false to allow preventDefault

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
      const deltaY = y - this.previousMouse.y;

      // Adjust camera orbit angle based on horizontal drag
      this.targetCameraAngle -= deltaX * 0.01;

      // Adjust camera elevation based on vertical drag
      this.targetCameraElevation += deltaY * 0.01;
      // Clamp elevation between min and max
      this.targetCameraElevation = Math.max(this.minElevation, Math.min(this.maxElevation, this.targetCameraElevation));

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

    // Calculate delta time for frame-rate independent animation
    const currentTime = performance.now();
    const deltaTime = this.lastFrameTime ? (currentTime - this.lastFrameTime) / 1000 : 0.016;
    this.lastFrameTime = currentTime;

    // Auto-rotate camera when not dragging (with spin-in effect)
    if (!this.isDragging) {
      this.targetCameraAngle += this.getRotationSpeed() * deltaTime;
    }

    // Smooth camera angle interpolation (frame-rate independent)
    const lerpFactor = 1 - Math.pow(0.00001, deltaTime);
    this.cameraAngle += (this.targetCameraAngle - this.cameraAngle) * lerpFactor;
    this.cameraElevation += (this.targetCameraElevation - this.cameraElevation) * lerpFactor;

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
