import React, { useRef, useState, useEffect } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from "three";

function Sphere({ onTotalRotationChange }) {
    const ref = useRef();
    const [rotation, setRotation] = useState([0, 0, 0]);
    const [isDragging, setIsDragging] = useState(false);
    const [totalRotation, setTotalRotation] = useState([0, 0, 0]); // 総回転量を追跡する状態
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

        // 総回転量を更新
        setTotalRotation(prev => {
            const newTotalRotation = [
                prev[0] + dy * 0.01,
                prev[1] + dx * 0.01,
                prev[2]
            ];
            //updateBoxPositions(newTotalRotation); // ここで updateBoxPositions を呼び出す
            return newTotalRotation;
        });

        console.log(totalRotation);
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

    useEffect(() => {
        onTotalRotationChange(totalRotation);
    }, [totalRotation, onTotalRotationChange]);

    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.set(...rotation);
        }
    });

    const texture = useLoader(TextureLoader, '/Earth.jpg');
    //const texture = useLoader(TextureLoader, '/images.jpg');

    return (
        <mesh position={[0, -2.3, 0]} renderOrder={1}
            ref={ref}
            onPointerDown={handleMouseDown}
            onTouchStart={handleTouchStart}>
            <sphereGeometry args={[0.8, 32, 32]} />
            <meshStandardMaterial map={texture} side={THREE.BackSide} />
        </mesh>
    );
}

export default Sphere;