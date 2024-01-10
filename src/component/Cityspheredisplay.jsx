import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree, extend } from '@react-three/fiber';
import { Html, OrbitControls, Environment, useEnvironment, Sphere, useMatcapTexture } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three/examples/jsm/controls/OrbitControls';
// Webpackを使用してGLSLファイルをインポート
import vertexShaderSource from '../shader/vertexShader.glsl';
import fragmentShaderSource from '../shader/fragmentShader.glsl';
import { RGBELoader } from '//cdn.skypack.dev/three@0.131.1/examples/jsm/loaders/RGBELoader.js';
import PanoramaSphere from './Citysphere.jsx';
import PanoramaSphereBlend from './Citysphere-blend.jsx';

const Env = () => {
    const hdriURL = '../../public/poly_haven_studio_2k.hdr';
    const envMap = useEnvironment({
        files: hdriURL,
    })

    return (
        <>
            <Environment map={envMap} background={false} />
        </>
    )
}

extend({ OrbitControlsImpl });

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
            <pointLight position={[0, 3, 0]} intensity={80} color={"red"} />
            <PanoramaSphereBlend imagePath="./public/city1.png" initialPosition={[0, 0, 0]} cityName="表参道" url="/city1" setTarget={setTarget} />
            <PanoramaSphere imagePath="./public/city2.png" initialPosition={[2.5, 2, 0]} cityName="渋谷" url="/city2" setTarget={setTarget} />
            <PanoramaSphere imagePath="./public/city3.png" initialPosition={[-2.5, 2, 0]} cityName="恵比寿 " url="/city3" setTarget={setTarget} />
            <AnimatedCamera target={targetPosition} />
            <Env />
        </Canvas>
    );
};

export default CitySphere;
