import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Center } from '@react-three/drei';

import Shirt from './Shirt';
import Backdrop from './Backdrop';
import CameraRig from './CameraRig';

const CanvasModel = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 0], fov: 40 }} //fov is field of view
      gl = {{ preserveDrawingBuffer: true }} //to make sure the canvas is not cleared and we can take screenshots
      className="w-full max-w-full h-full transition-all ease-in"
    >
      {/* Base lighting */}
      <ambientLight intensity={0.5} />
      <Environment preset="city" />

      {/* Scene content */}
      <CameraRig>
        <Backdrop />
        <Center>
          <Shirt />
        </Center>
      </CameraRig>

    </Canvas>
  )
}

export default CanvasModel;
