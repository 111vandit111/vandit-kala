import { describe, expect, it } from "vitest";
import {
  bfsSearch,
  buildGraph,
  createRandom,
  FADE_MS,
  LEVEL_MS,
  PATH_MS,
  pickSearch,
  searchFrame,
  stepNodes,
} from "../heroGraph";

/** 0-1-2-3-4 chain with a 0-5-4 shortcut. */
const SHORTCUT_GRAPH = [[1, 5], [0, 2], [1, 3], [2, 4], [3, 5], [0, 4], []];

describe("buildGraph", () => {
  it("is deterministic for a seed and fully connected", () => {
    const first = buildGraph(40, 1.8, 7);
    const second = buildGraph(40, 1.8, 7);
    expect(second.edges).toEqual(first.edges);
    expect(first.nodes).toHaveLength(40);
    const reached = bfsSearch(first.adjacency, 0, 39);
    expect(reached.path).not.toBeNull();
    first.nodes.forEach((_, target) => expect(bfsSearch(first.adjacency, 0, target).path).not.toBeNull());
  });

  it("has no self loops or duplicate edges", () => {
    const { edges } = buildGraph(60, 0.6, 3);
    const keys = edges.map(([a, b]) => `${a}-${b}`);
    expect(new Set(keys).size).toBe(keys.length);
    edges.forEach(([a, b]) => expect(a).toBeLessThan(b));
  });
});

describe("bfsSearch", () => {
  it("finds the shortest path by hop count", () => {
    const result = bfsSearch(SHORTCUT_GRAPH, 0, 4);
    expect(result.path).toEqual([0, 5, 4]);
    expect(result.levels[0]).toEqual([0]);
    expect(result.depth[4]).toBe(2);
  });

  it("returns a null path when the target is unreachable", () => {
    const result = bfsSearch(SHORTCUT_GRAPH, 0, 6);
    expect(result.path).toBeNull();
    expect(result.depth[6]).toBe(-1);
  });

  it("handles source equal to target", () => {
    expect(bfsSearch(SHORTCUT_GRAPH, 2, 2).path).toEqual([2]);
  });
});

describe("pickSearch", () => {
  it("returns a search whose path respects the minimum hops when possible", () => {
    const graph = buildGraph(50, 1.8, 11);
    const search = pickSearch(graph, createRandom(5), 4);
    expect(search?.path).not.toBeNull();
    expect((search?.path?.length ?? 0) - 1).toBeGreaterThanOrEqual(4);
  });
});

describe("stepNodes", () => {
  it("keeps drifting nodes inside the hero bounds", () => {
    const { nodes } = buildGraph(30, 1.5, 2);
    for (let i = 0; i < 2000; i += 1) stepNodes(nodes, 0.5, 2);
    nodes.forEach((node) => {
      expect(node.x).toBeGreaterThanOrEqual(-0.031);
      expect(node.x).toBeLessThanOrEqual(1.031);
      expect(node.y).toBeGreaterThanOrEqual(-0.031);
      expect(node.y).toBeLessThanOrEqual(1.031);
    });
  });
});

describe("searchFrame", () => {
  const search = bfsSearch(SHORTCUT_GRAPH, 0, 4);
  const expandEnd = search.levels.length * LEVEL_MS;

  it("expands the frontier, glows the path, then fades out", () => {
    const early = searchFrame(search, LEVEL_MS);
    expect(early.frontier).toBeCloseTo(1);
    expect(early.pathProgress).toBe(0);
    expect(early.exploreAlpha).toBe(1);

    const glowing = searchFrame(search, expandEnd + PATH_MS / 2);
    expect(glowing.pathProgress).toBeCloseTo(0.5);
    expect(glowing.pathAlpha).toBe(1);

    const fading = searchFrame(search, expandEnd + PATH_MS + FADE_MS / 2);
    expect(fading.pathAlpha).toBeCloseTo(0.5);
    expect(fading.isDone).toBe(false);

    expect(searchFrame(search, expandEnd + PATH_MS + FADE_MS).isDone).toBe(true);
  });

  it("never lets the frontier pass the last BFS level", () => {
    expect(searchFrame(search, 1e6).frontier).toBe(search.levels.length - 1);
  });
});
