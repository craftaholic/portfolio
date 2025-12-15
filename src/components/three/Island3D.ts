import * as THREE from 'three';

export interface Island3DOptions {
  onLoad?: () => void;
}

export class Island3D {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private island: THREE.Group;
  private isDragging = false;
  private previousMouse = { x: 0, y: 0 };
  private targetRotation = { x: 0.2, y: 0 };
  private currentRotation = { x: 0.2, y: 0 };
  private animationFrameId: number | null = null;

  constructor(container: HTMLElement, options: Island3DOptions = {}) {
    // Scene setup
    this.scene = new THREE.Scene();

    // Camera setup
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.set(0, 3, 8);
    this.camera.lookAt(0, 0, 0);

    // Renderer setup with transparent background
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // Create placeholder island
    this.island = this.createPlaceholderIsland();
    this.scene.add(this.island);

    // Lighting
    this.setupLighting();

    // Event listeners
    this.setupEventListeners(container);

    // Start animation
    this.animate();

    // Handle resize
    window.addEventListener('resize', () => this.onResize(container));

    // Call onLoad callback after first render
    if (options.onLoad) {
      requestAnimationFrame(() => {
        options.onLoad!();
      });
    }
  }

  private createPlaceholderIsland(): THREE.Group {
    const group = new THREE.Group();

    // Low-poly color palette
    const colors = {
      water: 0x4a90e2,
      sand: 0xe8d4a2,
      grass: 0x7ec850,
      tree: 0x4a7c59,
      trunk: 0x8b5a3c,
      rock: 0x8b8680,
    };

    // Water base (octagon for low-poly look)
    const waterGeometry = new THREE.CylinderGeometry(3, 3, 0.3, 8);
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: colors.water,
      flatShading: true,
      roughness: 0.5,
      metalness: 0.2,
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.position.y = -0.5;
    water.receiveShadow = true;
    group.add(water);

    // Sand layer
    const sandGeometry = new THREE.CylinderGeometry(2.2, 2.5, 0.8, 8);
    const sandMaterial = new THREE.MeshStandardMaterial({
      color: colors.sand,
      flatShading: true,
    });
    const sand = new THREE.Mesh(sandGeometry, sandMaterial);
    sand.position.y = 0;
    sand.castShadow = true;
    sand.receiveShadow = true;
    group.add(sand);

    // Grass layer
    const grassGeometry = new THREE.CylinderGeometry(1.8, 2, 1, 8);
    const grassMaterial = new THREE.MeshStandardMaterial({
      color: colors.grass,
      flatShading: true,
    });
    const grass = new THREE.Mesh(grassGeometry, grassMaterial);
    grass.position.y = 0.7;
    grass.castShadow = true;
    grass.receiveShadow = true;
    group.add(grass);

    // Add trees
    const treePositions = [
      { x: 0, z: 0, scale: 0.8 },
      { x: 0.8, z: 0.5, scale: 0.6 },
      { x: -0.6, z: 0.7, scale: 0.7 },
      { x: 0.5, z: -0.8, scale: 0.5 },
    ];

    treePositions.forEach((pos) => {
      const tree = this.createTree(colors.tree, colors.trunk);
      tree.position.set(pos.x, 1.2, pos.z);
      tree.scale.setScalar(pos.scale);
      group.add(tree);
    });

    // Add some rocks
    const rockPositions = [
      { x: 1.5, y: 0.2, z: 1.2, scale: 0.3 },
      { x: -1.3, y: 0.3, z: -1.5, scale: 0.25 },
    ];

    rockPositions.forEach((pos) => {
      const rock = this.createRock(colors.rock);
      rock.position.set(pos.x, pos.y, pos.z);
      rock.scale.setScalar(pos.scale);
      group.add(rock);
    });

    return group;
  }

  private createTree(foliageColor: number, trunkColor: number): THREE.Group {
    const tree = new THREE.Group();

    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.15, 0.2, 1, 6);
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: trunkColor,
      flatShading: true,
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.castShadow = true;
    tree.add(trunk);

    // Foliage (low-poly cone)
    const foliageGeometry = new THREE.ConeGeometry(0.6, 1.2, 6);
    const foliageMaterial = new THREE.MeshStandardMaterial({
      color: foliageColor,
      flatShading: true,
    });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.y = 0.9;
    foliage.castShadow = true;
    tree.add(foliage);

    return tree;
  }

  private createRock(color: number): THREE.Mesh {
    // Irregular tetrahedron for rock
    const geometry = new THREE.TetrahedronGeometry(1, 0);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      flatShading: true,
      roughness: 0.9,
    });
    const rock = new THREE.Mesh(geometry, material);
    rock.castShadow = true;
    rock.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    return rock;
  }

  private setupLighting(): void {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Main directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
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
    const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x545454, 0.4);
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

    // Apply rotation to island
    this.island.rotation.x = this.currentRotation.x;
    this.island.rotation.y = this.currentRotation.y;

    // Auto-rotate when not dragging
    if (!this.isDragging) {
      this.targetRotation.y += 0.002;
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
