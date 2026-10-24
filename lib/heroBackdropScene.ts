import {
  buildGraph,
  createRandom,
  pickSearch,
  searchFrame,
  LEVEL_MS,
  PATH_MS,
  stepNodes,
  type HeroGraph,
  type Random,
  type SearchFrame,
  type SearchResult,
} from "./heroGraph";

export type HeroBackdropVariant = "recruiter" | "playful" | "detail";
type Rgb = readonly [number, number, number];

export interface VariantConfig {
  /** CSS-only background shown before (and under) the canvas. */
  fallbackBackground: string;
  /** Colour of the dark mask that keeps hero text readable. */
  maskRgb: Rgb;
  /** Node / search colours; recruiter and detail use a single Prime blue. */
  palette: Rgb[];
  edgeAlpha: number;
  nodeAlpha: number;
  pulseAlpha: number;
  glyphAlpha: number;
  nodeScale: number;
  speedScale: number;
  /** Radius wobble amount, 0 for calm variants. */
  wobble: number;
  glyphs: string[];
}

const PRIME_BLUE: Rgb = [26, 152, 255];
const CODE_GLYPHS = ["{ }", "</>", "=>", "[ ]", "&&", "( )", "//", "#!"];
const PLAYFUL_GLYPHS = ["🐛", "☕", "{ }", "=>", "✨", "🚀", "</>", "404", "🔥", ":)"];
const RECRUITER_BASE: Rgb = [15, 23, 30];
const DETAIL_BASE: Rgb = [5, 8, 15];
const PLAYFUL_BASE: Rgb = [17, 14, 26];

export const VARIANTS: Record<HeroBackdropVariant, VariantConfig> = {
  recruiter: {
    fallbackBackground:
      "radial-gradient(60% 85% at 82% 40%, rgba(26,152,255,0.16), transparent 70%), linear-gradient(90deg, #05080f 0%, #0F171E 100%)",
    maskRgb: RECRUITER_BASE,
    palette: [PRIME_BLUE],
    edgeAlpha: 0.2,
    nodeAlpha: 0.45,
    pulseAlpha: 0.9,
    glyphAlpha: 0.1,
    nodeScale: 1,
    speedScale: 1,
    wobble: 0,
    glyphs: CODE_GLYPHS,
  },
  detail: {
    fallbackBackground:
      "radial-gradient(60% 85% at 82% 40%, rgba(26,152,255,0.09), transparent 70%), linear-gradient(90deg, #05080f 0%, #070c14 100%)",
    maskRgb: DETAIL_BASE,
    palette: [PRIME_BLUE],
    edgeAlpha: 0.13,
    nodeAlpha: 0.3,
    pulseAlpha: 0.6,
    glyphAlpha: 0.06,
    nodeScale: 0.9,
    speedScale: 0.7,
    wobble: 0,
    glyphs: CODE_GLYPHS,
  },
  playful: {
    fallbackBackground:
      "radial-gradient(55% 70% at 80% 35%, rgba(167,139,250,0.2), transparent 70%), radial-gradient(40% 55% at 96% 92%, rgba(244,114,182,0.14), transparent 70%), linear-gradient(90deg, #0b0a12 0%, #13161A 100%)",
    maskRgb: PLAYFUL_BASE,
    palette: [[167, 139, 250], [244, 114, 182], [251, 191, 36], [52, 211, 153]],
    edgeAlpha: 0.22,
    nodeAlpha: 0.6,
    pulseAlpha: 0.95,
    glyphAlpha: 0.2,
    nodeScale: 1.7,
    speedScale: 2.2,
    wobble: 0.22,
    glyphs: PLAYFUL_GLYPHS,
  },
};

interface Glyph {
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  spin: number;
  isEmoji: boolean;
}

interface ActiveSearch {
  result: SearchResult;
  startedAtMs: number;
  rgb: Rgb;
}

export interface Scene {
  graph: HeroGraph;
  glyphs: Glyph[];
  random: Random;
  search: ActiveSearch | null;
  nextSearchAtMs: number;
  clockMs: number;
  searchCount: number;
}

const GLYPH_COUNT = 9;
const MIN_GLYPH_SIZE = 14;
const GLYPH_SIZE_RANGE = 16;
const GLYPH_SPEED = 0.006;
const GLYPH_SPIN = 0.05;
const FIRST_SEARCH_DELAY_MS = 700;
const MIN_IDLE_MS = 1800;
const IDLE_RANGE_MS = 1800;
const TRAIL_LEVELS = 4;
const MIN_TRAIL = 0.3;
const VISIBLE_FLOOR = 0.15;
const FULLY_VISIBLE_X = 0.72;
const HIDDEN_X = 0.3;
const WHITE_MIX = 0.45;
const GLYPH_MIN_X = 0.3;
const MONO_FONT = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const EMOJI_FONT = "system-ui, 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif";
const EMOJI_PATTERN = /\p{Extended_Pictographic}/u;

const rgba = (rgb: Rgb, alpha: number) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha.toFixed(3)})`;
const mixWithWhite = (rgb: Rgb): Rgb => rgb.map((c) => Math.round(c + (255 - c) * WHITE_MIX)) as unknown as Rgb;
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** Dims everything on the text side so hero copy keeps AA contrast; full strength on the right. */
function visibility(x: number): number {
  const t = clamp01((x - HIDDEN_X) / (FULLY_VISIBLE_X - HIDDEN_X));
  return VISIBLE_FLOOR + (1 - VISIBLE_FLOOR) * t * t * (3 - 2 * t);
}

function createGlyphs(config: VariantConfig, random: Random): Glyph[] {
  return Array.from({ length: GLYPH_COUNT }, (_, index) => {
    const text = config.glyphs[index % config.glyphs.length];
    const heading = random() * Math.PI * 2;
    return {
      text,
      x: GLYPH_MIN_X + random() * (1 - GLYPH_MIN_X),
      y: random(),
      vx: Math.cos(heading) * GLYPH_SPEED,
      vy: Math.sin(heading) * GLYPH_SPEED,
      size: MIN_GLYPH_SIZE + random() * GLYPH_SIZE_RANGE,
      angle: (random() - 0.5) * 0.6,
      spin: (random() - 0.5) * GLYPH_SPIN,
      isEmoji: EMOJI_PATTERN.test(text),
    };
  });
}

export function createScene(variant: HeroBackdropVariant, nodeCount: number, aspect: number, seed: number): Scene {
  const config = VARIANTS[variant];
  const graph = buildGraph(nodeCount, aspect, seed, config.palette.length);
  const random = createRandom(seed + 1);
  return {
    graph,
    glyphs: createGlyphs(config, random),
    random,
    search: null,
    nextSearchAtMs: FIRST_SEARCH_DELAY_MS,
    clockMs: 0,
    searchCount: 0,
  };
}

function startSearch(scene: Scene, config: VariantConfig) {
  const result = pickSearch(scene.graph, scene.random);
  if (!result) return;
  const rgb = config.palette[scene.searchCount % config.palette.length];
  scene.search = { result, startedAtMs: scene.clockMs, rgb };
  scene.searchCount += 1;
}

function stepGlyphs(glyphs: Glyph[], dtSeconds: number) {
  glyphs.forEach((glyph) => {
    glyph.x += glyph.vx * dtSeconds;
    glyph.y += glyph.vy * dtSeconds;
    glyph.angle += glyph.spin * dtSeconds;
    if (glyph.x < GLYPH_MIN_X || glyph.x > 1) glyph.vx = -glyph.vx;
    if (glyph.y < 0 || glyph.y > 1) glyph.vy = -glyph.vy;
  });
}

export function stepScene(scene: Scene, dtMs: number, config: VariantConfig) {
  scene.clockMs += dtMs;
  stepNodes(scene.graph.nodes, dtMs / 1000, config.speedScale);
  stepGlyphs(scene.glyphs, dtMs / 1000);
  if (scene.search && searchFrame(scene.search.result, scene.clockMs - scene.search.startedAtMs).isDone) {
    scene.search = null;
    scene.nextSearchAtMs = scene.clockMs + MIN_IDLE_MS + scene.random() * IDLE_RANGE_MS;
  }
  if (!scene.search && scene.clockMs >= scene.nextSearchAtMs) startSearch(scene, config);
}

interface Surface {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}

function drawGlyphs({ ctx, width, height }: Surface, scene: Scene, config: VariantConfig) {
  scene.glyphs.forEach((glyph) => {
    ctx.save();
    ctx.translate(glyph.x * width, glyph.y * height);
    ctx.rotate(glyph.angle);
    ctx.font = `${glyph.isEmoji ? "" : "600 "}${glyph.size}px ${glyph.isEmoji ? EMOJI_FONT : MONO_FONT}`;
    ctx.globalAlpha = config.glyphAlpha * visibility(glyph.x) * (glyph.isEmoji ? 1.4 : 1);
    ctx.fillStyle = rgba(config.palette[0], 1);
    ctx.fillText(glyph.text, 0, 0);
    ctx.restore();
  });
}

function drawEdges({ ctx, width, height }: Surface, scene: Scene, config: VariantConfig) {
  const { nodes, edges } = scene.graph;
  ctx.lineWidth = 1;
  edges.forEach(([a, b]) => {
    const from = nodes[a];
    const to = nodes[b];
    ctx.strokeStyle = rgba(config.palette[from.colorIndex], config.edgeAlpha * visibility((from.x + to.x) / 2));
    ctx.beginPath();
    ctx.moveTo(from.x * width, from.y * height);
    ctx.lineTo(to.x * width, to.y * height);
    ctx.stroke();
  });
}

function drawNodes({ ctx, width, height }: Surface, scene: Scene, config: VariantConfig) {
  scene.graph.nodes.forEach((node) => {
    const wobble = 1 + config.wobble * Math.sin(scene.clockMs / 420 + node.phase);
    ctx.fillStyle = rgba(config.palette[node.colorIndex], config.nodeAlpha * visibility(node.x));
    ctx.beginPath();
    ctx.arc(node.x * width, node.y * height, node.radius * config.nodeScale * wobble, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawGlow({ ctx }: Surface, x: number, y: number, radius: number, rgb: Rgb, alpha: number) {
  ctx.fillStyle = rgba(rgb, alpha * 0.25);
  ctx.beginPath();
  ctx.arc(x, y, radius * 2.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = rgba(rgb, alpha);
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawExplored(surface: Surface, scene: Scene, active: ActiveSearch, frame: SearchFrame, config: VariantConfig) {
  const { ctx, width, height } = surface;
  const { nodes, edges } = scene.graph;
  const { depth } = active.result;
  ctx.lineWidth = 1.3;
  edges.forEach(([a, b]) => {
    const da = depth[a];
    const db = depth[b];
    if (da < 0 || db < 0 || da === db) return;
    const [lo, hi] = da < db ? [nodes[a], nodes[b]] : [nodes[b], nodes[a]];
    const progress = clamp01(frame.frontier - Math.min(da, db));
    if (progress <= 0) return;
    const age = Math.max(0, frame.frontier - Math.max(da, db));
    const trail = Math.max(MIN_TRAIL, 1 - age / TRAIL_LEVELS);
    ctx.strokeStyle = rgba(active.rgb, config.pulseAlpha * 0.7 * trail * frame.exploreAlpha * visibility((lo.x + hi.x) / 2));
    ctx.beginPath();
    ctx.moveTo(lo.x * width, lo.y * height);
    ctx.lineTo((lo.x + (hi.x - lo.x) * progress) * width, (lo.y + (hi.y - lo.y) * progress) * height);
    ctx.stroke();
  });
  nodes.forEach((node, index) => {
    const d = depth[index];
    if (d < 0 || d > frame.frontier) return;
    const flash = clamp01(1 - (frame.frontier - d));
    const alpha = config.pulseAlpha * frame.exploreAlpha * visibility(node.x) * (0.35 + 0.65 * flash);
    drawGlow(surface, node.x * width, node.y * height, node.radius * config.nodeScale + 1, active.rgb, alpha);
  });
}

function drawPath(surface: Surface, scene: Scene, active: ActiveSearch, frame: SearchFrame, config: VariantConfig) {
  const { ctx, width, height } = surface;
  const { path } = active.result;
  if (!path || frame.pathProgress <= 0) return;
  const bright = mixWithWhite(active.rgb);
  const reach = frame.pathProgress * (path.length - 1);
  ctx.lineCap = "round";
  const strokes = [
    { lineWidth: 5, strength: 0.22, rgb: active.rgb },
    { lineWidth: 2, strength: 1, rgb: bright },
  ];
  strokes.forEach(({ lineWidth, strength, rgb }) => {
    ctx.lineWidth = lineWidth;
    for (let i = 0; i < path.length - 1 && i < reach; i += 1) {
      const from = scene.graph.nodes[path[i]];
      const to = scene.graph.nodes[path[i + 1]];
      const t = Math.min(1, reach - i);
      ctx.strokeStyle = rgba(rgb, strength * frame.pathAlpha * config.pulseAlpha * visibility((from.x + to.x) / 2));
      ctx.beginPath();
      ctx.moveTo(from.x * width, from.y * height);
      ctx.lineTo((from.x + (to.x - from.x) * t) * width, (from.y + (to.y - from.y) * t) * height);
      ctx.stroke();
    }
  });
  path.forEach((nodeIndex, i) => {
    if (i > reach) return;
    const node = scene.graph.nodes[nodeIndex];
    drawGlow(surface, node.x * width, node.y * height, node.radius * config.nodeScale + 2, bright, frame.pathAlpha * config.pulseAlpha * visibility(node.x));
  });
}

function drawSearch(surface: Surface, scene: Scene, config: VariantConfig, forcedElapsedMs?: number) {
  const active = scene.search;
  if (!active) return;
  const elapsed = forcedElapsedMs ?? scene.clockMs - active.startedAtMs;
  const frame = searchFrame(active.result, elapsed);
  drawExplored(surface, scene, active, frame, config);
  drawPath(surface, scene, active, frame, config);
}

export function drawScene(ctx: CanvasRenderingContext2D, scene: Scene, config: VariantConfig, width: number, height: number) {
  const surface = { ctx, width, height };
  ctx.clearRect(0, 0, width, height);
  drawGlyphs(surface, scene, config);
  drawEdges(surface, scene, config);
  drawNodes(surface, scene, config);
  drawSearch(surface, scene, config);
}

/** One still frame for reduced motion: a finished search with its path lit. */
export function drawStaticScene(ctx: CanvasRenderingContext2D, scene: Scene, config: VariantConfig, width: number, height: number) {
  if (!scene.search) startSearch(scene, config);
  const active = scene.search;
  const elapsed = active ? active.result.levels.length * LEVEL_MS + PATH_MS : 0;
  const surface = { ctx, width, height };
  ctx.clearRect(0, 0, width, height);
  drawGlyphs(surface, scene, config);
  drawEdges(surface, scene, config);
  drawNodes(surface, scene, config);
  drawSearch(surface, scene, config, elapsed);
}

/** Left-to-right mask (desktop) that fades the graph out behind the text column. */
export const maskGradient = (rgb: Rgb) =>
  `linear-gradient(to right, ${rgba(rgb, 0.97)} 0%, ${rgba(rgb, 0.88)} 32%, ${rgba(rgb, 0.4)} 62%, ${rgba(rgb, 0)} 100%)`;

/** Flat mask for narrow screens, where text spans the whole width. */
export const flatMask = (rgb: Rgb) => rgba(rgb, 0.7);
