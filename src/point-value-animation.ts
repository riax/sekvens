import * as helpers from "./helpers";
import * as types from "./types";
import { ValueAnimation } from "./value-animation";

export class PointValueAnimation extends ValueAnimation<types.Point>{
  constructor(value: types.Point) {
    super(value);
  }
  to(to: types.Point, duration: number, easing = this.valueAnimationSettings.defaultEasing) : PointValueAnimation {
    helpers.ensurePoint(to);
    helpers.ensurePositiveNumber(duration);
    let deltaX = to.x - this.initialValue.x;
    let deltaY = to.y - this.initialValue.y;
    if(deltaX === 0 && deltaY === 0) return this;
    let currentFraction = 0;
    let initial = this.initialValue;
    let fraction = helpers.calculateFrameFraction(duration);
    this.actions.push(() => {
      let easedFraction = easing(currentFraction += fraction);
      let x = initial.x + (easedFraction * deltaX)
      let y = initial.y + (easedFraction * deltaY)
      let roundedValue = { x: Math.round(x), y: Math.round(y)};
      return {
        isLast: roundedValue.x === Math.round(to.x) && roundedValue.y === Math.round(to.y),
        value: roundedValue
      };
    });
    this.initialValue = { x: Math.round(to.x), y: Math.round(to.y) };
    return this;
  }
}