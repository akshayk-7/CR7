import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    PerspectiveCamera,
    Text,
    Environment,
    Float,
    Sparkles
} from '@react-three/drei';
import * as THREE from 'three';

const LOOP_DURATION = 8; // seconds

/**
 * Large, semi-transparent silhouette of CR7.
 * Stylized as a "presence" behind the central number.
 */
function PresenceSilhouette() {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            const t = (state.clock.elapsedTime % LOOP_DURATION) / LOOP_DURATION;
            const angle = t * Math.PI * 2;
            // Micro parallax / slow drift
            group.current.position.y = Math.sin(angle) * 0.05 - 0.5;
            group.current.position.x = Math.cos(angle * 0.5) * 0.02;
        }
    });

    const silhouetteMaterial = useMemo(() => new THREE.MeshBasicMaterial({
        color: '#0a0a09', // Near black
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide
    }), []);

    return (
        <group ref={group} position={[0, -0.5, -4]} scale={3.5}>
            {/* Stylized head/neck side profile approximation */}
            <mesh position={[0.2, 1.8, 0]} material={silhouetteMaterial}>
                <sphereGeometry args={[0.3, 32, 32, 0, Math.PI]} />
            </mesh>
            {/* Broad shoulders/torso */}
            <mesh position={[0, 0.8, 0]} material={silhouetteMaterial}>
                <cylinderGeometry args={[0.6, 0.4, 1.8, 32]} />
            </mesh>
            {/* Arm in celebration pose (raised slightly) */}
            <mesh position={[-0.5, 1.4, 0]} rotation={[0, 0, Math.PI / 4]} material={silhouetteMaterial}>
                <capsuleGeometry args={[0.15, 0.8, 8, 16]} />
            </mesh>
        </group>
    );
}

function CentralGlow() {
    const glowRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (glowRef.current) {
            const pulse = (Math.sin(state.clock.elapsedTime * 0.8) + 1) / 2;
            glowRef.current.scale.setScalar(1 + pulse * 0.1);
            if (glowRef.current.material instanceof THREE.MeshBasicMaterial) {
                glowRef.current.material.opacity = 0.03 + pulse * 0.02;
            }
        }
    });

    return (
        <group position={[0, 0.5, -3]}>
            <mesh ref={glowRef}>
                <planeGeometry args={[15, 15]} />
                <meshBasicMaterial
                    color="#db2777"
                    transparent
                    opacity={0.04}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
            <pointLight intensity={10} distance={20} color="#fb923c" />
        </group>
    );
}

interface StatPanelProps {
    label: string;
    value: string;
    position: [number, number, number];
    angle: number;
    delay?: number;
}

function StatPanel({ label, value, position, angle, delay = 0 }: StatPanelProps) {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            const t = ((state.clock.elapsedTime + delay) % LOOP_DURATION) / LOOP_DURATION;
            const cycle = t * Math.PI * 2;
            // Anti-gravity float
            group.current.position.y = position[1] + Math.sin(cycle) * 0.12;
            group.current.rotation.z = angle + Math.sin(cycle * 0.5) * 0.02;
        }
    });

    return (
        <group ref={group} position={position} rotation={[0, angle, 0]}>
            {/* Glass Panel */}
            <mesh>
                <boxGeometry args={[1.8, 0.8, 0.05]} />
                <meshStandardMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.15} // Very subtle glass
                    roughness={0}
                    metalness={1}
                />
            </mesh>

            {/* Neon Edge Accent */}
            <mesh scale={[1.01, 1.01, 1]} position={[0, 0, 0.01]}>
                <boxGeometry args={[1.8, 0.8, 0.01]} />
                <meshBasicMaterial color="#db2777" transparent opacity={0.3} wireframe />
            </mesh>

            <Text
                position={[0, 0.15, 0.04]}
                fontSize={0.24}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                {value}
            </Text>
            <Text
                position={[0, -0.18, 0.04]}
                fontSize={0.09}
                color="#f97316"
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.15}
            >
                {label.toUpperCase()}
            </Text>
        </group>
    );
}

export default function HeroScene() {
    return (
        <div className="relative w-full h-screen overflow-hidden bg-black">
            {/* UI Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-10" />

            <Canvas
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
                gl={{ antialias: true, stencil: false, depth: true }}
                camera={{ position: [0, 0.5, 5], fov: 40 }}
            >
                <color attach="background" args={['#000']} />

                <ambientLight intensity={0.4} />
                <pointLight position={[0, 5, 5]} intensity={30} color="#fff" />
                <pointLight position={[0, -5, 5]} intensity={10} color="#db2777" />

                <Suspense fallback={null}>
                    <Environment preset="night" />
                </Suspense>

                {/* Main Subject silhouette */}
                <PresenceSilhouette />

                {/* Central Focus Glow */}
                <CentralGlow />

                {/* Large Background Number */}
                <Text
                    position={[0, 0.5, -4]}
                    fontSize={10}
                    color="#111"
                    anchorX="center"
                    anchorY="middle"
                    fillOpacity={0.8}
                >
                    7
                </Text>

                {/* Floating Stat Panels */}
                <group position={[0, 0.2, 0]}>
                    <StatPanel label="Goals" value="850+" position={[-2.8, 0.8, 0]} angle={0.2} delay={0} />
                    <StatPanel label="Matches" value="1200+" position={[-2.8, -0.4, 0]} angle={0.2} delay={2} />
                    <StatPanel label="Trophies" value="35" position={[2.8, 0.8, 0]} angle={-0.2} delay={4} />
                    <StatPanel label="Records" value="48" position={[2.8, -0.4, 0]} angle={-0.2} delay={6} />
                </group>

                <Sparkles count={40} scale={10} size={1} speed={0.2} opacity={0.3} color="#fff" />

                <fog attach="fog" args={['#000', 5, 15]} />
            </Canvas>

            {/* Typography Overlay */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center z-20 w-full px-4 group">
                <div className="relative inline-block">
                    <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 transition-all duration-1000 group-hover:tracking-normal group-hover:scale-105">
                        CR7 LEGEND
                    </h1>
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] animate-[shimmer_4s_infinite] pointer-events-none" />
                </div>

                <div className="flex items-center justify-center gap-6 mt-4">
                    <span className="h-[1px] w-16 bg-gradient-to-r from-transparent to-white/20" />
                    <p className="text-gray-500 text-[10px] md:text-xs tracking-[0.8em] uppercase font-bold">The Great Of All Time</p>
                    <span className="h-[1px] w-16 bg-gradient-to-l from-transparent to-white/20" />
                </div>
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-200%) skewX(-20deg); }
                    100% { transform: translateX(200%) skewX(-20deg); }
                }
            `}</style>
        </div>
    );
}
