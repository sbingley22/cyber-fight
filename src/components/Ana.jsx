/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */

import { useAnimations, useGLTF } from "@react-three/drei"
import gltfFile from "../assets/ana.glb?url"
import { useEffect, useRef } from "react"
import { useFrame } from "@react-three/fiber"

const Ana = ({ currentAnimation, setCurrentAnimation }) => {
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

  // Update Animation
  useEffect(()=>{
    actions["a"+currentAnimation].reset().fadeIn(0.5).play()

    return () => actions["a"+currentAnimation].fadeOut(0.5)
  }, [actions, currentAnimation])

  // Mixer functions. Listen for animation end, etc.
  useEffect(() => {
    actions['a1'].repetitions = 1
    actions['a1'].clampWhenFinished = true
    actions['a2'].repetitions = 1
    actions['a2'].clampWhenFinished = true
    actions['a3'].repetitions = 1
    actions['a3'].clampWhenFinished = true
    actions['a4'].repetitions = 1
    actions['a4'].clampWhenFinished = true
    actions['a10'].repetitions = 1
    actions['a10'].clampWhenFinished = true
    actions['a20'].repetitions = 1
    actions['a20'].clampWhenFinished = true

    // eslint-disable-next-line no-unused-vars
    mixer.addEventListener('finished', (e) => {
      //console.log(currentAnimation)
      if (currentAnimation == 11) return
      if (currentAnimation == 21) return
      if (currentAnimation == 10) setCurrentAnimation(11)
      if (currentAnimation == 20) setCurrentAnimation(21)
      else if (currentAnimation == 4) setCurrentAnimation(2)
      else setCurrentAnimation(currentAnimation+1)
    })

    return () => {
      mixer.removeEventListener('finished')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mixer, actions, currentAnimation])

  useEffect(()=>{
    if (currentAnimation == 3) {
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
          if (nodeKey == "Wavy") return
          node.material.color.b = 1 - (hitTimer.current *2)
          node.material.color.g = 1 - (hitTimer.current *2)
        }
      })
    }
  })

  const handleClick = () => {
    //console.log(hitTimer.current)
    if (hitTimer.current > 0) setCurrentAnimation(20)
  }

  return (
    <>
      <primitive object={scene} dispose={null} onClick={handleClick} />
    </>
  )
}

export default Ana

useGLTF.preload(gltfFile)