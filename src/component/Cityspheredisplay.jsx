import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree, extend } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three/examples/jsm/controls/OrbitControls';

extend({ OrbitControlsImpl });

const PanoramaSphere = ({ imagePath, initialPosition, cityName, url, setTarget }) => {
    const meshRef = useRef();
    const navigate = useNavigate();
    const texture = useLoader(THREE.TextureLoader, imagePath);

    // Configure texture settings
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = -1;

    const htmlPosition = [initialPosition[0], initialPosition[1] + 1.2, initialPosition[2]];

    useFrame(() => {
        meshRef.current.rotation.y += 0.001;
    });

    const handleClick = () => {
        setTarget(new THREE.Vector3(...initialPosition));
        setTimeout(() => navigate(url), 1000); // Navigate after camera starts moving
    };

    return (
        <>
            <mesh
                ref={meshRef}
                position={initialPosition}
                onClick={handleClick}
            >
                <sphereGeometry args={[0.8, 32, 32]} />
                <meshBasicMaterial map={texture} side={THREE.BackSide} />
            </mesh>
            <Html position={htmlPosition}>
                <div style={{ color: 'white', fontSize: '20px' }}>
                    {cityName}
                </div>
            </Html>
        </>
    );
};

const AnimatedCamera = ({ target }) => {
    const { camera, gl } = useThree();
    const controls = useRef();

    useFrame(() => {
        if (target) {
            camera.position.lerp(target, 0.05);
            controls.current.target.lerp(target, 0.05);
            controls.current.update();
        }
    });

    useEffect(() => {
        controls.current.saveState();
    }, []);

    return <OrbitControls ref={controls} args={[camera, gl.domElement]} />;
};

const CitySphere = () => {
    const [targetPosition, setTargetPosition] = useState(null);

    const setTarget = (position) => {
        setTargetPosition(position);
    };

    return (
        <Canvas style={{ backgroundColor: 'black' }}>
            <ambientLight />
            <PanoramaSphere imagePath="./public/city1.png" initialPosition={[0, 0, 0]} cityName="表参道" url="/city1" setTarget={setTarget} />
            <PanoramaSphere imagePath="./public/city2.png" initialPosition={[2.5, 2, 0]} cityName="渋谷" url="/city2" setTarget={setTarget} />
            <PanoramaSphere imagePath="./public/city3.png" initialPosition={[-2.5, 2, 0]} cityName="恵比寿 " url="/city3" setTarget={setTarget} />
            <AnimatedCamera target={targetPosition} />
        </Canvas>
    );
};

export default CitySphere;
