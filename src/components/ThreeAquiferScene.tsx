import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeAquiferSceneProps {
  scrollRatio: number; // 0.0 (surface) to 1.0 (deep bedrock)
  isDark?: boolean;
}

/**
 * High-performance, cinematic Three.js WebGL experience for Tripura Groundwater Intelligence.
 * Progressively transforms from surface terrain and atmospheric mist down into:
 * Top Soil -> Vadose Zone -> Glowing Water Table -> Translucent Crystal Aquifer -> Deep Tipam Bedrock.
 */
export const ThreeAquiferScene: React.FC<ThreeAquiferSceneProps> = ({ scrollRatio, isDark = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const targetScrollRatio = useRef(scrollRatio);
  const currentScrollRatio = useRef(scrollRatio);
  const particlesRef = useRef<THREE.Points | null>(null);
  const waterPlaneRef = useRef<THREE.Mesh | null>(null);
  const terrainMeshRef = useRef<THREE.Mesh | null>(null);
  const strataGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);

  // Sync prop changes into ref for smooth lerping inside requestAnimationFrame
  useEffect(() => {
    targetScrollRatio.current = scrollRatio;
  }, [scrollRatio]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    try {
      // 1. Scene setup
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Atmospheric fog: changes color with depth
      const initialFogColor = isDark ? 0x050c18 : 0x0a192f;
      scene.fog = new THREE.FogExp2(initialFogColor, 0.035);

      // 2. Camera setup
      const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        100
      );
      camera.position.set(0, 5, 14);
      cameraRef.current = camera;

      // 3. WebGL Renderer with performance optimizations
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // 4. Lighting
      const ambientLight = new THREE.AmbientLight(0x406080, 1.2);
      scene.add(ambientLight);

      const sunLight = new THREE.DirectionalLight(0xaaddff, 2.0);
      sunLight.position.set(5, 12, 8);
      scene.add(sunLight);

      const waterGlow = new THREE.PointLight(0x00e5ff, 2.5, 30);
      waterGlow.position.set(0, -3, 0);
      scene.add(waterGlow);

      // 5. Stylized Terrain (Surface of Tripura - Synclinal hills and valley)
      const terrainGeo = new THREE.PlaneGeometry(35, 35, 48, 48);
      const posAttr = terrainGeo.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const y = posAttr.getY(i);
        // Sinusoidal fold belt terrain resembling Tripura ridges
        const z = Math.sin(x * 0.25) * 1.5 + Math.cos(y * 0.2) * 1.2 + Math.sin((x + y) * 0.4) * 0.6;
        posAttr.setZ(i, z);
      }
      terrainGeo.computeVertexNormals();

      const terrainMat = new THREE.MeshStandardMaterial({
        color: isDark ? 0x0c2238 : 0x1a3a56,
        wireframe: false,
        roughness: 0.75,
        metalness: 0.15,
        flatShading: true,
      });

      const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
      terrainMesh.rotation.x = -Math.PI / 2.2;
      terrainMesh.position.set(0, 1.5, -4);
      scene.add(terrainMesh);
      terrainMeshRef.current = terrainMesh;

      // Subtle contour wireframe on top of terrain
      const wireframeMat = new THREE.MeshBasicMaterial({
        color: 0x00c8ff,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      });
      const wireframeMesh = new THREE.Mesh(terrainGeo, wireframeMat);
      wireframeMesh.rotation.x = -Math.PI / 2.2;
      wireframeMesh.position.set(0, 1.52, -4);
      scene.add(wireframeMesh);

      // 6. Subterranean Stratigraphic Layers (Soil, Vadose, Aquifer, Bedrock)
      const strataGroup = new THREE.Group();
      scene.add(strataGroup);
      strataGroupRef.current = strataGroup;

      // Stratum 1: Top Soil & Alluvium (Y: -0.5 to -3.0)
      const soilGeo = new THREE.CylinderGeometry(8, 8, 3.5, 32, 1, true);
      const soilMat = new THREE.MeshStandardMaterial({
        color: 0x2c1f17,
        roughness: 0.9,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.7,
      });
      const soilMesh = new THREE.Mesh(soilGeo, soilMat);
      soilMesh.position.set(0, -1.8, 0);
      strataGroup.add(soilMesh);

      // Stratum 2: Vadose Unsaturated Zone (Y: -3.0 to -6.5)
      const vadoseGeo = new THREE.CylinderGeometry(8.2, 8.2, 4.0, 32, 1, true);
      const vadoseMat = new THREE.MeshStandardMaterial({
        color: 0x3d2b1f,
        roughness: 0.85,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.75,
      });
      const vadoseMesh = new THREE.Mesh(vadoseGeo, vadoseMat);
      vadoseMesh.position.set(0, -5.5, 0);
      strataGroup.add(vadoseMesh);

      // Stratum 3: Water Table Surface (Glowing undulating cyan meniscus at Y: -7.5)
      const waterTableGeo = new THREE.CircleGeometry(8, 40);
      const waterTableMat = new THREE.MeshStandardMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.65,
        roughness: 0.1,
        metalness: 0.8,
        emissive: 0x004466,
      });
      const waterTableMesh = new THREE.Mesh(waterTableGeo, waterTableMat);
      waterTableMesh.rotation.x = -Math.PI / 2;
      waterTableMesh.position.set(0, -7.5, 0);
      strataGroup.add(waterTableMesh);
      waterPlaneRef.current = waterTableMesh;

      // Stratum 4: Saturated Aquifer Cavern Volume (Y: -7.5 to -15.0)
      const aquiferGeo = new THREE.CylinderGeometry(8.5, 8.5, 7.5, 32, 1, true);
      const aquiferMat = new THREE.MeshStandardMaterial({
        color: 0x052e42,
        roughness: 0.3,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.85,
      });
      const aquiferMesh = new THREE.Mesh(aquiferGeo, aquiferMat);
      aquiferMesh.position.set(0, -11.25, 0);
      strataGroup.add(aquiferMesh);

      // 7. Geological Particles (Rain on surface -> Moisture in vadose -> Flowing water bubbles in aquifer)
      const particleCount = 650;
      const particleGeo = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      const particleVelocities = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 16;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 22; // spanning from surface down to deep aquifer
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 16;

        particleVelocities[i * 3] = (Math.random() - 0.5) * 0.01;
        particleVelocities[i * 3 + 1] = -0.015 - Math.random() * 0.02; // downward percolation
        particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

      const particleMat = new THREE.PointsMaterial({
        color: 0x5ce1e6,
        size: 0.12,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
      });

      const particleSystem = new THREE.Points(particleGeo, particleMat);
      scene.add(particleSystem);
      particlesRef.current = particleSystem;

      // 8. Central Telemetry Well Borehole shaft indicator
      const boreholeGeo = new THREE.CylinderGeometry(0.12, 0.12, 18, 16);
      const boreholeMat = new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        emissive: 0x007799,
        transparent: true,
        opacity: 0.6,
        roughness: 0.2,
      });
      const borehole = new THREE.Mesh(boreholeGeo, boreholeMat);
      borehole.position.set(0, -6, 0);
      scene.add(borehole);

      // Perforated Screen segment indicator (lower 4m of well)
      const screenGeo = new THREE.CylinderGeometry(0.16, 0.16, 4, 16);
      const screenMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
      });
      const screenMesh = new THREE.Mesh(screenGeo, screenMat);
      screenMesh.position.set(0, -12, 0);
      scene.add(screenMesh);

      // 9. Resize handler
      const handleResize = () => {
        if (!container || !camera || !renderer) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener('resize', handleResize);

      // 10. Smooth Render Loop
      let clock = new THREE.Clock();

      const animate = () => {
        animationFrameId.current = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();

        // Smoothly interpolate scroll ratio for buttery camera movement
        currentScrollRatio.current += (targetScrollRatio.current - currentScrollRatio.current) * 0.08;
        const scroll = currentScrollRatio.current;

        // Camera trajectory: Moves smoothly from above ground (Y: 5.0) down into subterranean aquifer (Y: -13.0)
        // while tilting slightly to focus on geological strata
        const targetCamY = THREE.MathUtils.lerp(4.5, -13.5, scroll);
        const targetCamZ = THREE.MathUtils.lerp(12.5, 7.5, Math.sin(scroll * Math.PI));
        const targetCamX = Math.sin(elapsedTime * 0.15) * 0.8;

        camera.position.y = targetCamY;
        camera.position.z = Math.max(6.0, targetCamZ);
        camera.position.x = targetCamX;
        camera.lookAt(0, targetCamY - 1.2, 0);

        // Water Table undulation
        if (waterPlaneRef.current) {
          waterPlaneRef.current.position.y = -7.5 + Math.sin(elapsedTime * 1.5) * 0.08;
        }

        // Rotate terrain slowly for parallax depth
        if (terrainMeshRef.current) {
          terrainMeshRef.current.rotation.z = elapsedTime * 0.02;
        }

        // Animate particles (groundwater percolation & flow)
        if (particlesRef.current) {
          const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
          for (let i = 0; i < particleCount; i++) {
            positions[i * 3 + 1] += particleVelocities[i * 3 + 1];

            // If particle falls below deep aquifer, reset to surface
            if (positions[i * 3 + 1] < -18) {
              positions[i * 3 + 1] = 6;
              positions[i * 3] = (Math.random() - 0.5) * 16;
              positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
            }

            // In the aquifer zone (Y between -7.5 and -15), add lateral laminar flow
            if (positions[i * 3 + 1] < -7.5 && positions[i * 3 + 1] > -15) {
              positions[i * 3] += Math.sin(elapsedTime * 2 + i) * 0.008;
            }
          }
          particlesRef.current.geometry.attributes.position.needsUpdate = true;
        }

        // Adjust fog color with depth (sky blue -> subterranean deep marine cyan -> abyssal aquifer)
        if (scene.fog) {
          if (scroll < 0.25) {
            (scene.fog as THREE.FogExp2).color.setHex(isDark ? 0x050c18 : 0x08162b);
          } else if (scroll < 0.6) {
            (scene.fog as THREE.FogExp2).color.setHex(0x04192a);
          } else {
            (scene.fog as THREE.FogExp2).color.setHex(0x02111d);
          }
        }

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    } catch (err) {
      console.warn('WebGL initialization fallback:', err);
      setWebGlSupported(false);
    }
  }, [isDark]);

  if (!webGlSupported) {
    // Elegant CSS/Canvas fallback if WebGL is disabled
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050c18] via-[#041a2e] to-[#02111d]" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        opacity: 0.95,
        transition: 'opacity 0.6s ease',
      }}
    />
  );
};
