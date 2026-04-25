import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Center } from '@react-three/drei';

// This component loads the actual 3D model
const Model = ({ url }) => {
  // In a real scenario, the url would point to a .glb or .gltf file uploaded by the admin
  // For demo purposes, we might just show a basic shape if the URL is a placeholder
  
  if (url === 'placeholder') {
    return (
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#8b5cf6" roughness={0.3} metalness={0.8} />
      </mesh>
    );
  }

  // useGLTF will suspend while loading and throw if error. 
  // It shouldn't be inside a try/catch.
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
};

const Product3DViewer = ({ modelUrl }) => {
  return (
    <div className="w-full h-full bg-darker/50 rounded-2xl overflow-hidden border border-white/10 relative cursor-move">
      <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md text-xs px-3 py-1 rounded-full text-gray-300 pointer-events-none">
        Arrastra para rotar • Scroll para zoom
      </div>
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <Environment preset="city" />
          
          <Center>
            <Model url={modelUrl} />
          </Center>
          
          <OrbitControls 
            enablePan={false}
            minDistance={2}
            maxDistance={10}
            autoRotate
            autoRotateSpeed={1}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Product3DViewer;
