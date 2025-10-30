import '@testing-library/jest-dom';

// Suppress act() warnings in tests caused by async useEffect
const consoleError = console.error;
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((...args) => {
    if (/not wrapped in act/.test(args[0])) return;
    consoleError(...args);
  });
});

// ✅ Polyfill ResizeObserver (used by Recharts)
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as any).ResizeObserver = ResizeObserver;

// // ✅ Silence Recharts “width(0)” warnings (harmless in jsdom)
// const originalWarn = console.warn;
// console.warn = (...args) => {
//   if (typeof args[0] === "string" && args[0].includes("The width(0) and height(0)")) return;
//   originalWarn(...args);
// };

// // ✅ Optional: silence React 18 act() warnings during async renders
// const originalError = console.error;
// console.error = (...args) => {
//   if (
//     typeof args[0] === "string" &&
//     (args[0].includes("act(") || args[0].includes("Warning: An update to"))
//   )
//     return;
//   originalError(...args);
// };