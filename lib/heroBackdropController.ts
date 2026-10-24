import { createScene, drawScene, drawStaticScene, stepScene, VARIANTS, type HeroBackdropVariant, type Scene } from "./heroBackdropScene";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const MAX_PIXEL_RATIO = 2;
const FRAME_INTERVAL_MS = 33;
const MAX_STEP_MS = 100;
const PIXELS_PER_NODE = 16000;
const MIN_NODES = 26;
const MAX_NODES = 64;
const GRAPH_SEED = 20240611;

const nodeCountFor = (width: number, height: number) =>
  Math.min(MAX_NODES, Math.max(MIN_NODES, Math.round((width * height) / PIXELS_PER_NODE)));

/**
 * Runs the backdrop on a canvas and returns a cleanup function.
 * Animation only runs while the tab is visible, the hero is on screen and motion is allowed.
 */
export function startHeroBackdrop(canvas: HTMLCanvasElement, host: HTMLElement, variant: HeroBackdropVariant): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => undefined;

  const config = VARIANTS[variant];
  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
  let scene: Scene | null = null;
  let width = 0;
  let height = 0;
  let frameId = 0;
  let lastFrameAt = 0;
  let isOnscreen = true;

  const shouldAnimate = () => !reducedMotion.matches && isOnscreen && !document.hidden;

  const paintStill = () => {
    if (!scene || width === 0) return;
    if (reducedMotion.matches) drawStaticScene(ctx, scene, config, width, height);
    else drawScene(ctx, scene, config, width, height);
  };

  const tick = (now: number) => {
    frameId = 0;
    if (!shouldAnimate() || !scene) return;
    frameId = requestAnimationFrame(tick);
    const elapsed = now - lastFrameAt;
    if (elapsed < FRAME_INTERVAL_MS) return;
    lastFrameAt = now;
    stepScene(scene, Math.min(elapsed, MAX_STEP_MS), config);
    drawScene(ctx, scene, config, width, height);
  };

  const sync = () => {
    if (shouldAnimate()) {
      if (frameId === 0) {
        lastFrameAt = performance.now();
        frameId = requestAnimationFrame(tick);
      }
      return;
    }
    cancelAnimationFrame(frameId);
    frameId = 0;
    paintStill();
  };

  const resize = () => {
    const nextWidth = host.clientWidth;
    const nextHeight = host.clientHeight;
    if (nextWidth === 0 || nextHeight === 0) return;
    const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
    width = nextWidth;
    height = nextHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = nodeCountFor(width, height);
    if (!scene || scene.graph.nodes.length !== count) scene = createScene(variant, count, width / height, GRAPH_SEED);
    paintStill();
    sync();
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const intersectionObserver = new IntersectionObserver((entries) => {
    isOnscreen = entries[entries.length - 1].isIntersecting;
    sync();
  });
  intersectionObserver.observe(host);
  document.addEventListener("visibilitychange", sync);
  reducedMotion.addEventListener("change", sync);
  resize();

  return () => {
    cancelAnimationFrame(frameId);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    document.removeEventListener("visibilitychange", sync);
    reducedMotion.removeEventListener("change", sync);
  };
}
