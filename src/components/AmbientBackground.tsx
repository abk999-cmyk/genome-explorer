/** Global atmosphere: blueprint grid + slow drifting bioluminescent orbs. */
export default function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="blueprint-grid pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        className="animate-orb-drift absolute -left-40 top-16 h-[40rem] w-[40rem] rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgba(61,240,230,0.10), transparent 60%)' }}
      />
      <div
        className="animate-orb-drift absolute right-[-10rem] top-1/3 h-[36rem] w-[36rem] rounded-full blur-[130px]"
        style={{
          background: 'radial-gradient(circle, rgba(157,123,255,0.10), transparent 60%)',
          animationDelay: '-6s',
        }}
      />
      <div
        className="animate-orb-drift absolute bottom-0 left-1/3 h-[30rem] w-[30rem] rounded-full blur-[130px]"
        style={{
          background: 'radial-gradient(circle, rgba(77,141,255,0.08), transparent 60%)',
          animationDelay: '-12s',
        }}
      />
    </div>
  )
}
