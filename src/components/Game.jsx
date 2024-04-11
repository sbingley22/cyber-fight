/* eslint-disable react/no-unknown-property */

import { Canvas } from "@react-three/fiber"
import { Suspense, useState } from "react"
import { Environment, OrbitControls } from "@react-three/drei"
import {
  BrightnessContrast,
  ChromaticAberration,
  EffectComposer,
  Glitch,
  Noise,
  Pixelation,
  Sepia,
  Vignette
} from '@react-three/postprocessing'
import { useControls, Leva, button } from 'leva'
import ShadowCatcher from "./ShadowCatcher"
import Adam from "./Adam"
import Ana from "./Ana"

const Game = () => {
  const [currentAnimation, setCurrentAnimation] = useState(1)

  useControls({
    resetAnimation: button(() => {
      setCurrentAnimation(1)
    })
  }, [currentAnimation])

  const { pixelate, noiseValue, glitchValue, chromaticValue, sepiaValue } = useControls("Compositor",{
    pixelate: {
      label: 'Pixelate',
      value: 0,
      min: 0,
      max: 12,
      step: 1
    },
    noiseValue: {
      label: 'Noise',
      value: 0,
      min: 0,
      max: 1,
      step: 0.1
    },
    glitchValue: {
      label: 'Glitch',
      value: false
    },
    chromaticValue: {
      label: 'Chromatic',
      value: false
    },
    sepiaValue: {
      label: 'Sepia',
      value: 0,
      min: 0,
      max: 1,
      step: 0.1
    }
  })

  return (
    <div className="game">
      <Leva collapsed={true} />
      <Canvas shadows camera={{ position: [2.2, 0.7, -0.5] }} >
        <Suspense>
          <OrbitControls />

          {/* <ambientLight intensity={0.1} /> */}
          <directionalLight intensity={0.8} position={[0,2,0]} castShadow />
          <Environment preset="sunset" />
      
          <group position-y={-1}>
            <Ana currentAnimation={currentAnimation} setCurrentAnimation={setCurrentAnimation} />
            <Adam currentAnimation={currentAnimation} setCurrentAnimation={setCurrentAnimation} />
            
            <ShadowCatcher />    
          </group>

        </Suspense>

        <EffectComposer>
          <BrightnessContrast brightness={0.0} contrast={0.0} />
          <Noise opacity={noiseValue} />
          <Pixelation granularity={pixelate} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
          <Glitch
            delay={[0.1, 0.3]}
            duration={[0.2, 1.0]}
            strength={[0.01, 0.02]}
            active={glitchValue}
            ratio={0.85}
          />
          <ChromaticAberration offset={chromaticValue ? [0.001, 0.001] : [0, 0]} />
          <Sepia intensity={sepiaValue} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

export default Game
