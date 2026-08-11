import { useEffect, useRef } from "react";

const EMOJIS = ["😀", "😃", "😄", "😁", "😆", "🙂", "😎", "🤩", "🥳"];
export const GRAVITY = 1.5;
export const RESTITUTION = 0.8;
export const ITERATIONS = 3;

export function clamp(value, min, max) { return Math.max(min, Math.min(value, max)); }

export function targetCount(width, height) {
  const square = Math.sqrt(width * height);
  const maximum = clamp(Math.ceil(square / 120) * 25 - 25, 50, 250);
  return Math.ceil(clamp(square < 800 ? 36 : square / 16, 25, maximum));
}

export function elasticityFor(sensitivity) { return clamp(Number(sensitivity) / 50, 0.1, 2); }

export function force(body, fx, fy) {
  body.x += fx;
  body.y += fy;
  body.angle += (body.x - body.px) / body.radius * 36;
  const x = body.x * 2 - body.px;
  const y = body.y * 2 - body.py;
  body.px = body.x;
  body.py = body.y;
  body.x = x;
  body.y = y;
}

export function collideBodies(bodies) {
  for (let index = 0; index < bodies.length; index += 1) {
    const body = bodies[index];
    for (let otherIndex = 0; otherIndex < bodies.length; otherIndex += 1) {
      if (otherIndex === index) continue;
      const other = bodies[otherIndex];
      const x = body.x - other.x;
      const y = body.y - other.y;
      const distance = Math.sqrt(x * x + y * y);
      if (distance < body.radius + other.radius) {
        if (distance > 0) {
          const overlap = distance - body.radius - other.radius;
          body.x -= x * overlap / distance / 2;
          body.y -= y * overlap / distance / 2;
          other.x += x * overlap / distance / 2;
          other.y += y * overlap / distance / 2;
        } else {
          body.x += Math.random();
          body.y -= Math.random();
        }
      }
    }
  }
}

export function constrainBodies(scene) {
  for (const body of scene.bodies) {
    const px = body.px - body.x;
    const py = body.py - body.y;
    if (body.x < body.radius) { body.x = body.radius; body.px = body.x - px * RESTITUTION; }
    else if (body.x > scene.width - body.radius) { body.x = scene.width - body.radius; body.px = body.x - px * RESTITUTION; }
    if (body.y < body.radius) { body.y = body.radius; body.py = body.y - py * RESTITUTION; }
    else if (body.y > scene.height - body.radius) { body.y = scene.height - body.radius; body.py = body.y - py * RESTITUTION; }
  }
}

export function stepPhysics(scene, frameScale, volume = 0) {
  const forceScale = (frameScale / 3) ** 2;
  if (volume > 0) {
    const impulse = Math.abs(volume) / frameScale * forceScale * scene.elasticity;
    for (const body of scene.bodies) if (body.y > scene.height - body.radius * 2) force(body, 0, -impulse - Math.random());
  }
  for (let substep = 0; substep < ITERATIONS; substep += 1) {
    for (const body of scene.bodies) force(body, 0, GRAVITY * forceScale);
    collideBodies(scene.bodies);
    constrainBodies(scene);
  }
}

function placeBody(scene, radius, index) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const x = radius + Math.random() * Math.max(0, scene.width - radius * 2);
    const y = radius + Math.random() * Math.max(0, scene.height - radius * 2);
    if (!scene.bodies.some((body) => Math.hypot(body.x - x, body.y - y) < body.radius + radius)) {
      return { x, y, px: x + (Math.random() - 0.5) * 2, py: y + (Math.random() - 0.5), radius, emoji: EMOJIS[index % EMOJIS.length], angle: Math.random() * 360 };
    }
  }
  return null;
}

function syncBodies(scene) {
  const count = targetCount(scene.width, scene.height);
  const radius = Math.sqrt(scene.width * scene.height) < 800 ? 22 : 28;
  scene.bodies.length = Math.min(scene.bodies.length, count);
  while (scene.bodies.length < count) {
    const body = placeBody(scene, radius, scene.bodies.length);
    if (!body) break;
    scene.bodies.push(body);
  }
  scene.bodies.forEach((body) => {
    body.radius = radius;
    body.x = clamp(body.x, radius, scene.width - radius);
    body.y = clamp(body.y, radius, scene.height - radius);
  });
  for (let iteration = 0; iteration < ITERATIONS; iteration += 1) {
    collideBodies(scene.bodies);
    constrainBodies(scene);
  }
  scene.bodies.forEach((body) => { body.px = body.x; body.py = body.y; });
}

export function useEmojiPhysics(canvasRef, { volume = 0, sensitivity }) {
  const sceneRef = useRef({ bodies: [], volume: 0, elasticity: 1, width: 1, height: 1, last: 0, fps: 60 });

  useEffect(() => {
    sceneRef.current.volume = Number(volume) || 0;
    sceneRef.current.elasticity = elasticityFor(sensitivity);
  }, [volume, sensitivity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const scene = sceneRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = navigator.standalone !== undefined;
    function resize() {
      const bounds = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      scene.width = Math.max(1, bounds.width); scene.height = Math.max(1, bounds.height);
      canvas.width = Math.round(scene.width * ratio); canvas.height = Math.round(scene.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0); syncBodies(scene);
      canvas.dataset.emojiCount = String(scene.bodies.length);
    }
    function frame(now) {
      const frameMs = now - (scene.last || now);
      scene.last = now;
      if (frameMs > 0) scene.fps += (1000 / frameMs - scene.fps) / 4;
      const frameScale = 60 / clamp(scene.fps, 30, isMobile ? 120 : 60);
      context.clearRect(0, 0, scene.width, scene.height);
      if (!reduced) stepPhysics(scene, frameScale, scene.volume);
      context.font = `${scene.bodies[0]?.radius * 2 || 44}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
      context.textAlign = "center"; context.textBaseline = "middle";
      scene.bodies.forEach((body) => { context.save(); context.translate(body.x, body.y + 1); context.rotate(body.angle * Math.PI / 180); context.fillText(body.emoji, 0, 0); context.restore(); });
      scene.frame = requestAnimationFrame(frame);
    }
    resize();
    const observer = "ResizeObserver" in window ? new ResizeObserver(resize) : null;
    observer?.observe(canvas.parentElement); window.addEventListener("resize", resize); scene.frame = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(scene.frame); observer?.disconnect(); window.removeEventListener("resize", resize); };
  }, [canvasRef]);
}
