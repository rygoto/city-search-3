import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useLoader, useFrame, extend, useThree } from '@react-three/fiber';
import { View, OrbitControls, Html, useGLTF } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
import { useNavigate } from 'react-router-dom';
import { TextureLoader, Mesh } from 'three';
import { dummyStores, predeterminedPositions, decoderouteJinguToGaien, decoderouteJinguToYotsuya } from '../src/data.jsx';
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
      <boxGeometry args={[1.5, 2, 0.03]} />
      <meshStandardMaterial map={texture} />
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

function CitySkyline() {
  const [buildings, setBuildings] = useState([]);

  useEffect(() => {
    const newBuildings = [];
    const buildingCount = 100;

    for (let i = 0; i < buildingCount; i++) {
      const min = 0.6;
      const max = 1;
      const height = (Math.random() * 5 + 5) / 2.3;
      const positionX = (Math.random() - 0.5) * 40;
      const positionZ = (Math.random() - 0.5) * 40 - 20;
      //20*20の範囲にランダムに配置

      newBuildings.push({
        key: `building-${i}`,
        position: [positionX, height / 2 - 10, positionZ],
        height: height
      });
    }

    newBuildings.push({
      key: 'ground',
      position: [0, -10.5, 0],
      isGround: true
    });

    setBuildings(newBuildings);
  }, []);

  return (
    <>
      {buildings.map((item) => (
        item.isGround ?
          <mesh key={item.key} rotation={[-Math.PI / 2, 0, 0]} position={item.position} renderOrder={2}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color={'gray'} />
          </mesh>
          :
          <mesh key={item.key} position={item.position}>
            <boxGeometry args={[1, item.height, 1]} />
            <meshStandardMaterial color="gray" />
          </mesh>
      ))}
    </>
  );
}

function RedPin({ url, position }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} position={position} />;
}

function GreenPin({ url, position }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} position={position} />;
}

function RoadSegment({ point1, point2, yPosition = -8 }) { // yPosition のデフォルト値を 0 に設定
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

function convertLatLngToPoint(latlngArray, startposition, endposition) {
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

function convertSingleLatLngToPoint(latlng, startposition, endposition) {
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

function Road({ points }) {
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

function Other() {
  const [location, setLocation] = useState('');
  const [isIframeOpen, setIsIframeOpen] = useState(false);
  const [iframeUrl, setIframeUrl] = useState('');

  const [weights, setWeights] = useState({ distance: 1, priceRange: 1, review: 1 });
  const [sortedStores, setSortedStores] = useState([]);

  const openUrlInHalf = (url) => {
    setIsIframeOpen(true);
    setIframeUrl(url);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(location);
    // ここでAPIを呼び出すか、他の処理を追加します
  };

  const [boxPositions, setBoxPositions] = useState(
    predeterminedPositions[0]
  );

  const redUrl = 'redpin.glb';
  const greenUrl = 'greenpin.glb';

  // 重みづけを設定するハンドラー
  const handleWeightChange = (type) => {
    // ここで重みづけのロジックを実装
    // 例: distanceを重視する場合は、他の値を減らす
    const newWeights = {
      distance: type === 'distance' ? 3 : 1,
      priceRange: type === 'priceRange' ? 3 : 1,
      review: type === 'review' ? 3 : 1,
    };
    setWeights(newWeights);
  };

  //店表示順のスコア計算
  function calculateTotalScore(distance, priceRange, review, weights = { distance: 1, priceRange: 1, review: 1 }) {
    // 重み付けされたスコアを計算
    const priceScore = (10 - 2 * Math.abs(3 - priceRange)) * weights.priceRange;
    const reviewScore = (review * 2) * weights.review;
    const distanceScore = ((1000 - distance) * 0.01) * weights.distance;

    // スコアの合計を計算
    const rawTotal = priceScore + reviewScore + distanceScore;

    // 合計スコアを30点満点で正規化
    const maxScore = 30;
    const normalizedTotal = (rawTotal / (weights.distance + weights.priceRange + weights.review)) * maxScore;

    return normalizedTotal;
  }

  useEffect(() => {
    const newSortedStores = dummyStores.map(store => ({
      ...store,
      score: calculateTotalScore(store.distance, store.priceRange, store.review, weights)
    })).sort((a, b) => b.score - a.score);

    setSortedStores(newSortedStores);
  }, [weights]); // 重みづけが変更されたときにのみこの効果を適用


  //const sortedStores = storesWithScores.sort((a, b) => b.score - a.score);
  //const dummySortedStores = dummyStores.sort((a, b) => b.dummyScore - a.dummyScore);//ダミースコアでやる

  const handleTotalRotationChange = (totalRotation) => {
    const rotateThreshold = 1.5;
    const rotateThreshold2 = 3.0;
    const rotateThreshold3 = 4.5;
    let newIndex;

    if (totalRotation[1] < rotateThreshold && totalRotation[1] > -rotateThreshold && totalRotation[0] > rotateThreshold && totalRotation[0] < rotateThreshold2) {
      setBoxPositions(predeterminedPositions[1]);
      newIndex = 1;
      console.log("1");
    } else if (totalRotation[1] > rotateThreshold && totalRotation[0] < rotateThreshold) {
      setBoxPositions(predeterminedPositions[2]);
      newIndex = 2;
      console.log("2");
    } else if (totalRotation[1] < -rotateThreshold && totalRotation[0] < rotateThreshold) {
      setBoxPositions(predeterminedPositions[3]);
      newIndex = 3;
      console.log("3");
    } else if (totalRotation[1] < -rotateThreshold && totalRotation[0] > rotateThreshold && totalRotation[0] < rotateThreshold2) {
      setBoxPositions(predeterminedPositions[4]);
      newIndex = 4;
      console.log("4");
    } else if (totalRotation[1] > rotateThreshold && totalRotation[0] > rotateThreshold && totalRotation[0] < rotateThreshold2) {
      setBoxPositions(predeterminedPositions[5]);
      newIndex = 5;
      console.log("5");
    } else if (totalRotation[1] < rotateThreshold && totalRotation[1] > -rotateThreshold && totalRotation[0] > rotateThreshold2 && totalRotation[0] < rotateThreshold3) {
      setBoxPositions(predeterminedPositions[6]);
      newIndex = 6;
      console.log("6");
    } else if (totalRotation[1] < -rotateThreshold && totalRotation[0] > rotateThreshold2 && totalRotation[0] < rotateThreshold3) {
      setBoxPositions(predeterminedPositions[7]);
      newIndex = 7;
      console.log("7");
    } else if (totalRotation[1] > rotateThreshold && totalRotation[0] > rotateThreshold2 && totalRotation[0] < rotateThreshold3) {
      setBoxPositions(predeterminedPositions[8]);
      newIndex = 8;
      console.log("8");
    } else if (totalRotation[1] < rotateThreshold && totalRotation[1] > -rotateThreshold && totalRotation[0] > rotateThreshold3) {
      setBoxPositions(predeterminedPositions[9]);
      newIndex = 9;
      console.log("9");
    } else if (totalRotation[1] < -rotateThreshold && totalRotation[0] > rotateThreshold3) {
      setBoxPositions(predeterminedPositions[10]);
      newIndex = 10;
      console.log("10");
    } else if (totalRotation[1] > rotateThreshold && totalRotation[0] > rotateThreshold3) {
      setBoxPositions(predeterminedPositions[11]);
      newIndex = 10;
      console.log("11");
    }
    else {
      setBoxPositions(predeterminedPositions[0]);
      newIndex = 0;
      console.log("0");
    }

  };

  const roadstart = [35.66838, 139.70576];
  const roadend = [35.68611, 139.72944];

  const road = convertLatLngToPoint(decoderouteJinguToYotsuya, roadstart, roadend);
  const lastposition = road[road.length - 1];
  const pinY = -3;
  lastposition[1] = pinY;
  console.log(road);

  //青山通り表示
  const road404start = [35.66523, 139.71252];
  const road404end = [35.67275, 139.72375];
  const road404show = [
    (road404start[0] + road404end[0]) / 2,
    (road404start[1] + road404end[1]) / 2
  ];
  const road404point = convertSingleLatLngToPoint(road404show, roadstart, roadend);
  const roadName = "青山通り";
  road404point[1] = -3;
  console.log(road404show);
  console.log("road404point" + road404point);
  console.log(roadName);

  //外堀通り表示
  const road402start = [35.68381, 139.72901];
  const road402end = [35.68611, 139.72943];
  const road402show = [
    (road402start[0] + road402end[0]) / 2,
    (road402start[1] + road402end[1]) / 2
  ];
  const road402point = convertSingleLatLngToPoint(road402show, roadstart, roadend);
  const roadName2 = "外堀通り";
  road402point[1] = -2;
  console.log(road402show);
  console.log("road402point" + road402point);
  console.log(roadName2);

  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate('/');
  };

  const handleNextClick = () => {
    navigate('/review');
  };

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={location}
          onChange={handleLocationChange}
          placeholder="Enter a location"
        />
        <button type="submit">Submit</button>
      </form>
      {/* 重みづけ制御のボタン */}
      <div style={{ padding: '10px' }}>
        <button onClick={() => handleWeightChange('distance')}>Distance Based</button>
        <button onClick={() => handleWeightChange('priceRange')}>Price Range Based</button>
        <button onClick={() => handleWeightChange('review')}>Review Based</button>
      </div>

      <Canvas style={{ backgroundColor: 'black' }}>
        <BG />
        <ambientLight />
        <pointLight position={[0, 0, 0]} intensity={2.0} />
        <pointLight position={[0, 1, 1]} intensity={5.0} />
        <Sphere onTotalRotationChange={handleTotalRotationChange} />
        {
          boxPositions.map((position) => {
            // BoxのIDに基づいて店舗を割り当てる
            const storeIndex = position.id - 1; // IDは1から始まると仮定
            const store = sortedStores[storeIndex % sortedStores.length];

            return (
              <Box key={position.id} position={[position.x, position.y, position.z]} store={store} onOpenUrl={openUrlInHalf} />
            );
          })
        }
        <CitySkyline />
        <pointLight position={[0, 1.7, 1]} intensity={20.0} color="orange" />
        <pointLight position={[0, -3, -17]} intensity={300.0} color="rgb(135, 206, 235)" />
        <RedPin url={redUrl} position={lastposition} />
        <Road points={road} />
        <Html position={road404point} scaleFactor={10}>
          <div className="road-info" style={{
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明の黒背景
            padding: '10px', // 内側の余白
            borderRadius: '5px', // 角の丸み
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)' // 影を追加
          }}>
            <p>{roadName}</p>
          </div>
        </Html>
        <Html position={road402point} scaleFactor={10}>
          <div className="road-info" style={{
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明の黒背景
            padding: '10px', // 内側の余白
            borderRadius: '5px', // 角の丸み
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)' // 影を追加
          }}>
            <p>{roadName2}</p>
          </div>
        </Html>
        <Html position={[lastposition.x, 8, lastposition.z]} scaleFactor={10}>
          <div className="road-info" style={{
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明の黒背景
            padding: '10px', // 内側の余白
            borderRadius: '5px', // 角の丸み
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)' // 影を追加
          }}>
            <p>300m</p>
          </div>
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
        <Html position={[5, 3.7, 0]} scaleFactor={10}>
          <button onClick={handleNextClick} style={{
            padding: '10px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            boxShadow: '0 2px 2px rgba(0, 0, 0, 0.3)'
          }}>
            レビュー
          </button>
        </Html>
        <OrbitControls />
      </Canvas>
      {isIframeOpen && (
        <iframe src={iframeUrl} style={{ height: '50vh', width: '100%' }}></iframe>
      )}
    </div>

  );
}

export default Other;