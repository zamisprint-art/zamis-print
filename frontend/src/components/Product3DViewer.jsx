import { Suspense, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Center } from '@react-three/drei';

// Error Boundary para capturar fallos del render 3D (ej. HDR no disponible)
class ThreeErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-surface-base/50 rounded-2xl border border-neutral-200 text-neutral-400 text-sm">
          Vista 3D no disponible
        </div>
      );
    }
    return this.props.children;
  }
}

// This component loads the actual 3D model
const Model = ({ url }) => {
  if (url === 'placeholder') {
    return (
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#8b5cf6" roughness={0.3} metalness={0.8} />
      </mesh>
    );
  }
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
};

const Product3DViewer = ({ modelUrl }) => {
  return (
    <ThreeErrorBoundary>
      <div className="w-full h-full bg-surface-base/50 rounded-2xl overflow-hidden border border-neutral-200 relative cursor-move">
        <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md text-xs px-3 py-1 rounded-full text-neutral-700 pointer-events-none">
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
    </ThreeErrorBoundary>
  );
};

export default Product3DViewer;

