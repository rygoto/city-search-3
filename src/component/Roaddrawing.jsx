import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from "three";

export function RoadSegment({ point1, point2, yPosition = -8 }) { // yPosition のデフォルト値を 0 に設定
    const meshRef = useRef();
    const { scene } = useThree();

    useEffect(() => {
        if (meshRef.current) {
            const position1 = new THREE.Vector3(...point1);
            const position2 = new THREE.Vector3(...point2);

            // 中点を計算し、Y軸の位置を調整
            const centerPosition = position1.clone().lerp(position2, 0.5);
            centerPosition.setY(yPosition); // yPosition を使用して Y 軸の位置を設定

            // メッシュのプロパティを設定
            meshRef.current.position.copy(centerPosition);
            meshRef.current.lookAt(new THREE.Vector3(position2.x, centerPosition.y, position2.z)); // Y軸の位置を合わせてlookAtを調整

            // シーンに追加（必要に応じて）
            scene.add(meshRef.current);
        }
    }, [point1, point2, yPosition, scene]); // yPosition を依存配列に追加

    // ボックスの長さを2点間の距離に合わせる
    const length = new THREE.Vector3(...point1).distanceTo(new THREE.Vector3(...point2)) * 1.3;

    return (
        <mesh ref={meshRef} scale={[0.6, 0.3, length]} renderOrder={4}>
            <boxGeometry args={[1, 0.3, 1]} />
            <meshStandardMaterial attach="material" color="red" />
        </mesh>
    );
}

export function convertLatLngToPoint(latlngArray, startposition, endposition) {
    const startPoint = new THREE.Vector3(startposition[0], 0, startposition[1]);
    const endPoint = new THREE.Vector3(endposition[0], 0, endposition[1]);
    let constraction = endPoint.clone().sub(startPoint); // ベクトルの減算

    // constraction ベクトルの長さを維持しながら、方向を (20, 0, -20) に変更
    const normalizedDirection = new THREE.Vector3(20, 0, -20).normalize();
    constraction = normalizedDirection.multiplyScalar(constraction.length());

    const scale = 20;

    return latlngArray.map(latlng => {
        const latlngpoint = new THREE.Vector3(latlng[0], 0, latlng[1]);
        const relativePoint = latlngpoint.clone().sub(startPoint); // 始点からの相対的な位置
        const roadpoint = relativePoint.clone().divide(constraction).multiplyScalar(scale);
        return [roadpoint.x, 0, roadpoint.z]; // x, y, zでアクセス
    });
}

export function convertSingleLatLngToPoint(latlng, startposition, endposition) {
    const startPoint = new THREE.Vector3(startposition[0], 0, startposition[1]);
    const endPoint = new THREE.Vector3(endposition[0], 0, endposition[1]);
    let constraction = endPoint.clone().sub(startPoint); // ベクトルの減算

    // constraction ベクトルの長さを維持しながら、方向を (20, 0, -20) に変更
    const normalizedDirection = new THREE.Vector3(20, 0, -20).normalize();
    constraction = normalizedDirection.multiplyScalar(constraction.length());

    const scale = 20;

    // 単一の緯度経度座標を3D空間座標に変換
    const latlngpoint = new THREE.Vector3(latlng[0], 0, latlng[1]);
    const relativePoint = latlngpoint.clone().sub(startPoint); // 始点からの相対的な位置
    const roadpoint = relativePoint.clone().divide(constraction).multiplyScalar(scale);
    return [roadpoint.x, 0, roadpoint.z]; // x, y, zでアクセス
}

export function Road({ points }) {
    return (
        <>
            {points.map((point, index) => {
                if (index < points.length - 1) {
                    // 次の点を取得
                    const nextPoint = points[index + 1];
                    // RoadSegment コンポーネントを生成
                    return <RoadSegment key={index} point1={point} point2={nextPoint} />;
                }
                return null;
            })}
        </>
    );
}

export function RedPin({ url, position }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} position={position} />;
}

export function GreenPin({ url, position }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} position={position} />;
}