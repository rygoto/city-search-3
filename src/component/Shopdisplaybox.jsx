import React, { useState, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
import { TextureLoader } from 'three';

function Box({ position, animatedPosition, store, onOpenUrl }) {
    const texture = useLoader(TextureLoader, store.texture);
    const [showHtml, setShowHtml] = useState(true);

    useEffect(() => {
        const threshold = 0;
        const threshold2 = -0.5;
        if (position[2] > threshold || position[2] < threshold2) {
            setShowHtml(false);
        } else {
            setShowHtml(true);
        }
    }, [position]);

    const openUrl = () => {
        onOpenUrl(store.url);
        //window.open(store.url, '_blank');
        //openUrlInHalf(store.url);
        console.log(store.distance + 'm');
        console.log(store.priceRange);
        console.log(store.review);
        console.log(store.url);
        console.log(store.score);
        console.log(store.name);
    };

    const animatedProps = useSpring({ position: animatedPosition || position });

    return (
        <a.mesh position={animatedProps.position} onClick={openUrl} renderOrder={1}>
            <RoundedBox args={[1.5, 2, 0.03]} radius={0.1} smoothness={4}>
                <meshStandardMaterial map={texture} />
            </RoundedBox>
            {showHtml && (
                <Html position={[-0.3, 1.5, 0]}>
                    <div className="store-info">
                        <p>{store.name}</p>
                    </div>
                </Html>
            )}
            {showHtml && (
                <Html position={[-0.5, -0.8, 0]}>
                    <div className="store-info">
                        <p>{store.time}</p>
                    </div>
                </Html>

            )}
        </a.mesh>
    );
}

export default Box;
