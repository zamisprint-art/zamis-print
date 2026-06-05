import React from 'react';
import { Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

const FONT_URL = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/fonts/helvetiker_bold.typeface.json';

const CurvedText3D = ({ 
  text = "APOLO",
  radius = 90, 
  heightY = 15, 
  startAngle = -45, 
  letterSpacing = 25,
  charSize = 35,
  charThickness = 3,
  tiltX = 80,
  tiltZ = 90,
  color = '#1e3a8a'
}) => {
  if (!text) return null;
  const chars = text.split('');

  // Material setup: We want the text to look "engraved" or embedded, but since we 
  // can't easily do true CSG dynamically for heavy meshes without freezing the browser,
  // we use a material that contrasts or matches with shadows. 
  // Using a slightly metallic/rough standard material makes it pop.
  const material = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.4,
    metalness: 0.1,
  });

  return (
    <group scale={0.01}>
      {chars.map((char, index) => {
        // Calculate the angle for this character.
        // Convert to radians for Three.js.
        // We use negative angle to match the direction of the curve if necessary.
        const angleDeg = startAngle + (index * letterSpacing);
        const angleRad = THREE.MathUtils.degToRad(-angleDeg); // Negative to wrap correctly around Y

        return (
          <group key={index} rotation={[0, angleRad, 0]}>
            {/* Translate out to the radius, and up to the height */}
            <group position={[0, heightY, radius]}>
              {/* Tilt the text to match the bowl's slope */}
              <group rotation={[THREE.MathUtils.degToRad(-tiltX), 0, 0]}>
                <Center>
                  <Text3D
                    font={FONT_URL}
                    size={charSize}
                    height={charThickness} // Extrusion depth
                    curveSegments={12}
                    bevelEnabled
                    bevelThickness={0.5}
                    bevelSize={0.5}
                    bevelOffset={0}
                    bevelSegments={5}
                    material={material}
                  >
                    {char}
                  </Text3D>
                </Center>
              </group>
            </group>
          </group>
        );
      })}
    </group>
  );
};

export default CurvedText3D;
