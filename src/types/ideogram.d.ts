// ideogram ships no TypeScript types; we use a minimal ambient declaration.
declare module 'ideogram' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Ideogram: any
  export default Ideogram
}
