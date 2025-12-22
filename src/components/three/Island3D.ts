import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export interface Island3DOptions {
  onLoad?: () => void;
}

export class Island3D {
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private model: THREE.Group | null = null;
  private groundPlane: THREE.Mesh | null = null;
  private animationFrameId: number | null = null;
  private container: HTMLElement;
  private isMobile: boolean;

  // Spin-in animation state
  private frame = 0;
  private readonly spinInFrames = 120;

  constructor(container: HTMLElement, options: Island3DOptions = {}) {
    this.container = container;

    // Detect mobile device
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Scene setup
    this.scene = new THREE.Scene();

    // OrthographicCamera setup (like craftz.dog)
    const { camera, scale } = this.createCamera(container);
    this.camera = camera;

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = this.isMobile ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap;

    // Hide canvas initially
    this.renderer.domElement.style.opacity = '0';
    this.renderer.domElement.style.transition = 'opacity 0.3s ease-in';
    container.appendChild(this.renderer.domElement);

    // OrbitControls setup
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 1.5;
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 0, 0);

    // Lighting
    this.setupLighting();

    // Load model
    this.loadModel(options.onLoad);

    // Start animation
    this.animate();

    // Handle resize
    window.addEventListener('resize', this.onResize);
  }

  private createCamera(container: HTMLElement): { camera: THREE.OrthographicCamera; scale: number } {
    const w = container.clientWidth;
    const h = container.clientHeight;
    // Dynamic scale based on height (similar to craftz.dog)
    const scale = h * 0.005 + 4.8;
    const camera = new THREE.OrthographicCamera(
      -scale * (w / h),
      scale * (w / h),
      scale,
      -scale,
      0.01,
      50000
    );
    camera.position.set(8, 5, 8);
    camera.lookAt(0, 0, 0);
    return { camera, scale };
  }

  private setupLighting(): void {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x222222, 0.3);
    this.scene.add(ambientLight);

    // Key light with shadows
    const keyLight = new THREE.DirectionalLight(0xfff8f0, 2.5);
    keyLight.position.set(4, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.camera.left = -10;
    keyLight.shadow.camera.right = 10;
    keyLight.shadow.camera.top = 10;
    keyLight.shadow.camera.bottom = -10;
    keyLight.shadow.mapSize.width = this.isMobile ? 1024 : 2048;
    keyLight.shadow.mapSize.height = this.isMobile ? 1024 : 2048;
    keyLight.shadow.bias = -0.0001;
    this.scene.add(keyLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-4, 4, -3);
    this.scene.add(fillLight);

    // Ground plane for shadows (will be repositioned when model loads)
    const groundGeometry = new THREE.PlaneGeometry(30, 30);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
    this.groundPlane = new THREE.Mesh(groundGeometry, groundMaterial);
    this.groundPlane.rotation.x = -Math.PI / 2;
    this.groundPlane.position.y = -2.5;
    this.groundPlane.receiveShadow = true;
    this.scene.add(this.groundPlane);
  }

  private loadModel(onLoad?: () => void): void {
    const loader = new GLTFLoader();

    loader.load(
      '/assets/model/voxel_3d.glb',
      (gltf) => {
        this.model = gltf.scene;

        // Center the model
        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        this.model.position.sub(center);

        // Scale to fit (smaller on mobile, even smaller on small phones)
        const maxDim = Math.max(size.x, size.y, size.z);
        const baseScale = (4.2 / maxDim) * 2.65;
        const isSmallPhone = window.innerWidth < 400;
        const scale = isSmallPhone ? baseScale * 0.7 : this.isMobile ? baseScale * 0.85 : baseScale;
        this.model.scale.setScalar(scale);

        // Enable shadows
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

        // Add lamp glow effect
        const lampGlow = new THREE.Mesh(
          new THREE.SphereGeometry(0.25, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0xffffcc })
        );
        lampGlow.position.set(3.4, 2.8, 2.6);
        this.model.add(lampGlow);

        const lampLight = new THREE.PointLight(0xffeeaa, 15, 12);
        lampLight.position.copy(lampGlow.position);
        this.model.add(lampLight);

        // Start spin-in animation
        this.frame = 0;

        // Show canvas
        this.renderer.domElement.style.opacity = '1';
        if (onLoad) onLoad();
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
        this.renderer.domElement.style.opacity = '1';
        if (onLoad) onLoad();
      }
    );
  }

  // Easing function (like craftz.dog - easeOutCirc)
  private easeOutCirc(x: number): number {
    return Math.sqrt(1 - Math.pow(x - 1, 2));
  }

  private onResize = (): void => {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;

    const scale = h * 0.005 + 4.8;
    this.camera.left = -scale * (w / h);
    this.camera.right = scale * (w / h);
    this.camera.top = scale;
    this.camera.bottom = -scale;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(w, h);
  };

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    // Spin-in animation (like craftz.dog - first 120 frames)
    if (this.frame < this.spinInFrames) {
      const rotSpeed = -this.easeOutCirc(this.frame / this.spinInFrames) * Math.PI * 20;
      this.camera.position.x = 8 * Math.cos(rotSpeed);
      this.camera.position.z = 8 * Math.sin(rotSpeed);
      this.camera.lookAt(0, 0, 0);
      this.frame++;
    } else {
      // After intro, let OrbitControls handle rotation
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  };

  public dispose(): void {
    window.removeEventListener('resize', this.onResize);
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.controls.dispose();
    this.renderer.dispose();
    this.scene.clear();
  }
}
