/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */

import { useAnimations, useGLTF } from "@react-three/drei"
import gltfFile from "../assets/adam.glb?url"
import { useEffect, useRef } from "react"
import { useFrame } from "@react-three/fiber"

const Adam = ({ currentAnimation, setCurrentAnimation }) => {
  // eslint-disable-next-line no-unused-vars
  const { scene, nodes, animations } = useGLTF(gltfFile)
  const { actions, mixer } = useAnimations(animations, scene)

  const hitTimer = useRef(0)

  // Initial setup
  useEffect(()=>{
    //console.log(nodes)
    Object.keys(nodes).forEach(nodeKey => {
      const node = nodes[nodeKey]
      if (node.type == "SkinnedMesh") {
        node.castShadow = true
        node.frustumCulled = false
      }
    })
  }, [nodes])

  // Change Animations
  useEffect(()=>{
    //console.log(actions)
    actions["b"+currentAnimation].reset().fadeIn(0.5).play()

    return () => actions["b"+currentAnimation].fadeOut(0.5)
  }, [actions, currentAnimation])

  // Mixer functions. Listen for animation end, etc.
  useEffect(() => {
    actions['b1'].repetitions = 1
    actions['b1'].clampWhenFinished = true
    actions['b2'].repetitions = 1
    actions['b2'].clampWhenFinished = true
    actions['b3'].repetitions = 1
    actions['b3'].clampWhenFinished = true
    actions['b4'].repetitions = 1
    actions['b4'].clampWhenFinished = true
    actions['b10'].repetitions = 1
    actions['b10'].clampWhenFinished = true
    actions['b20'].repetitions = 1
    actions['b20'].clampWhenFinished = true

    // eslint-disable-next-line no-unused-vars
    // mixer.addEventListener('finished', (e) => {
    //   if (currentAnimation == 1) setCurrentAnimation(2)
    // })

    // return () => mixer.removeEventListener('finished')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mixer, actions, currentAnimation])

  useEffect(()=>{
    if (currentAnimation == 4) {
      hitTimer.current = 0.5
    }
  }, [currentAnimation])

  // eslint-disable-next-line no-unused-vars
  useFrame((state, delta)=>{
    if (hitTimer.current > 0) {
      hitTimer.current -= delta
      if (hitTimer.current < 0) hitTimer.current = 0

      Object.keys(nodes).forEach(nodeKey => {
        const node = nodes[nodeKey]
        if (node.type == "SkinnedMesh") {
          node.material.color.b = 1 - (hitTimer.current *2)
          node.material.color.g = 1 - (hitTimer.current *2)
        }
      })
    }
  })

  const handleClick = () => {
    //console.log(hitTimer.current)
    if (hitTimer.current > 0) setCurrentAnimation(10)
  }

  return (
    <>
      <primitive object={scene} dispose={null} onClick={handleClick} />
    </>
  )
}

export default Adam

useGLTF.preload(gltfFile)