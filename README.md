# Your Genome, Decoded

An interactive, futuristic single-page experience that interprets a genome
screening report and makes it genuinely fun to explore — with a 3D DNA helix you
can orbit, hover, and click, where the problematic gene glows red.

> ⚠️ **Educational visualization only — not medical advice, a diagnosis, or a
> clinical result.** It is built around a **synthetic demonstration report**
> (fictional patient). Always consult a qualified clinician or genetic counselor.

## Highlights

- **3D DNA explorer** — a WebGL double helix ([react-three-fiber](https://github.com/pmndrs/react-three-fiber))
  with every finding placed as an interactive node. Hover or click to see what it
  means for you; the pathogenic **KCNH2 / LQT2** node glows red and pulses (~60 bpm).
- **Coordinate-accurate chromosome ideogram** ([ideogram.js](https://github.com/eweitz/ideogram))
  showing exactly *where* each variant sits (GRCh38) — bidirectionally linked to
  the helix and the detail drawer via a shared selection store.
- **Plain-English interpretations** for every finding: the monogenic LQT2 variant
  (with an animated ECG / prolonged-QT motif and an ACMG evidence breakdown),
  3 recessive carrier findings, pharmacogenomics with a **QT-prolonging-drug
  avoid-list**, and 10 reassuring screened-negatives.
- **Accessible & considerate** — severity is always color **+ icon + label**
  (colour-blind-safe), a working reduced-motion toggle swaps the 3D helix for a
  keyboard-navigable SVG fallback, and the detail drawer is focus-trapped.

## Tech stack

React 19 · Vite · TypeScript · Tailwind CSS v4 · three.js / @react-three/fiber /
drei / postprocessing · ideogram.js · Zustand · Framer Motion · GSAP · Lenis · Zod.

The entire report lives as one Zod-validated data file
([`src/data/report.ts`](src/data/report.ts)) against a report-agnostic schema
([`src/types/report.ts`](src/types/report.ts)) — drop in a different report and the
whole UI re-renders. No backend; all data is static and processed in the browser.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static production build → dist/
npm run preview  # preview the production build
```

## Project structure

```
src/
├── data/report.ts          # the authored, verified report data
├── types/report.ts         # the Zod schema / data contract
├── lib/                    # helix geometry, findings mapper, severity, webgl
├── store/selectionStore.ts # shared selection + motion preference (Zustand)
├── components/
│   ├── helix/              # 3D scene + SVG fallback
│   ├── ideogram/           # chromosome ideogram
│   ├── sections/           # hero, headline, explorer, carrier, pharmaco, …
│   └── ui/                 # drawer, badges, ECG, ACMG bar, nav, …
└── App.tsx
```

---

Built with [Claude Code](https://claude.com/claude-code).
