import "@testing-library/jest-dom/vitest";

Object.defineProperty(window, "matchMedia", { writable: true, value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) });
HTMLCanvasElement.prototype.getContext = () => ({ clearRect() {}, setTransform() {}, save() {}, restore() {}, translate() {}, rotate() {}, beginPath() {}, arc() {}, fill() {}, stroke() {}, fillText() {} });
