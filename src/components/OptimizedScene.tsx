import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    PerspectiveCamera,
    Text
} from '@react-three/drei';
import * as THREE from 'three';

function LowPolySubject() {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = state.clock.elapsedTime * 0.5;
            group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
        }
    });

    return (
        <group ref={group}>
            {/* Hexagonal "Player" abstraction */}
            <mesh>
                <cylinderGeometry args={[0.5, 0.8, 2, 6]} />
                <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 1.2, 0]}>
                <sphereGeometry args={[0.3, 8, 8]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[0, 0, 0.5]}>
                <boxGeometry args={[0.2, 0.4, 0.1]} />
                <meshBasicMaterial color="#fb923c" />
            </mesh>
        </group>
    );
}

function FloatingUI() {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            const children = group.current.children;
            children.forEach((child, i) => {
                child.position.y = Math.sin(state.clock.elapsedTime + i) * 0.5;
                child.rotation.x = Math.cos(state.clock.elapsedTime * 0.5 + i) * 0.2;
            });
        }
    });

    return (
        <group ref={group}>
            {[...Array(6)].map((_, i) => (
                <mesh key={i} position={[Math.cos(i) * 4, 0, Math.sin(i) * 4]}>
                    <boxGeometry args={[1, 0.6, 0.05]} />
                    <meshStandardMaterial color="#fff" transparent opacity={0.1} />
                </mesh>
            ))}
        </group>
    );
}

export default function OptimizedScene() {
    return (
        <div className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden border-t border-white/5">
            <div className="absolute top-10 right-10 z-20 text-right">
                <h2 className="text-xl font-bold tracking-widest text-white/20 uppercase">Core Performance</h2>
                <div className="h-[1px] w-full bg-white/10 mt-1" />
            </div>

            <Canvas shadows={false} gl={{ alpha: false, antialias: false }}>
                <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />

                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <pointLight position={[-5, -5, -5]} color="#db2777" intensity={0.5} />

                <LowPolySubject />
                <FloatingUI />

                <Text
                    position={[0, -2, 0]}
                    fontSize={0.5}
                    color="white"
                    fillOpacity={0.1}
                >
                    PERFORMANCE MODE
                </Text>

                {/* <Environment preset="city" /> */}
            </Canvas>
        </div>
    );
}
