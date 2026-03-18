# Harry Potter and the Philosopher's Stone — Chapter 1: The Boy Who Lived

An interactive 3D browser experience that retells Chapter 1 of *Harry Potter and the Philosopher's Stone* as a cinematic, low-poly Three.js scene. Walk through Privet Drive, watch Dumbledore extinguish the street lamps, see McGonagall transform from a tabby cat, and witness Hagrid arrive on a flying motorcycle — all rendered in real-time in your browser.

## Features

- **7 fully scripted scenes** following the book chapter beat-by-beat
- **Low-poly stylized 3D world** — Privet Drive with houses, gardens, street lamps, hedges and trees
- **Cinematic camera system** — automated sweeps with free orbit control
- **Put-Outer effect** — street lamps go out one by one
- **Character animations** — walking, apparition, cat-to-human transformation, flying motorcycle
- **Procedural ambient music** — synthesized per-scene mood via Web Audio API (no audio files needed)
- **Cursor wand-light** — your mouse casts a warm light onto the scene via raycasting
- **Typewriter dialogue system** — book narration with speaker attribution
- **Responsive** — works on desktop and mobile

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for production

```bash
npm run build
npm run preview
```

## Tech Stack

- [Three.js](https://threejs.org/) — 3D rendering
- [Vite](https://vitejs.dev/) — dev server & bundler
- Vanilla JavaScript — no frameworks
- Web Audio API — procedural music synthesis

## Project Structure

```
harry-potter-game/
├── index.html              # Entry point
├── css/
│   └── style.css           # UI overlay styling
├── js/
│   ├── main.js             # Game loop, renderer, cursor light
│   ├── scene-manager.js    # Scene state machine & transitions
│   ├── camera.js           # Cinematic + orbit camera
│   ├── dialogue.js         # Typewriter text system
│   ├── characters.js       # Low-poly character models
│   ├── world.js            # Privet Drive geometry
│   ├── effects.js          # Visual effects (particles, motorcycle, apparition)
│   ├── audio.js            # Procedural ambient music & SFX
│   ├── story-data.js       # All narration text
│   └── scenes/
│       ├── scene1-morning.js      # The Dursleys' morning
│       ├── scene2-town.js         # Strange things in town
│       ├── scene3-evening.js      # Evening at the Dursleys
│       ├── scene4-dumbledore.js   # Dumbledore arrives
│       ├── scene5-mcgonagall.js   # McGonagall & the conversation
│       ├── scene6-hagrid.js       # Hagrid's arrival
│       └── scene7-doorstep.js     # Harry on the doorstep
└── package.json
```

## Fair Use Notice

This project is a **non-commercial, transformative fan work** created for educational and artistic purposes. It constitutes **fair use** under 17 U.S.C. § 107 of the United States Copyright Act.

**The four factors of fair use as applied to this project:**

1. **Purpose and character of the use** — This is a non-commercial, transformative work. It does not reproduce the original text verbatim but instead reinterprets Chapter 1 as an interactive 3D experience — a fundamentally different medium and format from the original novel. The narration is paraphrased, not copied. The purpose is educational (learning Three.js, Web Audio API, and game development) and artistic (exploring interactive storytelling).

2. **Nature of the copyrighted work** — The original work is a published, fictional novel. While creative works receive broad copyright protection, this project transforms the source material into a new medium (interactive 3D browser application) with original code, procedural music, and hand-crafted 3D geometry — none of which exist in the original work.

3. **Amount and substantiality of the portion used** — This project covers only Chapter 1 out of 17 chapters of the first book in a 7-book series. The dialogue and narration are paraphrased summaries, not direct reproductions. No illustrations, cover art, fonts, audio, or other copyrighted assets from the franchise are used.

4. **Effect on the market** — This free, open-source fan project does not substitute for the original novel, films, or any official Harry Potter product. It cannot serve as a replacement for purchasing or reading the book. It is more likely to drive interest in the source material than to diminish its market value.

The Harry Potter series, characters, and story elements are the intellectual property of **J.K. Rowling** and **Warner Bros. Entertainment Inc.** This project is not affiliated with, endorsed by, or sponsored by the rights holders.

All original code in this repository is licensed under the **GNU Affero General Public License v3.0** (see [LICENSE](LICENSE)).

## License

This project's **source code** is licensed under the [GNU Affero General Public License v3.0](LICENSE).

This license does **not** extend to the Harry Potter intellectual property. The story, characters, and world of Harry Potter remain the property of their respective rights holders. See [Fair Use Notice](#fair-use-notice) above.
