import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Simplified world map coordinates (latitude, longitude pairs for major landmasses)
const worldMapPoints = [
  // North America
  ...generateLandmassPoints(25, 50, -130, -60, 400),
  // South America
  ...generateLandmassPoints(-55, 10, -80, -35, 250),
  // Europe
  ...generateLandmassPoints(35, 70, -10, 40, 200),
  // Africa
  ...generateLandmassPoints(-35, 35, -20, 50, 350),
  // Asia
  ...generateLandmassPoints(10, 70, 60, 150, 500),
  // Australia
  ...generateLandmassPoints(-40, -10, 110, 155, 150),
  // India
  ...generateLandmassPoints(8, 35, 68, 97, 150),
];

function generateLandmassPoints(
  latMin: number,
  latMax: number,
  lonMin: number,
  lonMax: number,
  count: number
): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    const lat = latMin + Math.random() * (latMax - latMin);
    const lon = lonMin + Math.random() * (lonMax - lonMin);
    points.push([lat, lon]);
  }
  return points;
}

function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return new THREE.Vector3(x, y, z);
}

// Connection cities (major cities for connection points)
const connectionPoints = [
  { lat: 28.6139, lon: 77.209, name: 'Delhi' },
  { lat: 19.076, lon: 72.8777, name: 'Mumbai' },
  { lat: 51.5074, lon: -0.1278, name: 'London' },
  { lat: 40.7128, lon: -74.006, name: 'New York' },
  { lat: 35.6762, lon: 139.6503, name: 'Tokyo' },
  { lat: 1.3521, lon: 103.8198, name: 'Singapore' },
  { lat: -33.8688, lon: 151.2093, name: 'Sydney' },
  { lat: 55.7558, lon: 37.6173, name: 'Moscow' },
  { lat: 25.2048, lon: 55.2708, name: 'Dubai' },
  { lat: 22.3193, lon: 114.1694, name: 'Hong Kong' },
  { lat: 13.0827, lon: 80.2707, name: 'Chennai' },
  { lat: 12.9716, lon: 77.5946, name: 'Bangalore' },
];

// Create curved arc between two points
function createArc(start: THREE.Vector3, end: THREE.Vector3, segments: number = 50): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const distance = start.distanceTo(end);
  midPoint.normalize().multiplyScalar(2 + distance * 0.3);
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const point = new THREE.Vector3();
    
    // Quadratic bezier curve
    point.x = (1 - t) * (1 - t) * start.x + 2 * (1 - t) * t * midPoint.x + t * t * end.x;
    point.y = (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * midPoint.y + t * t * end.y;
    point.z = (1 - t) * (1 - t) * start.z + 2 * (1 - t) * t * midPoint.z + t * t * end.z;
    
    points.push(point);
  }
  
  return points;
}

const GlobePoints = () => {
  const globeRef = useRef<THREE.Group>(null);
  const arcRefs = useRef<THREE.Line[]>([]);
  
  // Create land mass points
  const landPoints = useMemo(() => {
    const points: number[] = [];
    worldMapPoints.forEach(([lat, lon]) => {
      const pos = latLonToVector3(lat, lon, 2.02);
      points.push(pos.x, pos.y, pos.z);
    });
    return new Float32Array(points);
  }, []);

  // Create city/connection node positions
  const cityPositions = useMemo(() => {
    return connectionPoints.map(city => latLonToVector3(city.lat, city.lon, 2.05));
  }, []);

  // Create connection arcs
  const arcs = useMemo(() => {
    const connections = [
      [0, 2], // Delhi - London
      [0, 3], // Delhi - New York
      [1, 5], // Mumbai - Singapore
      [0, 4], // Delhi - Tokyo
      [2, 3], // London - New York
      [4, 9], // Tokyo - Hong Kong
      [5, 6], // Singapore - Sydney
      [0, 8], // Delhi - Dubai
      [7, 2], // Moscow - London
      [10, 11], // Chennai - Bangalore
      [1, 8], // Mumbai - Dubai
      [0, 10], // Delhi - Chennai
    ];
    
    return connections.map(([startIdx, endIdx]) => {
      const arcPoints = createArc(cityPositions[startIdx], cityPositions[endIdx]);
      const positions = new Float32Array(arcPoints.length * 3);
      arcPoints.forEach((p, i) => {
        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;
      });
      return positions;
    });
  }, [cityPositions]);

  // Outer network nodes
  const outerNodes = useMemo(() => {
    const nodes: number[] = [];
    const numNodes = 80;
    
    for (let i = 0; i < numNodes; i++) {
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const radius = 2.6 + Math.random() * 0.6;
      
      const x = Math.cos(phi) * Math.sin(theta) * radius;
      const y = Math.sin(phi) * Math.sin(theta) * radius;
      const z = Math.cos(theta) * radius;
      
      nodes.push(x, y, z);
    }
    
    return new Float32Array(nodes);
  }, []);

  // Outer connection lines
  const outerLines = useMemo(() => {
    const lines: number[] = [];
    const numLines = 40;
    
    for (let i = 0; i < numLines; i++) {
      const phi1 = Math.random() * Math.PI * 2;
      const theta1 = Math.random() * Math.PI;
      const r1 = 2.1 + Math.random() * 0.3;
      
      const phi2 = phi1 + (Math.random() - 0.5) * 0.8;
      const theta2 = theta1 + (Math.random() - 0.5) * 0.8;
      const r2 = 2.6 + Math.random() * 0.5;
      
      lines.push(
        Math.cos(phi1) * Math.sin(theta1) * r1,
        Math.sin(phi1) * Math.sin(theta1) * r1,
        Math.cos(theta1) * r1,
        Math.cos(phi2) * Math.sin(theta2) * r2,
        Math.sin(phi2) * Math.sin(theta2) * r2,
        Math.cos(theta2) * r2
      );
    }
    
    return new Float32Array(lines);
  }, []);

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Main globe wireframe */}
      <Sphere args={[2, 48, 48]}>
        <meshBasicMaterial
          color="#0066cc"
          wireframe
          transparent
          opacity={0.08}
        />
      </Sphere>
      
      {/* Inner glow sphere */}
      <Sphere args={[1.98, 32, 32]}>
        <meshBasicMaterial
          color="#001133"
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Land mass points */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={landPoints.length / 3}
            array={landPoints}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.025}
          color="#00d4ff"
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>

      {/* City nodes (larger, brighter) */}
      {cityPositions.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={1} />
        </mesh>
      ))}

      {/* City glow rings */}
      {cityPositions.map((pos, idx) => (
        <mesh key={`ring-${idx}`} position={pos}>
          <ringGeometry args={[0.05, 0.08, 16]} />
          <meshBasicMaterial 
            color="#00d4ff" 
            transparent 
            opacity={0.5} 
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Connection arcs */}
      {arcs.map((arcPositions, idx) => (
        <line key={`arc-${idx}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={arcPositions.length / 3}
              array={arcPositions}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#00ffaa"
            transparent
            opacity={0.6}
          />
        </line>
      ))}

      {/* Outer network nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={outerNodes.length / 3}
            array={outerNodes}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#00ffff"
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>

      {/* Outer connection lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={outerLines.length / 3}
            array={outerLines}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#0099ff"
          transparent
          opacity={0.25}
        />
      </lineSegments>
    </group>
  );
};

const DigitalGlobe: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[400px] lg:min-h-[500px]">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <GlobePoints />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
};

export default DigitalGlobe;
