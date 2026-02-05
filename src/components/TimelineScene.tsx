import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    PerspectiveCamera,
    Text,
    Float,
    Sparkles,
} from '@react-three/drei';
import * as THREE from 'three';

const ERAS = [
    { year: '2003-2009', title: 'THE RISE', label: 'Manchester', color: '#ef4444' },
    { year: '2009-2018', title: 'THE ZENITH', label: 'Madrid', color: '#ffffff' },
    { year: '2018-2021', title: 'THE JOURNEY', label: 'Turin', color: '#ffffff' },
    { year: '2021-PRESENT', title: 'THE LEGACY', label: 'Riyadh', color: '#fb923c' },
];

function EraPanel({ data, position }: { data: typeof ERAS[0], position: [number, number, number] }) {
    const progressRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (progressRef.current) {
            progressRef.current.position.x = -2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
            <group position={position}>
                {/* Glass Panel */}
                <mesh>
                    <planeGeometry args={[5, 2.8]} />
                    <meshStandardMaterial
                        color="#111"
                        transparent
                        opacity={0.8}
                        roughness={0.1}
                        metalness={0.9}
                    />
                </mesh>

                {/* Subdued Background */}
                <mesh position={[0, 0, -0.05]}>
                    <planeGeometry args={[5, 2.8]} />
                    <meshBasicMaterial color="#050505" side={THREE.DoubleSide} />
                </mesh>

                {/* Diagonal Glowing Line */}
                <mesh
                    ref={progressRef}
                    rotation={[0, 0, Math.PI / 6]}
                    position={[-2, -1, 0.05]}
                >
                    <planeGeometry args={[0.05, 5]} />
                    <meshBasicMaterial color={data.color} transparent opacity={0.6} />
                </mesh>

                {/* Content */}
                <group position={[-2, 0.6, 0.1]}>
                    <Text
                        fontSize={0.18}
                        color={data.color}
                        anchorX="left"
                    >
                        {data.year}
                    </Text>
                    <Text
                        position={[0, -0.35, 0]}
                        fontSize={0.4}
                        color="white"
                        anchorX="left"
                    >
                        {data.title}
                    </Text>
                    <Text
                        position={[0, -0.65, 0]}
                        fontSize={0.12}
                        color="#666"
                        anchorX="left"
                        letterSpacing={0.2}
                    >
                        {data.label.toUpperCase()}
                    </Text>
                </group>

                {/* Border */}
                <mesh position={[0, 0, -0.01]}>
                    <planeGeometry args={[5.05, 2.85]} />
                    <meshBasicMaterial color={data.color} transparent opacity={0.1} wireframe />
                </mesh>
            </group>
        </Float>
    );
}

function SceneContent() {
    const scrollRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (scrollRef.current) {
            const t = (state.clock.elapsedTime * 0.15) % ERAS.length;
            scrollRef.current.position.z = t * 6;
            scrollRef.current.position.y = -t * 0.5;
        }
    });

    return (
        <group ref={scrollRef}>
            {ERAS.map((era, i) => (
                <EraPanel
                    key={i}
                    data={era}
                    position={[0, -i * 3, -i * 6]}
                />
            ))}
        </group>
    );
}

export default function TimelineScene() {
    return (
        <div className="relative w-full h-screen bg-black overflow-hidden border-t border-white/5">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10 pointer-events-none" />

            <Canvas
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
            >
                <color attach="background" args={['#000']} />
                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={35} />
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={50} />

                <SceneContent />

                <Sparkles count={40} scale={20} size={1} speed={0.1} color="#fff" opacity={0.1} />
                <fog attach="fog" args={['#000', 5, 25]} />
            </Canvas>

            <div className="absolute bottom-12 left-12 z-20">
                <p className="text-white/20 text-xs tracking-[0.5em] font-black uppercase">Cinematic Timeline</p>
            </div>
        </div>
    );
}
