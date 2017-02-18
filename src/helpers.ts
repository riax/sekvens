import * as types from "./types";
import { FPS_INTERVAL } from "./constants";

export let rAF = window.requestAnimationFrame || requestAnimationFrameShim;

export function calculateFrameFraction(duration: number) {
  let numberOfSteps = Math.max(snapToFPSInterval(duration), FPS_INTERVAL) / FPS_INTERVAL;
  return 1 / numberOfSteps;
}

export function snapToFPSInterval(duration: number) {
  return Math.round(duration / FPS_INTERVAL) * FPS_INTERVAL;
}

export function requestAnimationFrameShim(ticker: () => void) {
  return setTimeout(() => {
    ticker();
  }, FPS_INTERVAL);
}

export function ensurePoint(input: any) {
  let isObject = typeof input === "object";
  if (!isObject || typeof input.x !== "number" || typeof input.y !== "number")
    throwTypeError("point", isObject ? JSON.stringify(input) : typeof input);
}

export function ensureFunction(input: any) {
  if (typeof input !== "function")
    throwTypeError("function", typeof input);
}

export function ensureInteger(input: any) {
  if (typeof input !== "number" || input % 1 !== 0)
    throwTypeError("integer", input);
}

export function ensurePositiveNumber(input: any) {
  ensureInteger(input);
  if (input < 0)
    throwTypeError("positive number", input);
}

export function throwTypeError(expected: string, got: string) {
  throw `Expeted ${expected}, but got ${got}`;
}
