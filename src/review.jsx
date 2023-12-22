import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
import { useNavigate } from 'react-router-dom';

const queries = [
    "場所",
    "飯の量、味",
    "良いメニューなど",
    "雰囲気、空間",
    "営業形態",
    "予約、すぐに入れるか"];

const summaries = [
    "抽出: 外に行列ができる（Ivan Loh）、レストランの内部は巨大（May Bresler Herzog）、場所はとても良い（rudy gelenter）要約: このレストランは人気があり、しばしば外に行列ができる場所にあります。内部は広々としており、多くの客を収容できるようです。",//0
    "抽出: 食べ物はとても美味しい（Ivan Loh）、味は素晴らしい（chirag gahlaut）、カリカリの殻だが少し油っぽい（May Bresler Herzog）、肉の味が強い（rudy gelenter）要約: 食事の味は高く評価されており、特にとんかつの味が素晴らしいとされています。ただし、いくつかのレビューでは油っぽさが指摘されています。",
    "抽出: 3種類の異なるタイプのとんかつ（Ivan Loh）、最高のとんかつ（chirag gahlaut）、シーフードのオプションもあり（Pournami Rajeev）、4種類の豚肉のカット（rudy gelenter）要約: レストランは多様な種類のとんかつを提供しており、特にその品質が高いと評価されています。また、肉を食べない人向けのシーフードオプションもあります。",
    "抽出: レストランの内部は巨大（May Bresler Herzog）要約: レストランの内部は広く、快適な食事空間を提供しているようです。",
    "抽出: サービスは日本の基準では普通（Ivan Loh）、スタッフとサービスも素晴らしい（chirag gahlaut）、サービスがかなり早い（Pournami Rajeev）要約: サービスに関しては意見が分かれていますが、一般的には日本の標準的なサービスが提供されているようです。特に速いサービスが提供されているとのレビューもあります。",
    "抽出: 早めの夕食で3番目の列（Ivan Loh）、かなり早く動く行列（May Bresler Herzog）、午前11時頃に到着し、待ち時間は約5分（Pournami Rajeev) 要約: 行列は存在しますが、比較的速く進むようです。特に早い時間に訪れると、短い待ち時間で入店できる可能性が高いようです。"
];

const Box = ({ position, text, summary, index }) => {
    const animatedProps = useSpring({ position });
    const isCloseToCenter = position[0] === 0 && position[1] === 0 && position[2] === 0;

    console.log(`Box ${index}: position =`, position);

    return (
        <a.mesh {...animatedProps}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="royalblue" />
            <Html position={[0, 3, 0]} scaleFactor={10}>
                <div style={{
                    color: 'white',
                    writingMode: 'horizontal-tb' // テキストを横書きにする
                }}><p>{text}</p></div>
            </Html>
            {isCloseToCenter && (
                <Html position={[0, -2, 0]} scaleFactor={10}>
                    <div style={{ color: 'white', writingMode: 'horizontal-tb' }}>
                        <p>{summary}</p> {/* 追加されたサマリーテキスト */}
                    </div>
                </Html>
            )}
        </a.mesh>
    );
};

const ReviewApp = () => {
    const radius = 5;
    const angleStep = (2 * Math.PI) / queries.length;
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleButtonClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % queries.length);
    };

    const navigate = useNavigate();
    const handleBackClick = () => {
        navigate('/city1');
    };



    return (

        <Canvas className="canvas" style={{ backgroundColor: 'black' }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[0, 1, -3]} intensity={8.0} />
            {queries.map((query, index) => {
                // IndexをずらしてBoxの位置を計算
                const adjustedIndex = (index + currentIndex) % queries.length;
                const angle = angleStep * adjustedIndex;
                const x = Math.sin(angle) * radius;
                const y = 0;
                const z = Math.cos(angle) * radius - 5;

                return (
                    <Box key={index} position={[x, y, z]} text={query} summary={summaries[index]} index={index} />
                );
            })}
            <Html position={[0, 5, 0]} scaleFactor={10}>
                <button onClick={handleButtonClick}>次へ</button>
            </Html>
            <Html position={[-5, 3.7, 0]} scaleFactor={10}>
                <button onClick={handleBackClick} style={{
                    padding: '10px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    boxShadow: '0 2px 2px rgba(0, 0, 0, 0.3)'
                }}>
                    戻る
                </button>
            </Html>
            <OrbitControls />
        </Canvas>

    );
};

export default ReviewApp;