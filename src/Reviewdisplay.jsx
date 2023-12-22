import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useLoader, useFrame, extend, useThree } from '@react-three/fiber';
import { View, OrbitControls, Html, useGLTF } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
import { useNavigate } from 'react-routernpm-dom';
import { TextureLoader, Mesh } from 'three';
import { dummyStores, predeterminedPositions, decoderouteJinguToGaien, decoderouteJinguToYotsuya } from './data';
import * as THREE from "three";

function ReviewSphere() {
    const ref = useRef();
    const [rotation, setRotation] = useState([0, 0, 0]);
    const [isDragging, setIsDragging] = useState(false);
    const lastTouch = useRef({ x: 0, y: 0 });

    const handleInteractionStart = (x, y) => {
        setIsDragging(true);
        lastTouch.current = { x, y };
    };

    const handleInteractionMove = (x, y) => {
        if (!isDragging) return;

        const dx = x - lastTouch.current.x;
        const dy = y - lastTouch.current.y;
        const newRotation = [
            rotation[0] + dy * 0.01,
            rotation[1] + dx * 0.01,
            rotation[2]
        ];

        setRotation(newRotation);
        lastTouch.current = { x, y };
    };

    const handleMouseDown = (event) => {
        handleInteractionStart(event.clientX, event.clientY);
    };

    const handleMouseMove = (event) => {
        handleInteractionMove(event.clientX, event.clientY);
    };

    const handleTouchStart = (event) => {
        event.preventDefault();
        const touch = event.touches[0];
        handleInteractionStart(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (event) => {
        event.preventDefault();
        const touch = event.touches[0];
        handleInteractionMove(touch.clientX, touch.clientY);
    };

    const handleInteractionEnd = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleInteractionEnd);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleInteractionEnd);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleInteractionEnd);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleInteractionEnd);
        };
    }, [isDragging, rotation]);

    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.set(...rotation);
        }
    });

    const texture = useLoader(TextureLoader, '/Earth.jpg');
    //const texture = useLoader(TextureLoader, '/images.jpg');

    return (
        <mesh position={[0, 0, 0]} renderOrder={1}
            ref={ref}
            onPointerDown={handleMouseDown}
            onTouchStart={handleTouchStart}>
            <sphereGeometry args={[0.8, 32, 32]} />
            <meshStandardMaterial map={texture} side={THREE.BackSide} />
        </mesh>
    );
}


function ReviewSphere2() {
    const ref = useRef();
    const [isDragging, setIsDragging] = useState(false);
    const lastTouch = useRef({ x: 0, y: 0 });

    const handleInteractionStart = (x, y) => {
        setIsDragging(true);
        lastTouch.current = { x, y };
    };

    const handleInteractionMove = (x, y) => {
        if (!isDragging) return;

        const dx = x - lastTouch.current.x;
        const dy = y - lastTouch.current.y;
        const rotationSpeed = 0.01;

        const quaternion = new Quaternion();
        quaternion.setFromAxisAngle(new Vector3(-dy, dx, 0).normalize(), Math.sqrt(dx * dx + dy * dy) * rotationSpeed);

        ref.current.quaternion.premultiply(quaternion);

        lastTouch.current = { x, y };
    };

    const handleMouseDown = (event) => {
        handleInteractionStart(event.clientX, event.clientY);
    };

    const handleMouseMove = (event) => {
        handleInteractionMove(event.clientX, event.clientY);
    };

    const handleTouchStart = (event) => {
        event.preventDefault();
        const touch = event.touches[0];
        handleInteractionStart(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (event) => {
        event.preventDefault();
        const touch = event.touches[0];
        handleInteractionMove(touch.clientX, touch.clientY);
    };

    const handleInteractionEnd = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleInteractionEnd);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleInteractionEnd);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleInteractionEnd);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleInteractionEnd);
        };
    }, []);

    const texture = useLoader(TextureLoader, '/Earth.jpg');

    return (
        <mesh
            position={[0, 0, 0]}
            renderOrder={1}
            ref={ref}
            onPointerDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            <sphereGeometry args={[0.8, 32, 32]} />
            <meshStandardMaterial map={texture} side={THREE.BackSide} />
        </mesh>
    );
}


function Review() {
    return (
        <Canvas style={{ background: 'black', height: '100vh' }}>
            <ambientLight intensity={2} />
            <pointLight position={[10, 10, 10]} />
            <ReviewSphere />
        </Canvas>
    );
}

export default Review;