# Decision Studio

> **Visual Decision Intelligence Platform** — Map options, evaluate trade-offs, and surface the best path forward through an interactive canvas.

[![Live Demo](https://img.shields.io/badge/Live-Demo-6366F1?style=for-the-badge)](https://shreekumar-shah-aicte.github.io/Decision-Studio/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

---

## What It Solves

Every complex decision — a product pivot, an architecture choice, a career move — has hidden structure: competing options with costs, risks, dependencies, and a confidence level. People usually track these in scattered notes, spreadsheets, or their heads.

**Decision Studio** gives that structure a visual home. You build a decision tree right on an infinite canvas: drag cards into place, draw connections, fill in the real trade-offs, and watch an intelligence engine synthesize everything into a defensible recommendation — instantly.

**The one user this is built for:** A product manager or founder who needs to present a complex architectural or strategic decision to stakeholders with clear reasoning, not just a gut feeling. They want to show _why_ one option wins.

---

## Five Features, Fully Working

### 1. Interactive Zoomable Decision Canvas
Pinch-to-zoom, scroll-to-zoom, and drag-to-pan across an unlimited workspace. The canvas handles thousands of cards without degradation. Built on React Flow's battle-tested engine with custom controls and a minimap for spatial awareness.

> **Codebase location:** `src/components/canvas/DecisionCanvas.tsx`, `src/components/canvas/CanvasControls.tsx`

### 2. Drag-and-Drop Decision Cards
Click "Add Card" and a new card drops onto the canvas, ready to edit. Drag cards anywhere — React Flow's node drag system provides smooth, lag-free repositioning at any zoom level, with live persistence to localStorage on every move.

> **Codebase location:** `src/components/cards/DecisionCardNode.tsx`, `src/store/boardStore.ts` → `moveCard`

### 3. Visual Connections Between Decisions
Click-drag from any card handle to another to draw a connection. Four connection types — **Leads To**, **Supports**, **Blocks**, **Depends On** — each rendered in a distinct semantic color with animated flow for causal paths. Labels show the relationship at a glance.

> **Codebase location:** `src/components/canvas/CustomEdge.tsx`, `src/lib/utils.ts` → `CONNECTION_TYPE_COLORS`

### 4. Rich Decision Cards
Each card carries a full decision model:
| Dimension | Range | Visual |
|---|---|---|
| **Pros** | N items, weight 1–5 | Emerald bullets |
| **Cons** | N items, weight 1–5 | Rose bullets |
| **Risk** | 0–100% | Amber bar |
| **Cost** | 0–100% | Sky bar |
| **Dependencies** | Linked card IDs | Count badge |
| **Confidence** | 0–100% | Violet bar + score ring |

Four card categories: **Decision** (root question), **Option** (scoreable choice), **Factor** (constraint/context), **Outcome** (downstream result).

> **Codebase location:** `src/store/types.ts`, `src/components/cards/DecisionCardNode.tsx`, `src/components/panels/CardEditPanel.tsx`

### 5. Smooth Animations & Responsive Experience
- Cards enter with a spring animation (Framer Motion)
- Animated edges flow along causal paths
- Panel slides in from the right with spring physics
- Board list items animate on hover
- All metrics bars transition over 700ms with cubic-bezier easing
- Fully responsive layout down to mobile (canvas stays functional on touch)

> **Codebase location:** `src/index.css` (easing), every component uses `framer-motion`

---

## Decision Intelligence Engine

The platform includes a **deterministic scoring engine** that turns raw card data into a ranked recommendation. No black box — every point is traceable:

```
Score = (ProStrength × proRatio) - (ConStrength × conRatio)
        − (risk × 0.25)
        − (cost × 0.15)
        + (confidence − 50) × 0.1
        − (dependencies × 3)
        × (confidence / 100)
```

Options are ranked **Strong / Consider / Weak / Avoid** with a plain-English reasoning sentence. The Analysis Panel surfaces the top insight in a single sentence and shows a comparative bar chart.

> **Codebase location:** `src/lib/scoring.ts`

---

## Architecture

```
src/
├── store/
│   ├── types.ts          — DecisionCard, Connection, Board, AnalysisResult
│   └── boardStore.ts     — Zustand store with localStorage persistence
├── data/
│   └── mockBoards.ts     — Seeded "Product Architecture Decision" board
├── lib/
│   ├── scoring.ts        — Deterministic decision intelligence engine
│   └── utils.ts          — cn(), generateId(), color maps
├── components/
│   ├── canvas/
│   │   ├── DecisionCanvas.tsx   — React Flow wrapper, node/edge wiring
│   │   ├── CanvasControls.tsx   — Zoom/fit/reset controls panel
│   │   ├── CustomEdge.tsx       — Colored, labeled, animated edge
│   │   └── EmptyCanvasState.tsx — Illustrated onboarding state
│   ├── cards/
│   │   └── DecisionCardNode.tsx — Rich card with metrics, pros/cons, score ring
│   ├── panels/
│   │   ├── RightPanel.tsx         — Slide-in container with tab navigation
│   │   ├── AnalysisPanel.tsx      — Intelligence engine output + comparison
│   │   ├── CardEditPanel.tsx      — Full card editor with sliders
│   │   └── BoardSettingsPanel.tsx — Board metadata + stats + danger zone
│   ├── sidebar/
│   │   └── Sidebar.tsx            — Board list, create, navigate
│   └── ui/
│       ├── Logo.tsx       — Inline SVG logo + wordmark
│       ├── ScoreRing.tsx  — SVG circular progress ring
│       ├── MetricBar.tsx  — Animated metric bar with label
│       └── Toolbar.tsx    — Top bar with actions and live stats
└── index.css              — Tailwind v4 + custom properties + React Flow overrides
```

### Key Architectural Decisions

**Zustand + localStorage** — Single store with `persist` middleware. Every card move, edit, and connection persists immediately. No explicit save button needed — the board auto-saves on every mutation.

**React Flow** — Chosen for production-quality canvas primitives. Custom `nodeTypes` and `edgeTypes` mean every visual is ours; React Flow only provides the math (transforms, hit-testing, connection routing).

**Deterministic scoring** — The intelligence engine is a pure function: same inputs always produce the same outputs. Transparent, debuggable, and defensible in a live demo.

**Component-local state for editing** — Card edits use local `useState` and flush to the store via `onBlur` / live `onChange`. This keeps the canvas smooth (no full-store re-render on every keystroke).

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

```bash
git clone https://github.com/Shreekumar-Shah-AICTE/Decision-Studio.git
cd Decision-Studio
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build       # Outputs to dist/
npm run preview     # Preview the production build locally
```

### Stack
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 6 | Type safety |
| Vite | 8 | Build tool & dev server |
| Tailwind CSS | 4 | Utility-first styling |
| React Flow (`@xyflow/react`) | 12 | Canvas, drag-and-drop, connections |
| Framer Motion | 12 | Animations & transitions |
| Zustand | 5 | Global state + persistence |
| Recharts | 3 | Data visualization |
| Lucide React | — | Icons |

### All data stays in the browser
No backend. No database. No auth. All boards persist to `localStorage` — refresh without losing a thing.

---

## License

MIT
