import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls } from '@react-three/drei';

const TrashCanModel = () => {
    const { scene } = useGLTF('/gltf/TrashCan.gltf');

    return (
        <Canvas
            frameloop='demand'
            camera={{
                position: [0, 0.5, 0.9],
                rotation: [0, 0, 0]
            }}
            style={{ position: 'relative', }}
        >
            <OrbitControls 
                enablePan={false}
                enableZoom={false}
                enableRotate={true}
                enableDamping={true}
                autoRotate={true}
                autoRotateSpeed={1}
            />
            <directionalLight position={[0, 10, 0]} intensity={1} castShadow />
            <group position={[0, -0.6, 0]}> 
                <primitive object={scene} scale={1.05} receiveShadow castShadow /> 
            </group>
            <ambientLight intensity={0.5} />
            <Environment preset='city' />
        </Canvas>
    );
};

export default TrashCanModel;