import { Point } from "./types";
import { ensureInteger, ensurePoint } from "./helpers";
import { AnimationBase } from "./animation-base";
import { SingleValueAnimation } from "./single-value-animation";
import { PointValueAnimation } from "./point-value-animation";
import { ChainedAnimation } from "./chained-animation";
export {
  swing,
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint
} from "./easings";

export function from(value: number) {
  ensureInteger(value);
  return new SingleValueAnimation(value);
}

export function fromPoint(value: Point) {
  ensurePoint(value);
  return new PointValueAnimation(value);
}

export function chain(...groups: AnimationBase[]) {
  return new ChainedAnimation(groups);
}
