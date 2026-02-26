/**
 * BallpitBackground Component
 *
 * A high-performance 3D background featuring interactive spheres that react to gravity,
 * friction, and user interaction. Uses Three.js InstancedMesh for rendering efficiency
 * and a custom physical material for advanced lighting effects.
 */

import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'

gsap.registerPlugin(Observer)

// Standard physical material — the custom shader patch broke silently on Three.js 0.170+
// MeshPhysicalMaterial with envMap + clearcoat already gives a great glossy look.

// --- Physics Engine ---
interface PhysicsConfig {
  count: number
  minSize: number
  maxSize: number
  gravity: number
  friction: number
  wallBounce: number
  maxVelocity: number
  maxX: number
  maxY: number
  maxZ: number
  followCursor: boolean
}

class PhysicsWorld {
  config: PhysicsConfig
  positionData: Float32Array
  velocityData: Float32Array
  sizeData: Float32Array
  center: THREE.Vector3 = new THREE.Vector3()

  constructor(config: PhysicsConfig) {
    this.config = config
    const count = config.count
    this.positionData = new Float32Array(3 * count).fill(0)
    this.velocityData = new Float32Array(3 * count).fill(0)
    this.sizeData = new Float32Array(count).fill(1)
    this.initialize()
  }

  started = false

  initialize() {
    const { count, maxX, maxY, maxZ, minSize, maxSize } = this.config
    for (let i = 0; i < count; i++) {
      const idx = 3 * i
      // Start all balls above the visible area — they'll drop in when triggered
      this.positionData[idx] = THREE.MathUtils.randFloatSpread(2 * maxX)
      this.positionData[idx + 1] = maxY + THREE.MathUtils.randFloat(1, maxY * 6)
      this.positionData[idx + 2] = THREE.MathUtils.randFloatSpread(2 * maxZ)
      this.velocityData[idx] = 0
      this.velocityData[idx + 1] = 0
      this.velocityData[idx + 2] = 0
      this.sizeData[i] = THREE.MathUtils.randFloat(minSize, maxSize)
    }
  }

  update(delta: number) {
    const { count, gravity, friction, wallBounce, maxVelocity, maxX, maxY, maxZ, followCursor } =
      this.config

    let startIdx = 0
    if (followCursor) {
      startIdx = 1
      const firstPos = new THREE.Vector3().fromArray(this.positionData, 0)
      firstPos.lerp(this.center, 0.1).toArray(this.positionData, 0)
      new THREE.Vector3(0, 0, 0).toArray(this.velocityData, 0)
    }

    for (let i = startIdx; i < count; i++) {
      const base = 3 * i
      const pos = new THREE.Vector3().fromArray(this.positionData, base)
      const vel = new THREE.Vector3().fromArray(this.velocityData, base)
      const radius = this.sizeData[i]

      vel.y -= delta * gravity * radius
      vel.multiplyScalar(friction)
      vel.clampLength(0, maxVelocity)
      pos.add(vel)

      // Sphere-sphere collisions
      for (let j = i + 1; j < count; j++) {
        const otherBase = 3 * j
        const otherPos = new THREE.Vector3().fromArray(this.positionData, otherBase)
        const diff = new THREE.Vector3().copy(otherPos).sub(pos)
        const dist = diff.length()
        const sumRadius = radius + this.sizeData[j]

        if (dist < sumRadius) {
          const overlap = sumRadius - dist
          const correction = diff.normalize().multiplyScalar(0.5 * overlap)
          pos.sub(correction)
          otherPos.add(correction)

          const relVel = new THREE.Vector3()
            .fromArray(this.velocityData, otherBase)
            .sub(vel)
          const impulse = correction
            .clone()
            .multiplyScalar(relVel.dot(correction.normalize()))
          vel.add(impulse)

          otherPos.toArray(this.positionData, otherBase)
        }
      }

      // Follower sphere interaction
      if (followCursor) {
        const followerPos = new THREE.Vector3().fromArray(this.positionData, 0)
        const diff = new THREE.Vector3().copy(followerPos).sub(pos)
        const d = diff.length()
        const sumRadius = radius + this.sizeData[0]
        if (d < sumRadius) {
          const correction = diff.normalize().multiplyScalar(sumRadius - d)
          pos.sub(correction)
          vel.sub(correction.multiplyScalar(0.2))
        }
      }

      // Boundary collisions
      if (Math.abs(pos.x) + radius > maxX) {
        pos.x = Math.sign(pos.x) * (maxX - radius)
        vel.x *= -wallBounce
      }
      if (pos.y - radius < -maxY) {
        pos.y = -maxY + radius
        vel.y *= -wallBounce
      } else if (gravity === 0 && pos.y + radius > maxY) {
        pos.y = maxY - radius
        vel.y *= -wallBounce
      }
      if (Math.abs(pos.z) + radius > maxZ) {
        pos.z = Math.sign(pos.z) * (maxZ - radius)
        vel.z *= -wallBounce
      }

      pos.toArray(this.positionData, base)
      vel.toArray(this.velocityData, base)
    }
  }
}

// --- Main Component ---
export interface BallpitProps {
  count?: number
  colors?: string[]
  ambientColor?: string
  ambientIntensity?: number
  lightIntensity?: number
  minSize?: number
  maxSize?: number
  gravity?: number
  friction?: number
  wallBounce?: number
  maxVelocity?: number
  maxX?: number
  maxY?: number
  maxZ?: number
  followCursor?: boolean
  className?: string
}

export const BallpitBackground: React.FC<BallpitProps> = ({
  count = 200,
  colors = ['#ffffff', '#888888', '#444444'],
  ambientColor = '#ffffff',
  ambientIntensity = 1,
  lightIntensity = 200,
  minSize = 0.5,
  maxSize = 1,
  gravity = 0.5,
  friction = 0.9975,
  wallBounce = 0.95,
  maxVelocity = 0.15,
  followCursor = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const parent = containerRef.current

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    renderer.setClearColor(0x000000, 1)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Scene & Environment
    const scene = new THREE.Scene()
    const roomEnv = new RoomEnvironment()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTexture = pmrem.fromScene(roomEnv).texture

    // Camera
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000)
    camera.position.z = 20

    // Geometry & Material
    const geometry = new THREE.SphereGeometry(1, 32, 32)
    const material = new THREE.MeshPhysicalMaterial({
      envMap: envTexture,
      envMapIntensity: 1.5,
      metalness: 0.2,
      roughness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
    })

    // Instanced Mesh
    const imesh = new THREE.InstancedMesh(geometry, material, count)
    scene.add(imesh)

    // Lights — strong setup so spheres are clearly visible
    const ambient = new THREE.AmbientLight(ambientColor, ambientIntensity * 3)
    scene.add(ambient)
    const dirLight1 = new THREE.DirectionalLight('#ffffff', 4)
    dirLight1.position.set(5, 8, 5)
    scene.add(dirLight1)
    const dirLight2 = new THREE.DirectionalLight('#4488ff', 2)
    dirLight2.position.set(-5, -3, 3)
    scene.add(dirLight2)
    const pointLight = new THREE.PointLight('#ffffff', lightIntensity)
    pointLight.position.set(0, 0, 8)
    scene.add(pointLight)

    // Physics
    const config: PhysicsConfig = {
      count,
      minSize,
      maxSize,
      gravity,
      friction,
      wallBounce,
      maxVelocity,
      followCursor,
      maxX: 5,
      maxY: 5,
      maxZ: 2,
    }
    const physics = new PhysicsWorld(config)

    // Instance colors
    const threeColors = colors.map((c) => new THREE.Color(c))
    for (let i = 0; i < count; i++) {
      imesh.setColorAt(i, threeColors[i % threeColors.length])
    }
    imesh.instanceColor!.needsUpdate = true

    // Raycasting
    const raycaster = new THREE.Raycaster()
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const intersection = new THREE.Vector3()
    const pointer = new THREE.Vector2()

    const updatePointer = (e: MouseEvent | TouchEvent) => {
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX
      const y = 'touches' in e ? e.touches[0].clientY : e.clientY
      const rect = canvas.getBoundingClientRect()
      pointer.x = ((x - rect.left) / rect.width) * 2 - 1
      pointer.y = -((y - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      raycaster.ray.intersectPlane(plane, intersection)
      physics.center.copy(intersection)
    }

    window.addEventListener('mousemove', updatePointer)
    window.addEventListener('touchstart', updatePointer)
    window.addEventListener('touchmove', updatePointer)

    // Resize
    const resize = () => {
      const w = parent.offsetWidth
      const h = parent.offsetHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      const fovRad = (camera.fov * Math.PI) / 180
      const wHeight = 2 * Math.tan(fovRad / 2) * camera.position.z
      const wWidth = wHeight * camera.aspect
      physics.config.maxX = wWidth / 2
      physics.config.maxY = wHeight / 2
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(parent)
    resize()

    // IntersectionObserver — start physics when section enters viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          physics.started = true
          clock.start()
          observer.disconnect()
        }
      },
      { threshold: 0.05 },
    )
    observer.observe(parent)

    // Animation loop
    let animationFrameId: number
    const clock = new THREE.Clock()
    const dummy = new THREE.Object3D()

    const animate = () => {
      const delta = clock.getDelta()
      if (physics.started) {
        physics.update(Math.min(delta, 0.1))
      }

      for (let i = 0; i < count; i++) {
        dummy.position.fromArray(physics.positionData, i * 3)
        const s = physics.sizeData[i]
        if (i === 0 && !followCursor) {
          dummy.scale.setScalar(0)
        } else {
          dummy.scale.setScalar(s)
        }
        dummy.updateMatrix()
        imesh.setMatrixAt(i, dummy.matrix)
        if (i === 0) pointLight.position.copy(dummy.position)
      }
      imesh.instanceMatrix.needsUpdate = true
      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', updatePointer)
      window.removeEventListener('touchstart', updatePointer)
      window.removeEventListener('touchmove', updatePointer)
      observer.disconnect()
      resizeObserver.disconnect()
      cancelAnimationFrame(animationFrameId)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      pmrem.dispose()
      roomEnv.dispose()
    }
  }, [
    count,
    colors,
    ambientColor,
    ambientIntensity,
    lightIntensity,
    minSize,
    maxSize,
    gravity,
    friction,
    wallBounce,
    maxVelocity,
    followCursor,
  ])

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="block w-full h-full outline-none" />
    </div>
  )
}

export default BallpitBackground
