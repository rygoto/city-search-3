import React, { useRef } from 'react';
import { Canvas, useFrame, extend, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { shaderMaterial } from '@react-three/drei';
import glsl from 'babel-plugin-glsl/macro';

const RefractionShaderMaterial = shaderMaterial(
    { time: 0, refractionTexture: null },

    glsl`
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

    glsl`
    uniform float time;
    uniform sampler2D refractionTexture;
    varying vec2 vUv;

    void main() {
        vec2 uv = vUv;
        uv.y += sin(uv.x * 10.0 + time * 0.5) * 0.1;
        vec4 refraction = texture2D(refractionTexture, uv);
        gl_FragColor = vec4(refraction.rgb, 1.0);
      }
    `
);

extend({ RefractionShaderMaterial });

function CrystalBall() {
    const ref = useRef();
    const texture = useLoader(TextureLoader, 'images.jpg');
    useFrame((state, delta) => (ref.current.time += delta));

    return (
        <mesh>
            <sphereGeometry args={[1, 64, 64]} />
            <refractionShaderMaterial ref={ref} refractionTexture={texture} />
        </mesh>
    );
}

function App() {
    return (
        <Canvas style={{ backgroundColor: 'black' }}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <CrystalBall />
        </Canvas>
    );
}

export default App;