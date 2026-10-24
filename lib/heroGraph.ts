/** Pure graph and path-finding logic behind the hero backdrop (no DOM, so it is unit-testable). */

export type Random = () => number;

export interface GraphNode {
  /** Normalised position, 0..1 across the hero. */
  x: number;
  y: number;
  /** Normalised units per second. */
  vx: number;
  vy: number;
  /** Base radius in css px. */
  radius: number;
  /** Random phase offset for wobble animations. */
  phase: number;
  colorIndex: number;
}

export interface HeroGraph {
  nodes: GraphNode[];
  edges: [number, number][];
  adjacency: number[][];
}

export interface SearchResult {
  source: number;
  target: number;
  /** Nodes discovered per BFS depth; levels[0] is the source. */
  levels: number[][];
  /** Depth per node, -1 when not reached before the target was found. */
  depth: number[];
  /** Source to target node indices, or null when the target is unreachable. */
  path: number[] | null;
}

export interface SearchFrame {
  /** Fractional BFS depth the frontier has reached. */
  frontier: number;
  /** 0..1 progress of the glowing shortest path. */
  pathProgress: number;
  /** Opacity of the explored (non-path) edges. */
  exploreAlpha: number;
  /** Opacity of the shortest path. */
  pathAlpha: number;
  isDone: boolean;
}

const NEAREST_NEIGHBOURS = 2;
const EXTRA_NEIGHBOUR_CHANCE = 0.45;
const RIGHT_BIAS_EXPONENT = 0.65;
const MIN_NODE_RADIUS = 1.6;
const NODE_RADIUS_RANGE = 1.6;
const MAX_NODE_SPEED = 0.011;
const MIN_NODE_SPEED = 0.003;
const EDGE_OVERSHOOT = 0.03;
const SOURCE_MIN_X = 0.3;
const PICK_ATTEMPTS = 40;
export const MIN_PATH_HOPS = 4;

export const LEVEL_MS = 170;
export const PATH_MS = 950;
export const FADE_MS = 700;

/** Small deterministic PRNG so a given seed always builds the same graph. */
export function createRandom(seed: number): Random {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const distance = (a: GraphNode, b: GraphNode, aspect: number) => Math.hypot((a.x - b.x) * aspect, a.y - b.y);

function createNodes(count: number, colorCount: number, random: Random): GraphNode[] {
  return Array.from({ length: count }, () => {
    const angle = random() * Math.PI * 2;
    const speed = MIN_NODE_SPEED + random() * (MAX_NODE_SPEED - MIN_NODE_SPEED);
    return {
      x: Math.pow(random(), RIGHT_BIAS_EXPONENT),
      y: random(),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: MIN_NODE_RADIUS + random() * NODE_RADIUS_RANGE,
      phase: random() * Math.PI * 2,
      colorIndex: Math.floor(random() * colorCount),
    };
  });
}

function connectNearest(nodes: GraphNode[], aspect: number, random: Random, link: (a: number, b: number) => void) {
  nodes.forEach((node, index) => {
    const byDistance = nodes
      .map((other, otherIndex) => ({ otherIndex, d: distance(node, other, aspect) }))
      .filter((entry) => entry.otherIndex !== index)
      .sort((a, b) => a.d - b.d);
    const wanted = NEAREST_NEIGHBOURS + (random() < EXTRA_NEIGHBOUR_CHANCE ? 1 : 0);
    byDistance.slice(0, wanted).forEach((entry) => link(index, entry.otherIndex));
  });
}

function componentsOf(adjacency: number[][]): number[] {
  const component = new Array<number>(adjacency.length).fill(-1);
  let count = 0;
  adjacency.forEach((_, start) => {
    if (component[start] !== -1) return;
    const stack = [start];
    component[start] = count;
    while (stack.length > 0) {
      const current = stack.pop() as number;
      adjacency[current].forEach((next) => {
        if (component[next] === -1) {
          component[next] = count;
          stack.push(next);
        }
      });
    }
    count += 1;
  });
  return component;
}

function joinComponents(nodes: GraphNode[], adjacency: number[][], aspect: number, link: (a: number, b: number) => void) {
  for (let guard = 0; guard < nodes.length; guard += 1) {
    const component = componentsOf(adjacency);
    let best: { a: number; b: number; d: number } | null = null;
    nodes.forEach((a, i) => {
      nodes.forEach((b, j) => {
        if (j <= i || component[i] === component[j]) return;
        const d = distance(a, b, aspect);
        if (!best || d < best.d) best = { a: i, b: j, d };
      });
    });
    if (!best) return;
    const { a, b } = best as { a: number; b: number };
    link(a, b);
  }
}

/** Builds a connected, right-biased proximity graph. `aspect` is width / height. */
export function buildGraph(count: number, aspect: number, seed: number, colorCount = 1): HeroGraph {
  const random = createRandom(seed);
  const nodes = createNodes(count, colorCount, random);
  const adjacency: number[][] = nodes.map(() => []);
  const edges: [number, number][] = [];
  const link = (a: number, b: number) => {
    if (a === b || adjacency[a].includes(b)) return;
    adjacency[a].push(b);
    adjacency[b].push(a);
    edges.push([Math.min(a, b), Math.max(a, b)]);
  };
  connectNearest(nodes, aspect, random, link);
  joinComponents(nodes, adjacency, aspect, link);
  return { nodes, edges, adjacency };
}

/** Drifts nodes and bounces them off the (slightly overshot) hero edges. */
export function stepNodes(nodes: GraphNode[], dtSeconds: number, speedScale = 1) {
  const min = -EDGE_OVERSHOOT;
  const max = 1 + EDGE_OVERSHOOT;
  nodes.forEach((node) => {
    node.x += node.vx * dtSeconds * speedScale;
    node.y += node.vy * dtSeconds * speedScale;
    if (node.x < min || node.x > max) {
      node.vx = -node.vx;
      node.x = Math.min(max, Math.max(min, node.x));
    }
    if (node.y < min || node.y > max) {
      node.vy = -node.vy;
      node.y = Math.min(max, Math.max(min, node.y));
    }
  });
}

/** Breadth-first search that stops as soon as the target is discovered. */
export function bfsSearch(adjacency: number[][], source: number, target: number): SearchResult {
  const depth = new Array<number>(adjacency.length).fill(-1);
  const parent = new Array<number>(adjacency.length).fill(-1);
  const levels: number[][] = [[source]];
  depth[source] = 0;
  let isFound = source === target;
  while (!isFound) {
    const current = levels[levels.length - 1];
    const next: number[] = [];
    for (const node of current) {
      for (const neighbour of adjacency[node]) {
        if (depth[neighbour] !== -1) continue;
        depth[neighbour] = levels.length;
        parent[neighbour] = node;
        next.push(neighbour);
        if (neighbour === target) isFound = true;
      }
      if (isFound) break;
    }
    if (next.length === 0) break;
    levels.push(next);
  }
  return { source, target, levels, depth, path: isFound ? tracePath(parent, source, target) : null };
}

function tracePath(parent: number[], source: number, target: number): number[] {
  const path = [target];
  while (path[0] !== source) path.unshift(parent[path[0]]);
  return path;
}

/** Picks a source (right of the text column) and a target at least MIN_PATH_HOPS away. */
export function pickSearch(graph: HeroGraph, random: Random, minHops = MIN_PATH_HOPS): SearchResult | null {
  const { nodes, adjacency } = graph;
  if (nodes.length < 2) return null;
  const sources = nodes.map((node, index) => ({ node, index })).filter(({ node }) => node.x >= SOURCE_MIN_X);
  const pool = sources.length > 0 ? sources : nodes.map((node, index) => ({ node, index }));
  let fallback: SearchResult | null = null;
  for (let attempt = 0; attempt < PICK_ATTEMPTS; attempt += 1) {
    const source = pool[Math.floor(random() * pool.length)].index;
    const target = Math.floor(random() * nodes.length);
    if (source === target) continue;
    const result = bfsSearch(adjacency, source, target);
    if (!result.path) continue;
    if (result.path.length - 1 >= minHops) return result;
    if (!fallback || result.path.length > (fallback.path?.length ?? 0)) fallback = result;
  }
  return fallback;
}

export const searchDurationMs = (search: SearchResult) => search.levels.length * LEVEL_MS + PATH_MS + FADE_MS;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** Where an animated search is `elapsedMs` after it started: expand, glow the path, fade. */
export function searchFrame(search: SearchResult, elapsedMs: number): SearchFrame {
  const expandEnd = search.levels.length * LEVEL_MS;
  const pathEnd = expandEnd + PATH_MS;
  const total = pathEnd + FADE_MS;
  const pathProgress = clamp01((elapsedMs - expandEnd) / PATH_MS);
  return {
    frontier: Math.min(search.levels.length - 1, Math.max(0, elapsedMs / LEVEL_MS)),
    pathProgress,
    exploreAlpha: elapsedMs < expandEnd ? 1 : 1 - pathProgress,
    pathAlpha: elapsedMs < pathEnd ? 1 : clamp01(1 - (elapsedMs - pathEnd) / FADE_MS),
    isDone: elapsedMs >= total,
  };
}
