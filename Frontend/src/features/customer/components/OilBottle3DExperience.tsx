import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface OilBottle3DExperienceProps {
  onLoaded?: () => void;
}

export const OilBottle3DExperience: React.FC<OilBottle3DExperienceProps> = ({ onLoaded }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isOverHero, setIsOverHero] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Viewport Dimensions
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 4.3);

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting Suite
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.5);
    scene.add(ambientLight);

    // Warm Amber Key Light
    const keyLight = new THREE.DirectionalLight(0xf59e0b, 4.0);
    keyLight.position.set(3.5, 4.0, 3.5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Soft Golden Fill Light
    const fillLight = new THREE.DirectionalLight(0xd97706, 2.4);
    fillLight.position.set(-3.5, 2.0, 2.5);
    scene.add(fillLight);

    // High-Intensity Amber Rim Light
    const rimLight = new THREE.DirectionalLight(0xfbbf24, 5.5);
    rimLight.position.set(0, 3.0, -4.0);
    scene.add(rimLight);

    // Warm Ground Bounce Light
    const bounceLight = new THREE.PointLight(0x78350f, 2.8, 8);
    bounceLight.position.set(0, -2.5, 1.5);
    scene.add(bounceLight);

    // Dedicated Warm Background Aura Light for the oil bottle in catalog backdrop
    const auraLight = new THREE.PointLight(0xf59e0b, 4.0, 10);
    auraLight.position.set(0, 0, -2.5);
    scene.add(auraLight);

    // Amber Floating Viscosity Particles
    const particleCount = 85;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 6.5;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 6.0;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 4.0;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.05,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Model Container Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Load Oil_bottel.glb
    const loader = new GLTFLoader();
    let bottleMesh: THREE.Object3D | null = null;
    let baseModelScale = 1.0;

    loader.load(
      '/Oil_bottel.glb',
      (gltf) => {
        bottleMesh = gltf.scene;

        // Auto-center and normalize scale
        const box = new THREE.Box3().setFromObject(bottleMesh);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        baseModelScale = 2.45 / (maxDim || 1);
        bottleMesh.scale.setScalar(baseModelScale);

        // Center pivot offset
        bottleMesh.position.x = -center.x * baseModelScale;
        bottleMesh.position.y = -center.y * baseModelScale;
        bottleMesh.position.z = -center.z * baseModelScale;

        // Physical material enhancements
        bottleMesh.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = 0.28;
              mat.metalness = 0.42;
              mat.needsUpdate = true;
            }
          }
        });

        modelGroup.add(bottleMesh);
        setIsLoaded(true);
        if (onLoaded) onLoaded();
      },
      (xhr) => {
        if (xhr.total > 0) {
          setLoadProgress(Math.round((xhr.loaded / xhr.total) * 100));
        } else {
          const mb = xhr.loaded / (1024 * 1024);
          setLoadProgress(Math.min(95, Math.round((mb / 10.5) * 100)));
        }
      },
      (err) => {
        console.error('Error loading Oil_bottel.glb:', err);
        setLoadError('Failed to load 3D bottle model');
      }
    );

    // Scroll & Mouse Variables
    let scrollY = window.scrollY;
    let targetRotationY = 0;
    let targetRotationX = 0;
    let targetRotationZ = 0;

    let targetPosX = 0;
    let targetPosY = 0;
    let targetPosZ = 0;
    let targetScaleFactor = 1.0;

    let mouseX = 0;
    let mouseY = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let dragRotationOffset = 0;

    const handleScroll = () => {
      scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll));

      // Over hero detection
      setIsOverHero(scrollY < 650);

      // Continuous rotation as user scrolls through the page (tuned for smooth, calm showroom speed)
      const baseScrollAngle = scrollProgress * Math.PI * 1.8;
      targetRotationY = baseScrollAngle + dragRotationOffset;

      // Transition to Background when scrolling past hero into "Direct Lubricant Inventory"
      // Extended smooth transition matching extended scroll runway
      const catalogTransition = Math.min(1, Math.max(0, (scrollY - 150) / 600));

      // In Hero: Front-and-center (Z = 0, Y = 0)
      // In Catalog: Moves gracefully into the background (Z = -1.75), floating majestically behind the cards
      targetPosZ = -1.75 * catalogTransition;
      targetPosY = 0.05 * catalogTransition;
      targetPosX = 0; // Centered backdrop for maximum visibility behind products
      targetScaleFactor = 1.0 + catalogTransition * 0.65; // High presence in backdrop

      // Subtle dynamic tilt on X and Z during scroll
      targetRotationX = Math.sin(scrollProgress * Math.PI * 1.5) * 0.10;
      targetRotationZ = -Math.sin(scrollProgress * Math.PI) * 0.07;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / width) * 2 - 1;
      const normY = -(e.clientY / height) * 2 - 1;
      mouseX = normX * 0.22;
      mouseY = normY * 0.15;

      if (isDragging && scrollY < 650) {
        const deltaX = e.clientX - prevMouseX;
        dragRotationOffset += deltaX * 0.008;
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const scrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll));
        targetRotationY = scrollProgress * Math.PI * 1.8 + dragRotationOffset;
        prevMouseX = e.clientX;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (scrollY < 650) {
        isDragging = true;
        prevMouseX = e.clientX;
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    handleScroll();

    // 60FPS Lerp Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Organic idle floating wave
      const idleFloat = Math.sin(elapsedTime * 1.8) * 0.04;
      const finalPosY = targetPosY + idleFloat;

      // Position Lerp Damping (Transition into background)
      modelGroup.position.x += (targetPosX - modelGroup.position.x) * 0.07;
      modelGroup.position.y += (finalPosY - modelGroup.position.y) * 0.07;
      modelGroup.position.z += (targetPosZ - modelGroup.position.z) * 0.07;

      // Scale Lerp Damping
      const currentScale = modelGroup.scale.x;
      const newScale = currentScale + (targetScaleFactor - currentScale) * 0.07;
      modelGroup.scale.setScalar(newScale);

      // Continuous 360 Background Rotation:
      // When in catalog, bottle continuously rotates calmly and gently in the background
      const catalogTransition = Math.min(1, Math.max(0, (scrollY - 150) / 600));
      const bgSpin = catalogTransition * elapsedTime * 0.10;

      const finalTargetY = targetRotationY + bgSpin + (scrollY < 650 ? mouseX * 0.3 : 0);
      const finalTargetX = targetRotationX - (scrollY < 650 ? mouseY * 0.2 : 0);

      modelGroup.rotation.y += (finalTargetY - modelGroup.rotation.y) * 0.05;
      modelGroup.rotation.x += (finalTargetX - modelGroup.rotation.x) * 0.05;
      modelGroup.rotation.z += (targetRotationZ - modelGroup.rotation.z) * 0.05;

      // Aura light follows the bottle in 3D space with warm pulsing glow
      auraLight.position.set(modelGroup.position.x, modelGroup.position.y, modelGroup.position.z - 0.7);
      auraLight.intensity = 3.2 + Math.sin(elapsedTime * 2.2) * 1.0;

      // Particles orbit and slow drift
      particles.rotation.y = elapsedTime * 0.04;
      particles.rotation.x = Math.sin(elapsedTime * 0.03) * 0.04;

      // Pulsing rim backlight
      rimLight.intensity = 5.0 + Math.sin(elapsedTime * 2.5) * 1.0;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);

      scene.clear();
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onLoaded]);

  return (
    <>
      {/* FIXED 3D BACKGROUND CANVAS */}
      <div
        ref={mountRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 2,
          pointerEvents: isOverHero ? 'auto' : 'none',
          cursor: isOverHero ? 'grab' : 'default',
        }}
      />

      {/* Loading Overlay */}
      {!isLoaded && !loadError && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            zIndex: 100,
            backgroundColor: 'rgba(7, 8, 11, 0.85)',
            backdropFilter: 'blur(10px)',
            padding: '2rem 3rem',
            borderRadius: '20px',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: '3px solid rgba(245, 158, 11, 0.2)',
              borderTopColor: '#F59E0B',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F59E0B', letterSpacing: '0.12em' }}>
              INITIALIZING 3D ENGINE OIL VESSEL
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>
              Streaming Oil_bottel.glb ({loadProgress}%)
            </div>
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {loadError && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            color: '#F87171',
            fontSize: '0.85rem',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
          }}
        >
          {loadError}
        </div>
      )}
    </>
  );
};

export default OilBottle3DExperience;
