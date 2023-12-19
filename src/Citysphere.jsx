import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { View, OrbitControls, Html, useGLTF } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

const PanoramaSphere = ({ imagePath, position }) => {
    const meshRef = useRef();
    const navigate = useNavigate();
    const [scale, setScale] = useState(1);
    const texture = useLoader(THREE.TextureLoader, imagePath);

    // テクスチャ設定
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = -1;

    const handleScaleChange = (newScale) => {
        setScale(newScale);
        if (newScale > 5) {
            navigate('/other');
        }
    };

    // マウスホイールでのズーム調整
    const handleWheelZoom = (event) => {
        const zoomSpeed = 0.01; // ズームの速度調整用
        const newScale = Math.max(0.5, Math.min(7, scale - event.deltaY * zoomSpeed));
        setScale(newScale);
        handleScaleChange(newScale);
        console.log(newScale);
    };

    // マウスドラッグやタッチムーブでのズーム調整
    const lastPositionRef = useRef({ x: 0, y: 0 });
    const handlePointerMoveZoom = (event) => {
        if (event.buttons === 1 || event.touches) { // マウス左クリックまたはタッチがある場合
            const currentPosition = event.touches ? event.touches[0] : event;
            const dx = currentPosition.clientX - lastPositionRef.current.x;
            const dy = currentPosition.clientY - lastPositionRef.current.y;

            const distance = Math.sqrt(dx * dx + dy * dy);
            const zoomSpeed = 0.01; // ズームの速度調整用
            const newScale = Math.max(0.5, Math.min(6, scale + distance * zoomSpeed * (dy > 0 ? -1 : 1)));
            setScale(newScale);
            handleScaleChange(newScale);
            lastPositionRef.current = {
                x: currentPosition.clientX,
                y: currentPosition.clientY
            };
        }
    };

    // マウスまたはタッチが終了したら、最後の位置をリセット
    const handlePointerUp = () => {
        lastPositionRef.current = { x: 0, y: 0 };
    };

    useFrame(() => {
        meshRef.current.rotation.y += 0.001;
    });

    return (
        <>
            <mesh
                ref={meshRef}
                scale={[scale, scale, scale]}
                position={position}
                onWheel={handleWheelZoom}
                onPointerMove={handlePointerMoveZoom}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >
                <sphereGeometry args={[0.8, 32, 32]} />
                <meshBasicMaterial map={texture} side={THREE.BackSide} />
            </mesh>
            <Html position={[0, 1, 0]}>
                <div style={{ color: 'white', fontSize: '20px' }}>
                    羊華町
                </div>
            </Html>
        </>
    );
};


const CitySphere = () => {
    return (
        <Canvas style={{ backgroundColor: 'black' }}>
            <ambientLight />
            <PanoramaSphere imagePath="/images.jpg" position={[0, 0, 0]} />
            <PanoramaSphere imagePath="/images.jpg" position={[2.5, 2, 0]} />
            <PanoramaSphere imagePath="/images.jpg" position={[-2.5, 2, 0]} />
        </Canvas>
    );
};

export default CitySphere;
