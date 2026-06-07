import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls, PerformanceMonitor, Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { buildHelix, markerSlots } from '../../lib/helixGeometry'
import { SEVERITY } from '../../lib/severity'
import { useSelection } from '../../store/selectionStore'
import type { Finding } from '../../types/report'

/* ----------------------------------------------------------------- backbone */
function Backbone({
  curve,
  color,
}: {
  curve: THREE.CatmullRomCurve3
  color: string
}) {
  const geo = useMemo(
    () => new THREE.TubeGeometry(curve, 260, 0.12, 14, false),
    [curve],
  )
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.35}
        roughness={0.35}
        metalness={0.4}
      />
    </mesh>
  )
}

/* ------------------------------------------------------------------- rungs */
function Rungs({ rungs }: { rungs: { a: THREE.Vector3; b: THREE.Vector3 }[] }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  useLayoutEffect(() => {
    if (!ref.current) return
    const dummy = new THREE.Object3D()
    const up = new THREE.Vector3(0, 1, 0)
    rungs.forEach((r, i) => {
      const mid = r.a.clone().lerp(r.b, 0.5)
      const dir = r.b.clone().sub(r.a)
      const len = dir.length()
      dummy.position.copy(mid)
      dummy.scale.set(1, len, 1)
      dummy.quaternion.setFromUnitVectors(up, dir.clone().normalize())
      dummy.updateMatrix()
      ref.current!.setMatrixAt(i, dummy.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  }, [rungs])

  return (
    <instancedMesh
      ref={ref}
      args={
        [undefined, undefined, rungs.length] as unknown as ConstructorParameters<
          typeof THREE.InstancedMesh
        >
      }
    >
      <cylinderGeometry args={[0.045, 0.045, 1, 6]} />
      <meshStandardMaterial
        color="#5b7fc4"
        emissive="#4D8DFF"
        emissiveIntensity={0.12}
        transparent
        opacity={0.5}
        roughness={0.5}
      />
    </instancedMesh>
  )
}

/* ------------------------------------------------------------------ marker */
function Marker({
  finding,
  position,
}: {
  finding: Finding
  position: THREE.Vector3
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  const downRef = useRef<{ x: number; y: number } | null>(null)
  const [hovered, setHovered] = useState(false)
  const selectedId = useSelection((s) => s.selectedId)
  const select = useSelection((s) => s.select)
  const hover = useSelection((s) => s.hover)
  const reduceMotion = useSelection((s) => s.reduceMotion)

  const color = SEVERITY[finding.severityTier].color
  const isCritical = finding.severityTier === 'critical'
  const selected = selectedId === finding.id
  const active = hovered || selected

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (matRef.current) {
      let intensity: number
      if (isCritical) {
        // calm ~60-bpm pulse — the ONLY pulsing element on the page
        const pulse = reduceMotion ? 0.5 : Math.sin(t * Math.PI * 2) * 0.5 + 0.5
        intensity = 1.8 + pulse * 1.5 + (active ? 0.7 : 0)
      } else {
        intensity = active ? 2.8 : 0.85
      }
      matRef.current.emissiveIntensity = intensity
    }
    if (meshRef.current) {
      const target = active ? 1.6 : isCritical ? 1.18 : 1
      const s = THREE.MathUtils.lerp(meshRef.current.scale.x, target, 0.15)
      meshRef.current.scale.setScalar(s)
    }
  })

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          hover(finding.id)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          setHovered(false)
          hover(null)
          document.body.style.cursor = 'auto'
        }}
        onPointerDown={(e) => {
          downRef.current = {
            x: e.nativeEvent.clientX,
            y: e.nativeEvent.clientY,
          }
        }}
        onPointerUp={(e) => {
          const d = downRef.current
          downRef.current = null
          if (!d) return
          // drag-guard: a real click barely moves; a rotate-drag moves a lot
          const moved = Math.hypot(
            e.nativeEvent.clientX - d.x,
            e.nativeEvent.clientY - d.y,
          )
          if (moved < 6) {
            e.stopPropagation()
            select(finding.id)
          }
        }}
      >
        <icosahedronGeometry args={[0.28, 2]} />
        <meshStandardMaterial
          ref={matRef}
          color={color}
          emissive={color}
          emissiveIntensity={1}
          toneMapped={false}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>

      {selected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.52, 0.025, 8, 56]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      )}

      <Html
        center
        distanceFactor={11}
        position={[0, 0.6, 0]}
        zIndexRange={[20, 0]}
        className="pointer-events-none select-none"
      >
        <div
          className={`mono whitespace-nowrap rounded-md border px-2 py-0.5 text-[10px] backdrop-blur transition-all duration-200 ${
            active ? 'scale-110 opacity-100' : 'opacity-75'
          }`}
          style={{
            borderColor: color,
            color: active ? '#EAF2FF' : '#A9B6CE',
            background: 'rgba(7,11,20,0.72)',
          }}
        >
          {finding.label}
          {active && (
            <span className="ml-1 opacity-70">· {finding.detail}</span>
          )}
        </div>
      </Html>
    </group>
  )
}

/* ----------------------------------------------------------------- effects */
function Effects({ enabled }: { enabled: boolean }) {
  if (!enabled) return null
  return (
    <EffectComposer>
      <Bloom
        mipmapBlur
        intensity={0.95}
        luminanceThreshold={0.5}
        luminanceSmoothing={0.25}
      />
    </EffectComposer>
  )
}

/* -------------------------------------------------------------- the scene */
export default function HelixScene({
  findings,
  active = true,
}: {
  findings: Finding[]
  active?: boolean
}) {
  const { curveA, curveB, rungs } = useMemo(() => buildHelix(), [])
  const slots = useMemo(() => markerSlots(findings.length), [findings.length])
  const [degraded, setDegraded] = useState(false)
  const reduceMotion = useSelection((s) => s.reduceMotion)
  const deselect = useSelection((s) => s.select)

  return (
    <Canvas
      // pause rendering entirely when scrolled off-screen (battery / GPU)
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 13], fov: 45 }}
      dpr={[1, degraded ? 1 : 2]}
      gl={{ alpha: true, antialias: !degraded }}
      onPointerMissed={() => deselect(null)}
      style={{ touchAction: 'pan-y' }}
    >
      <PerformanceMonitor onDecline={() => setDegraded(true)} />
      <ambientLight intensity={0.55} />
      <pointLight position={[7, 7, 9]} intensity={70} color="#3DF0E6" />
      <pointLight position={[-9, -5, -7]} intensity={45} color="#9D7BFF" />

      <Backbone curve={curveA} color="#3DF0E6" />
      <Backbone curve={curveB} color="#4D8DFF" />
      <Rungs rungs={rungs} />

      {findings.map((f, i) => (
        <Marker key={f.id} finding={f} position={slots[i].position} />
      ))}

      {!degraded && !reduceMotion && (
        <Sparkles
          count={40}
          scale={[10, 16, 10]}
          size={2}
          speed={0.25}
          color="#3DF0E6"
          opacity={0.4}
        />
      )}

      <OrbitControls
        enablePan={false}
        minDistance={7}
        maxDistance={18}
        autoRotate={!reduceMotion}
        autoRotateSpeed={0.55}
        enableDamping
        dampingFactor={0.08}
        target={[0, 0, 0]}
      />

      <Effects enabled={!degraded} />
    </Canvas>
  )
}
