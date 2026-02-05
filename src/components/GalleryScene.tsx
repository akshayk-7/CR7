import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    PerspectiveCamera,
    Float,
    Sparkles,
    Text,
    RoundedBox,
} from '@react-three/drei';
import * as THREE from 'three';

const PANEL_DATA = [
    {
        id: 1,
        title: 'THE BEGINNING',
        year: '2002',
        pos: [-5, 1, -5],
        rot: [0, 0.4, 0],
        size: [3, 4, 0.05],
        color: '#ef4444'
    },
    {
        id: 2,
        title: 'ASCENSION',
        year: '2008',
        pos: [-2.5, -0.8, -2],
        rot: [0, 0.2, 0],
        size: [4, 5.5, 0.05],
        color: '#ffffff'
    },
    {
        id: 3,
        title: 'DOMINANCE',
        year: '2014',
        pos: [0, 0, 1],
        rot: [0, 0, 0],
        size: [5, 7, 0.05],
        color: '#fbbf24',
        hero: true
    },
    {
        id: 4,
        title: 'IMMORTALITY',
        year: '2018',
        pos: [2.8, 0.6, -2],
        rot: [0, -0.2, 0],
        size: [4, 5.5, 0.05],
        color: '#3b82f6'
    },
    {
        id: 5,
        title: 'THE LEGACY',
        year: '2022',
        pos: [5.5, -1.2, -5],
        rot: [0, -0.4, 0],
        size: [3, 4, 0.05],
        color: '#f97316'
    },
];

function GalleryPanel({ data }: { data: typeof PANEL_DATA[0] }) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            const t = state.clock.elapsedTime * 0.4;
            // Slow cinematic drift
            groupRef.current.position.y += Math.sin(t + data.id) * 0.0005;
            groupRef.current.rotation.z = Math.sin(t * 0.5 + data.id) * 0.01;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
            <group
                ref={groupRef}
                position={new THREE.Vector3(...data.pos)}
                rotation={new THREE.Euler(...data.rot)}
            >
                {/* Main Premium Glass Panel */}
                <RoundedBox args={data.size as [number, number, number]} radius={0.1} smoothness={4}>
                    <meshStandardMaterial
                        color="#111"
                        transparent
                        opacity={0.85}
                        roughness={0.05}
                        metalness={0.9}
                    />
                </RoundedBox>

                {/* Inner Glow / Content Area */}
                <mesh position={[0, 0, 0.03]}>
                    <planeGeometry args={[data.size[0] - 0.1, data.size[1] - 0.1]} />
                    <meshBasicMaterial
                        color={data.color}
                        transparent
                        opacity={0.05}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>

                {/* Thin Glowing Border */}
                <RoundedBox
                    args={[data.size[0] + 0.02, data.size[1] + 0.02, 0.01] as [number, number, number]}
                    radius={0.1}
                    smoothness={4}
                    position={[0, 0, -0.01]}
                >
                    <meshBasicMaterial color={data.color} transparent opacity={0.2} wireframe />
                </RoundedBox>

                {/* Typography */}
                <group position={[0, -data.size[1] / 2 + 0.8, 0.06]}>
                    <Text
                        fontSize={0.1}
                        color={data.color}
                        anchorX="center"
                        letterSpacing={0.4}
                    >
                        {data.year}
                    </Text>
                    <Text
                        position={[0, -0.25, 0]}
                        fontSize={0.25}
                        color="white"
                        anchorX="center"
                        maxWidth={data.size[0] - 1}
                        textAlign="center"
                    >
                        {data.title}
                    </Text>
                </group>

                {/* Subtle Edge Light */}
                <pointLight position={[0, data.size[1] / 2, 0.5]} intensity={2} color={data.color} distance={4} />
            </group>
        </Float>
    );
}

function AtmosphericEffects() {
    return (
        <>
            <Sparkles count={150} scale={40} size={0.8} speed={0.2} opacity={0.2} color="#fff" />
            <fog attach="fog" args={['#000', 8, 30]} />

            {/* Background Gradient / Depth Haze */}
            <mesh position={[0, 0, -20]} scale={50}>
                <planeGeometry />
                <meshBasicMaterial color="#050505" />
            </mesh>
        </>
    );
}

function CameraRig() {
    useFrame((state) => {
        const t = state.clock.elapsedTime * 0.1;
        // Luxury documentary slow dolly move
        state.camera.position.x = Math.sin(t) * 3;
        state.camera.position.y = Math.cos(t * 0.5) * 1;
        state.camera.lookAt(0, 0, 0);
    });
    return null;
}

export default function GalleryScene() {
    return (
        <div className="relative w-full h-screen bg-black overflow-hidden section-gallery">
            {/* Custom Vignette Overlay */}
            <div className="absolute inset-0 bg-radial-[at_center] from-transparent via-transparent to-black/80 z-10 pointer-events-none" />

            <Canvas
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
                gl={{ antialias: true, stencil: false, depth: true }}
                camera={{ fov: 40 }}
            >
                <color attach="background" args={['#000']} />
                <PerspectiveCamera makeDefault position={[0, 0, 15]} />

                <ambientLight intensity={0.2} />
                <spotLight position={[0, 15, 10]} intensity={20} angle={0.5} penumbra={1} color="#ffffff" castShadow={false} />

                <group>
                    {PANEL_DATA.map((panel) => (
                        <GalleryPanel key={panel.id} data={panel} />
                    ))}
                </group>

                <AtmosphericEffects />
                <CameraRig />
            </Canvas>

            {/* Typography Decoration */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
                <p className="text-[10px] font-black tracking-[1.5em] text-white/10 uppercase italic">
                    The Cinematic Archives
                </p>
                <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-white/10 to-transparent mt-4 mx-auto" />
            </div>
        </div>
    );
}
