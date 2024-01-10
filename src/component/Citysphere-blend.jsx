import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree, extend } from '@react-three/fiber';
import { Html, OrbitControls, Environment, useEnvironment, Sphere, useMatcapTexture } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three/examples/jsm/controls/OrbitControls';

const PanoramaSphereBlend = ({ imagePath, initialPosition, cityName, url, setTarget }) => {
    const meshRef = useRef();
    const navigate = useNavigate();
    const texture = useLoader(THREE.TextureLoader, imagePath);
    const heightMapURL = '../../public/noise.jpg';
    const heightMap = useLoader(THREE.TextureLoader, heightMapURL);
    const displacementMapURL = '../../public/noise3D.jpg';
    const displacementMap = useLoader(THREE.TextureLoader, displacementMapURL);
    const citytextureURL = '../../public/city1.png';
    const citytexture = useLoader(THREE.TextureLoader, citytextureURL);

    const [uniforms, setUniforms] = useState();

    useEffect(() => {
        if (heightMap && displacementMap) {
            setUniforms({
                iterations: { value: 20 },
                depth: { value: 0.40 },
                smoothing: { value: 0.3 },
                colorA: { value: new THREE.Color('black') },
                colorB: { value: new THREE.Color('green') },
                heightMap: { value: heightMap },
                displacementMap: { value: displacementMap },
                displacement: { value: 0.1 },
                time: { value: 0.0 },
                insidetexture: { value: citytexture },
            });
        } else {
            console.log("b");
        }
    }, [heightMap]);

    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = -1;

    const htmlPosition = [initialPosition[0], initialPosition[1] + 1.2, initialPosition[2]];

    useFrame(() => {
        meshRef.current.rotation.y += 0.005;
    });

    const handleClick = () => {
        setTarget(new THREE.Vector3(...initialPosition));
        setTimeout(() => navigate(url), 1000); // Navigate after camera starts moving
    };

    const crystalShaderMaterial = new THREE.MeshStandardMaterial({
        roughness: 0.13,
    });

    crystalShaderMaterial.onBeforeCompile = (shader) => {
        shader.uniforms = { ...shader.uniforms, ...uniforms }

        shader.vertexShader = `
           varying vec3 v_pos;
           varying vec3 v_dir;
           varying vec2 vUv;
        ` + shader.vertexShader;

        shader.vertexShader = shader.vertexShader.replace(/void main\(\) {/, (match) => match + `
        v_dir = position - cameraPosition; // Points from camera to vertex
        v_pos = position;
        vUv = uv;
        `);

        shader.fragmentShader = `
        #define FLIP vec2(1., -1.)
        
        uniform vec3 colorA;
        uniform vec3 colorB;
        uniform sampler2D heightMap;
        uniform sampler2D displacementMap;
        uniform int iterations;
        uniform float depth;
        uniform float smoothing;
        uniform float displacement;
        uniform float time;
        uniform sampler2D insidetexture;
        
        varying vec3 v_pos;
        varying vec3 v_dir;
        varying vec2 vUv;
        ` + shader.fragmentShader



        //ここからマーベル関数本体
        shader.fragmentShader = shader.fragmentShader.replace(/void main\(\) {/, (match) => `
        /**
      * @param p - Point to displace
      * @param strength - How much the map can displace the point
      * @returns Point with scrolling displacement applied
      */
       vec3 displacePoint(vec3 p, float strength) {
       vec2 uv = equirectUv(normalize(p));
       vec2 scroll = vec2(time, 0.);
       vec3 displacementA = texture(displacementMap, uv + scroll).rgb; // Upright
       vec3 displacementB = texture(displacementMap, uv * FLIP - scroll).rgb; // Upside down
       
       // Center the range to [-0.5, 0.5], note the range of their sum is [-1, 1]
       displacementA -= 0.5;
       displacementB -= 0.5;
       
       return p + strength * (displacementA + displacementB);
       }
     
             /**
       * @param rayOrigin - Point on sphere
       * @param rayDir - Normalized ray direction
       * @returns Diffuse RGB color
       */
       vec3 marchMarble(vec3 rayOrigin, vec3 rayDir) {
       float perIteration = 1. / float(iterations);
       vec3 deltaRay = rayDir * perIteration * depth;

       // Start at point of intersection and accumulate volume
       vec3 p = rayOrigin;
       float totalVolume = 0.;

        for (int i=0; i<iterations; ++i) {
         // Read heightmap from spherical direction of displaced ray position
         vec3 displaced = displacePoint(p, displacement);
         vec2 uv = equirectUv(normalize(displaced));
         float heightMapVal = texture(heightMap, uv).r;

         // Take a slice of the heightmap
         float height = length(p); // 1 at surface, 0 at core, assuming radius = 1
         float cutoff = 1. - float(i) * perIteration;
         float slice = smoothstep(cutoff, cutoff + smoothing, heightMapVal);

         // Accumulate the volume and advance the ray forward one step
         totalVolume += slice * perIteration;
         p += deltaRay;
       }
       return mix(colorA, colorB, totalVolume);
       }
   `   + match)

        shader.fragmentShader = shader.fragmentShader.replace(
            /vec4 diffuseColor.*;/,
            `
            vec3 rayDir = normalize(v_dir);
            vec3 rayOrigin = v_pos;

            float radius = length(rayOrigin);
            vec4 internalColor = texture(insidetexture, vUv);
            vec4 marbleColor = vec4(marchMarble(rayOrigin, rayDir), 1.0);

            float blendFactor = smoothstep(0.5,0.9,radius);
            vec4 diffuseColor = mix(internalColor, marbleColor, blendFactor);
            `
        )
    };

    return (
        <>
            <mesh
                ref={meshRef}
                position={initialPosition}
                onClick={handleClick}
            >
                <sphereGeometry args={[0.8, 32, 32]} />
                {/* カスタムシェーダーマテリアルを適用 */}
                <primitive object={crystalShaderMaterial} attach="material" />
            </mesh >
            <Html position={htmlPosition}>
                <div style={{ color: 'white', fontSize: '20px' }}>
                    {cityName}
                </div>
            </Html>
        </>
    );
};

export default PanoramaSphereBlend;