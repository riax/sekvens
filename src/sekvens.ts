import * as types from "./types";
import * as constants from "./constants";
import { ensureInteger, ensurePoint } from "./helpers";
import { AnimationBase } from "./animation-base";
import { SingleValueAnimation } from "./single-value-animation";
import { PointValueAnimation } from "./point-value-animation";
import { ChainedAnimation } from "./chained-animation";
export { swing, linear, easeInQuad, easeOutQuad, easeInOutQuad, easeInCubic, easeOutCubic, easeInOutCubic, easeInQuart, easeOutQuart, easeInOutQuart, easeInQuint, easeOutQuint, easeInOutQuint } from "./easings";

export function from(value: number) {
  ensureInteger(value);
  return new SingleValueAnimation(value);
}

export function fromPoint(value: types.Point) {
  ensurePoint(value);
  return new PointValueAnimation(value);
}

export function chain(...groups: AnimationBase[]) {
  return new ChainedAnimation(groups);
}
