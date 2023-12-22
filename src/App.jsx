import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { dummyStores, predeterminedPositions, decoderouteJinguToGaien, decoderouteJinguToYotsuya } from '../src/data.jsx';
import Sphere from '../src/component/Controllsphere.jsx';
import Box from '../src/component/Shopdisplaybox.jsx';
import CitySkyline from '../src/component/Cityskyline.jsx';
import { RoadSegment, convertLatLngToPoint, convertSingleLatLngToPoint, Road, RedPin, GreenPin } from '../src/component/Roaddrawing.jsx';
import BG from '../src/component/Background.jsx';
import { calculateTotalScore } from '../src/helpers/scoring.jsx';

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

  useEffect(() => {
    const newSortedStores = dummyStores.map(store => ({
      ...store,
      score: calculateTotalScore(store.distance, store.priceRange, store.review, weights)
    })).sort((a, b) => b.score - a.score);

    setSortedStores(newSortedStores);
  }, [weights]); // 重みづけが変更されたときにのみこの効果を適用


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
      </Canvas>
      {isIframeOpen && (
        <iframe src={iframeUrl} style={{ height: '50vh', width: '100%' }}></iframe>
      )}
    </div>

  );
}

export default Other;