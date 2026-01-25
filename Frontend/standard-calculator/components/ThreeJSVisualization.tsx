'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeJSVisualizationProps {
  result: number | null;
  operation: string | null;
}

const ThreeJSVisualization: React.FC<ThreeJSVisualizationProps> = ({ result, operation }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cubeRef = useRef<THREE.Mesh | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const torusRef = useRef<THREE.Mesh | null>(null);
  const animationRef = useRef<number>(0);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current!,
      antialias: true,
      alpha: true
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    // Create geometry based on operation
    let geometry: THREE.BufferGeometry;

    switch(operation) {
      case '+':
        geometry = new THREE.BoxGeometry(1, 1, 1);
        break;
      case '-':
        geometry = new THREE.TorusGeometry(0.8, 0.4, 16, 32);
        break;
      case '×':
        geometry = new THREE.SphereGeometry(0.8, 32, 32);
        break;
      case '÷':
        geometry = new THREE.ConeGeometry(0.8, 1.5, 32);
        break;
      default:
        geometry = new THREE.OctahedronGeometry(0.8);
    }

    // Material based on result value
    const material = new THREE.MeshPhysicalMaterial({
      color: result !== null && result >= 0
        ? new THREE.Color(0.5, 0.5, result > 10 ? 1 : 0.5 + Math.min(result/20, 0.5))
        : new THREE.Color(0.5, 0.5 - Math.abs(result || 0)/20, 0.5),
      metalness: 0.7,
      roughness: 0.3,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
    });

    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);

    // Position different shapes appropriately
    if (operation === '-') {
      // Torus should be rotated differently
      mesh.rotation.x = Math.PI / 4;
      torusRef.current = mesh;
    } else if (operation === '×') {
      sphereRef.current = mesh;
    } else if (operation === '÷') {
      mesh.rotation.x = Math.PI / 6;
      mesh.position.y = -0.25;
    } else {
      cubeRef.current = mesh;
    }

    scene.add(mesh);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-1, -1, -1);
    scene.add(pointLight);

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      if (mesh && sceneRef.current) {
        // Rotate based on result magnitude
        const rotationSpeed = result !== null ? Math.min(Math.abs(result) * 0.01, 0.1) : 0.02;

        mesh.rotation.x += rotationSpeed;
        mesh.rotation.y += rotationSpeed * 0.7;

        // Pulsing effect based on result
        if (result !== null) {
          const scale = 1 + Math.sin(Date.now() * 0.005) * 0.1 * Math.min(Math.abs(result) * 0.1, 0.5);
          mesh.scale.set(scale, scale, scale);
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        renderer.render(scene, camera);
      }
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      // Dispose of geometries and materials
      if (cubeRef.current?.geometry) cubeRef.current.geometry.dispose();
      if (sphereRef.current?.geometry) sphereRef.current.geometry.dispose();
      if (torusRef.current?.geometry) torusRef.current.geometry.dispose();
      if (cubeRef.current?.material) {
        if (Array.isArray(cubeRef.current.material)) {
          cubeRef.current.material.forEach(mat => (mat as THREE.Material).dispose());
        } else {
          (cubeRef.current.material as THREE.Material).dispose();
        }
      }
    };
  }, []);

  // Update material when result changes
  useEffect(() => {
    if (result !== null && cubeRef.current?.material && !Array.isArray(cubeRef.current.material)) {
      const material = cubeRef.current.material as THREE.MeshPhysicalMaterial;

      // Adjust color based on result
      const hue = result >= 0 ? 0.33 : 0; // Green for positive, red for negative
      const saturation = 0.8;
      const lightness = Math.min(0.7, 0.3 + Math.min(Math.abs(result) / 20, 0.4));

      material.color.setHSL(hue, saturation, lightness);

      // Adjust shininess based on result magnitude
      material.metalness = Math.min(0.9, 0.3 + Math.min(Math.abs(result) / 20, 0.6));
      material.roughness = Math.max(0.1, 0.5 - Math.min(Math.abs(result) / 30, 0.4));
    }
  }, [result]);

  return (
    <div
      ref={containerRef}
      className="w-full h-64 rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-gray-700 shadow-inner"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      {result !== null && (
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm font-mono backdrop-blur-sm">
          Result: {result}
        </div>
      )}
    </div>
  );
};

export default ThreeJSVisualization;