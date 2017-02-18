import * as helpers from "./helpers";
import * as types from "./types";
import * as constants from "./constants";
import { AnimationBase } from "./animation-base";
import { SingleValueAnimation } from "./single-value-animation";
import { PointValueAnimation } from "./point-value-animation";
import { ChainedAnimation } from "./chained-animation";
export { swing, linear, easeInQuad, easeOutQuad, easeInOutQuad, easeInCubic, easeOutCubic, easeInOutCubic, easeInQuart, easeOutQuart, easeInOutQuart, easeInQuint, easeOutQuint, easeInOutQuint } from "./easings";

export function from(value: number) {
  helpers.ensureInteger(value);
  return new SingleValueAnimation(value);
}

export function fromPoint(value: types.Point) {
  helpers.ensurePoint(value);
  return new PointValueAnimation(value);
}

export function chain(...groups: AnimationBase[]) {
  return new ChainedAnimation(groups);
}
