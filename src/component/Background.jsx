import React, { useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from "three";

function BG() {
    const texture = useLoader(TextureLoader, './public/city1.png');
    //const texture = useLoader(TextureLoader, './public/city2.png');
    //const texture = useLoader(TextureLoader, './public/city3.png');
    const meshRef = useRef()
    // テクスチャ設定
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = -1;

    useFrame(() => {
        meshRef.current.rotation.y += 0.001;
    });
    const scale = 60;

    return (
        <mesh
            ref={meshRef}
            scale={[scale, scale, scale]}
            position={[0, 0, 0]}
        >
            <sphereGeometry args={[0.8, 32, 32]} />
            <meshStandardMaterial map={texture} side={THREE.BackSide} />
        </mesh>
    );
}

export default BG;