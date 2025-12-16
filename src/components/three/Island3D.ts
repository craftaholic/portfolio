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
  private isDragging = false;
  private previousMouse = { x: 0, y: 0 };
  private targetRotation = { x: 0, y: 0 };
  private currentRotation = { x: 0, y: 0 };
  private animationFrameId: number | null = null;

  constructor(container: HTMLElement, options: Island3DOptions = {}) {
    // Scene setup
    this.scene = new THREE.Scene();

    // Camera setup
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.set(0, 2, 6);
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
      '/assets/model/voxel_cat_3d.glb',
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
        const scale = 4.2 / maxDim;
        this.model.scale.setScalar(scale);

        // Enable shadows for all meshes
        this.model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        this.scene.add(this.model);

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
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    // Main directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    // Hemisphere light for better color
    const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x545454, 0.5);
    this.scene.add(hemisphereLight);
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
      const deltaY = y - this.previousMouse.y;

      this.targetRotation.y += deltaX * 0.01;
      this.targetRotation.x += deltaY * 0.01;

      // Clamp vertical rotation
      this.targetRotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, this.targetRotation.x));

      this.previousMouse.x = x;
      this.previousMouse.y = y;
    }
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

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    // Smooth rotation interpolation
    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.1;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.1;

    // Apply rotation to model
    if (this.model) {
      this.model.rotation.x = this.currentRotation.x;
      this.model.rotation.y = this.currentRotation.y;
    }

    // Auto-rotate when not dragging
    if (!this.isDragging) {
      this.targetRotation.y += 0.003;
    }

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
