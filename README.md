# DIRECTOR'S CUT — INTERACTIVE CINEMA

> *"Every perspective tells a different truth."*

**DIRECTOR'S CUT** is a desktop-first interactive cinematic storytelling platform where audiences experience psychological thrillers through three synchronized character perspectives.

The premier featured production, **The Last Witness**, drops the viewer into a torrential Manhattan night where prominent hedge fund auditor Elena Vance falls fourteen stories to her death from the roof of Blackwood Heights. Through continuous master timeline synchronization, the audience can seamlessly switch between three contradictory viewpoints:
1. **The Witness (Marcus Ward):** Convinced he observed an intentional shove through a 600mm telephoto lens across the alleyway.
2. **The Suspect (Julian Mercer):** Claims Elena tripped on a loose scaffolding cable and he frantically lunged to catch her wrist.
3. **The Victim (Elena Vance):** Retrospective micro-camera footage revealing an orchestrated framing trap with a hidden audio recorder and a compromised safety harness that tragically failed.

---

## Key Features

- **Synchronized Master Timeline:** A single high-precision timeline engine powers video, canvas silhouettes, and dialogue subtitles. When the viewer switches perspectives, the current story timestamp is preserved with zero drift.
- **Zero Audio Overlap & Procedural Sound Design:** Powered by the Web Audio API, the sound engine dynamically modulates lowpass tension drones, rain envelopes, heartbeat pulses, and perspective-specific audio signatures without duplicate media playback or track collisions.
- **Interactive Forensic Clues:** Pulsing radar hotspot indicators appear at precise timestamps. Clicking any clue pauses the timeline and launches an in-depth forensic dossier.
- **Detective Evidence Board:** A forensic crime board connecting collected physical evidence, digital logs, and side-by-side contradictory depositions from Marcus, Julian, and Elena.
- **Tri-Branch Audience Verdict Chamber:** The audience chooses between three theories:
  - **Accident:** Structural anchor bolt failure and slick rain gravel.
  - **Murder:** Premeditated homicide to suppress embezzlement records.
  - **Deliberate Manipulation:** A staged extortion trap that turned lethal due to compromised equipment.
- **Cinematic Resolution & Replayability:** Branching ending cutscenes, character epilogues, forensic accuracy scores, and a timeline autopsy revealing missed clues.
- **Decoupled Storytelling Engine:** The core state machine (`StoryEngine`, `TimelineManager`, `AudioSynthesizer`) has zero UI framework dependencies, allowing direct reuse in future WebXR, Three.js, and spatial headset platforms.

---

## Technology Stack

- **Frontend & Framework:** React 18, TypeScript (strict mode), Vite 6
- **Styling & UI:** Tailwind CSS, Lucide React icons
- **Animations & Effects:** 35mm film grain simulation, 2.39:1 Cinemascope anamorphic letterboxing, CRT scanline effects
- **Audio & Media:** Web Audio API procedural synthesis, HTML5 Canvas 2.5D perspective renderer with dynamic rain and lighting
- **Story Engine:** Decoupled TypeScript state machine with LocalStorage persistence
- **Testing:** Vitest (logic & unit tests), React Testing Library, Playwright (end-to-end browser automation)
- **Deployment:** Vercel SPA configuration (`vercel.json`)

---

## Project Structure

```
directors-cut/
├── e2e/
│   └── cinema.spec.ts               # Playwright browser interaction tests
├── src/
│   ├── components/
│   │   ├── decision/
│   │   │   └── DecisionRoom.tsx      # Verdict chamber & ruling confirmation
│   │   ├── ending/
│   │   │   └── EndingCutscene.tsx    # Resolution cutscenes, epilogues & autopsy
│   │   ├── evidence/
│   │   │   ├── EvidenceBoard.tsx     # Detective pinboard & testimony comparison
│   │   │   └── ClueDetailModal.tsx   # Forensic analysis & contradiction matrix
│   │   ├── landing/
│   │   │   └── LandingHero.tsx       # Cinema hero, festival laurels & perspective cards
│   │   ├── player/
│   │   │   ├── CinematicCanvasRenderer.tsx  # Dynamic multi-perspective canvas renderer
│   │   │   ├── CinematicPlayer.tsx          # Master player orchestrator
│   │   │   ├── ClueHotspotOverlay.tsx       # Radar hotspot pins
│   │   │   ├── MasterTimelineBar.tsx        # Scrubber, clue pins, chapter markers
│   │   │   ├── PerspectiveSwitcher.tsx      # 1/2/3 perspective dock with live audio sync
│   │   │   └── SubtitleOverlay.tsx          # Authentic film subtitles
│   │   ├── settings/
│   │   │   ├── CreditsModal.tsx      # Cast, crew & director statement
│   │   │   └── SettingsModal.tsx     # Master volume, subtitles, grain & letterbox
│   │   └── story-selection/
│   │       └── StorySelectionPage.tsx# Case dossiers & upcoming expansions
│   ├── data/
│   │   ├── caseArchives.ts           # Case catalog & expansion metadata
│   │   └── the-last-witness.json     # Canonical case configuration & scripts
│   ├── engine/
│   │   ├── AudioSynthesizer.ts       # Web Audio API ambient tension drone & rain
│   │   ├── StoryContext.tsx          # React hook & global event bridge
│   │   ├── StoryEngine.ts            # Decoupled state machine & event bus
│   │   └── TimelineManager.ts        # High-precision continuous clock
│   ├── test/
│   │   ├── setup.ts                  # Test setup & audio/storage mocks
│   │   ├── TimelineManager.test.ts   # Clock, seeking & rate tests
│   │   ├── StoryEngine.test.ts       # Perspective sync, clues & persistence tests
│   │   ├── EvidenceContradictions.test.ts # Case schema & contradiction integrity
│   │   └── ReactComponents.test.tsx  # UI rendering & interaction tests
│   ├── types/
│   │   └── story.ts                  # Domain models & TypeScript interfaces
│   ├── App.tsx                       # Master view router
│   ├── index.css                     # Tailwind directives & cinema themes
│   └── main.tsx                      # Application entry point
├── playwright.config.ts              # Playwright configuration
├── vercel.json                       # Vercel deployment & rewrite rules
└── package.json
```

---

## Installation & Running Locally

### 1. Prerequisites
- **Node.js:** v18.0.0 or later (v20+ recommended)
- **npm:** v9.0.0 or later

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```
Generates an optimized bundle in the `dist/` directory with zero TypeScript warnings.

---

## Running the Automated Test Suites

### Unit & Integration Logic Tests (Vitest)
Executes 21 unit tests covering timeline synchronization, perspective switching, clue discovery, contradictory deposition matrices, and React components:
```bash
npm test
```

### End-to-End Browser Tests (Playwright)
Executes the full end-to-end user journey (visiting landing page, launching cinema player, testing hotkeys, switching perspectives, inspecting clues, navigating evidence board, rendering the verdict, and replaying):
```bash
npm run test:e2e
```

---

## Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `Space` | Play / Pause master timeline |
| `1` | Switch to **Witness Perspective** (Marcus Ward) |
| `2` | Switch to **Suspect Perspective** (Julian Mercer) |
| `3` | Switch to **Victim Perspective** (Elena Vance) |
| `E` | Toggle **Evidence Board** |
| `Esc` | Close clue inspection modal / settings modal |

---

## Replacing Media Assets with Real Film Footage

The platform is designed with a data-driven architecture. To substitute the built-in procedural canvas scenes with filmed 4K video clips:

1. Place your video files in `public/media/`:
   - `public/media/witness-perspective.mp4`
   - `public/media/suspect-perspective.mp4`
   - `public/media/victim-perspective.mp4`
2. Update the `videoSrc` properties in `src/data/the-last-witness.json`:
   ```json
   "perspectives": {
     "witness": {
       "videoSrc": "/media/witness-perspective.mp4"
     },
     "suspect": {
       "videoSrc": "/media/suspect-perspective.mp4"
     },
     "victim": {
       "videoSrc": "/media/victim-perspective.mp4"
     }
   }
   ```
3. The player will automatically bind HTML5 video tags to the shared master timeline while maintaining synchronized audio and clue overlays.

---

## Reusing the Decoupled Storytelling Engine

The storytelling engine is isolated inside `src/engine/StoryEngine.ts` and `src/engine/TimelineManager.ts`. It has zero React imports and can be instantiated directly in any JavaScript runtime:

```typescript
import { StoryEngine } from './src/engine/StoryEngine';
import caseData from './src/data/the-last-witness.json';

// Initialize engine in a 3D canvas, WebXR app, or Node server
const engine = new StoryEngine(caseData);

// Subscribe to tick events
engine.subscribe((state, event) => {
  console.log(`Current Time: ${state.currentTime}s, Perspective: ${state.activePerspective}`);
});

// Control master playback
engine.play();
engine.switchPerspective('suspect'); // Seamlessly preserves timeline position
engine.discoverClue('clue-tether');   // Automatically pauses and logs evidence
```

---

## Deployment to Vercel

The application is pre-configured for Vercel deployment:
- `vercel.json` includes client-side SPA routing rewrites:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
- Build command: `npm run build`
- Output directory: `dist`
- No secret environment variables or API keys required.

