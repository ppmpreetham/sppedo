"use client"
import { Canvas, useThree, extend, useFrame } from '@react-three/fiber'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import * as THREE from 'three'
import gsap from 'gsap'
import { Plane } from '@react-three/drei'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import ppneuebit from '../assets/font-jsons/PP NeueBit_Bold.json'
import React, { useRef, useEffect, useCallback } from 'react'
// import AnimatedText from './text'
import { Element } from 'react-scroll'
gsap.registerPlugin(ScrollTrigger)
extend({ TextGeometry })

const PI = Math.PI
let isMobile = 0

const textContent = [
  'Clothes',
  'Dresses',
  'Shoes',
  'Accessories',
  'Bags'
]

const cubePositions = [
  [0, 1, 0],
  [5, 0, -7],
  [-5, 1, -10],
  [5, -1, -15],
  [-5, 2, -20]
]

const rotationArr = [
  [0, 0, 0],
  [0, -PI / 4, 0],
  [0, PI / 4, 0],
  [0, -PI / 4, 0],
  [0, 0, 0]
]

const height = 0.08
const speed = 0.75
const timeSpent = 100

function Text({ text }) {
  const { viewport } = useThree()
  const font = new FontLoader().parse(ppneuebit)

  let getResponsiveSize = useCallback(() => {
    const isMobile = viewport.width < 768
    return isMobile ? 1.2 : 5
  }, [viewport.width])

  return (
    <mesh>
      <textGeometry
        args={[
          text,
          {
            font: font,
            size: getResponsiveSize(),
            depth: 0,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
          }
        ]}
      />
      <meshStandardMaterial attach="material" color="cyan" />
    </mesh>
  )
}

import { createNoise4D } from 'simplex-noise'

const noise4D = createNoise4D()

function AnimatedPlane() {
  const ref = useRef()
  const timeRef = useRef(0)

  useFrame((state, delta) => {
    const vertices = ref.current.geometry.attributes.position.array
    timeRef.current += delta
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i]
      const y = vertices[i + 1]
      const z =
        noise4D(x * height, y * height, 0, timeRef.current * speed) + 1.5
      vertices[i + 2] = z
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <Plane
      ref={ref}
      args={[50, 100, 200, 200]}
      rotation={[PI / 2, 0, 0]}
      scale={[3, 3, 3]}
    >
      <meshBasicMaterial attach="material" color="cyan" wireframe />
    </Plane>
  )
}

function Fog() {
  const { scene, gl } = useThree()

  useEffect(() => {
    scene.fog = new THREE.FogExp2('#111111', 0.02)
    gl.setClearColor('#000000', 0)
  }, [scene, gl])

  return null
}

function CameraController({ triggerRef }) {
  const { camera } = useThree()
  const target = new THREE.Vector3()
  const smoothTarget = new THREE.Vector3()
  const offset = new THREE.Vector3(4, 0, 0)

  let getResponsiveSize = useCallback(() => {
    isMobile = window.innerWidth < 768;
  }, []);

  useGSAP(() => {
    if (!triggerRef.current) return

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: triggerRef.current,
        start: 'top 0%',
        end: '+=' + window.innerHeight * 5,
        scrub: 1,
        pin: true,
        // markers: true
      }
    })

    cubePositions.forEach((pos, index) => {
      const nextPos =
        cubePositions[Math.min(index + 1, cubePositions.length - 1)]
      timeline.to(camera.position, {
        x: pos[0],
        y: pos[1] + 2,
        z: pos[2],
        duration: timeSpent,
        onUpdate: () => {
          // Set target position
          target.set(...nextPos)
          // Add offset to create right-sided look
          target.add(offset)
          // Smooth interpolation to the offset target
          smoothTarget.lerp(target, 0.05)
          camera.lookAt(smoothTarget)
        }
      })
    })

    return () => ScrollTrigger.getAll().forEach((st) => st.kill())
  }, [camera])

  return null
}

export default function Scene() {
  const sceneRef = useRef(null)

  return (
    <>

      <Element name="timeline">
        <div ref={sceneRef} className="h-screen w-full overflow-x-hidden overflow-y-hidden">
          <Canvas>
            <Fog />
            <CameraController triggerRef={sceneRef} />
            <ambientLight intensity={1} />
            {cubePositions.map((pos, index) => (
              <mesh key={index} position={pos} rotation={rotationArr[index]}>
                <Text text={textContent[index]} />
              </mesh>
            ))}
            <AnimatedPlane />
          </Canvas>
        </div>
      </Element>
    </>
  )
}
