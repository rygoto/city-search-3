import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import './App.css';  // スタイルシートのインポート

const dummyStores = [
    // ここにdummyStoresのデータを挿入
    { name: "マッケ", dummyScore: 1, texture: "1.png", distance: 250, priceRange: 5, review: 2.3, url: "http://example.com/マッケ", time: "11:00~23:00", information: "まずいよ" },
    { name: "カバグミ屋", dummyScore: 5, texture: "2.png", distance: 150, priceRange: 3, review: 3.5, url: "https://qiita.com/sho-19202325/items/b1d56c627856818f4bf0", time: "9:00~20:00", information: "まずいよ" },
    { name: "グストー", dummyScore: 10, texture: "3.png", distance: 200, priceRange: 4, review: 2.5, url: "http://example.com/グストー", time: "10:00~25:00", information: "おいしいよ" },
    { name: "小籠包の事務方", dummyScore: 16, texture: "4.png", distance: 80, priceRange: 2, review: 4.2, url: "http://example.com/小籠包の事務方", time: "12:00~22:00", information: "おいしいよ" },
    { name: "サードトイレ", dummyScore: 18, texture: "5.png", distance: 350, priceRange: 1, review: 2.2, url: "http://example.com/サードトイレ", time: "13:00~20:00", information: "おいしいよ" },
    { name: "紛糾民", dummyScore: 20, texture: "6.png", distance: 250, priceRange: 5, review: 0.3, url: "http://example.com/紛糾民", time: "15:00~21:00", information: "おいしいよ" },
    { name: "シックステン", dummyScore: 22, texture: "7.png", distance: 150, priceRange: 3, review: 3.8, url: "https://zenn.dev/jun0723/articles/188834ae228d8f", time: "8:00~22:30", information: "おいしいよ" },
    { name: "広ゆ", dummyScore: 25, texture: "8.png", distance: 200, priceRange: 4, review: 4.5, url: "http://example.com/広ゆ", time: "11:00~24:00", information: "おいしいよ" },
    { name: "エイトトゥエルブ", dummyScore: 26, texture: "9.png", distance: 80, priceRange: 2, review: 2.2, url: "http://example.com/エイトボール", time: "11:00~26:00", information: "おいしいよ" },
    { name: "山田空地", dummyScore: 27, texture: "10.png", distance: 350, priceRange: 3, review: 3.2, url: "http://example.com/山田空地", time: "12:00~22:00", information: "普通" },
    { name: "テンプラ", dummyScore: 27, texture: "11.png", distance: 250, priceRange: 4, review: 2.9, url: "http://example.com/テンプラ", time: "13:30~21:30", information: "おいしいよ" },
    { name: "ススコ", dummyScore: 29, texture: "12.png", distance: 150, priceRange: 2, review: 3.2, url: "http://example.com/スココ", time: "16:00~22:00", information: "中華料理屋" },
];

const normalize = (value, min, max) => ((value - min) / (max - min)) * 50;

function StoreBall({ position, name }) {
    console.log(position);
    return (
        <mesh position={position}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="royalblue" />
            <Html distanceFactor={10}>
                <div className="storename-show">{name}</div>
            </Html>
        </mesh>
    );
}

function StoresVisualization({ stores }) {
    return (
        <>
            {stores.map((store, index) => (
                <StoreBall
                    key={index}
                    position={[store.normalizedDistance, store.normalizedPriceRange, store.normalizedReview]}
                    name={store.name}
                />
            ))}
        </>
    );
}

const OtherTryApp = () => {
    useEffect(() => {
        dummyStores.forEach(store => {
            store.normalizedDistance = normalize(store.distance, 80, 350);
            store.normalizedPriceRange = normalize(store.priceRange, 1, 5);
            store.normalizedReview = normalize(store.review, 0.3, 4.5);
        });
    }, []);

    return (
        <Canvas style={{ backgroundColor: 'black' }}>
            <ambientLight intensity={5} />
            <pointLight position={[10, 10, 10]} />
            <StoresVisualization stores={dummyStores} />
            <OrbitControls />
        </Canvas>
    );
};

export default OtherTryApp;
