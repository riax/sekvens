import { ensurePoint, ensurePositiveNumber, calculateFrameFraction} from "./helpers";
import { Point } from "./types";
import { ValueAnimation } from "./value-animation";

export class PointValueAnimation extends ValueAnimation<Point>{
  constructor(value: Point) {
    super(value);
  }
  to(to: Point, duration: number, easing = this.valueAnimationSettings.defaultEasing): PointValueAnimation {
    ensurePoint(to);
    ensurePositiveNumber(duration);
    const deltaX = to.x - this.initialValue.x;
    const deltaY = to.y - this.initialValue.y;
    if (deltaX === 0 && deltaY === 0) return this;
    let currentFraction = 0;
    const initial = this.initialValue;
    const fraction = calculateFrameFraction(duration);
    this.actions.push(() => {
      const easedFraction = easing(currentFraction += fraction);
      const x = initial.x + (easedFraction * deltaX)
      const y = initial.y + (easedFraction * deltaY)
      const roundedValue = { x: Math.round(x), y: Math.round(y) };
      return {
        isLast: roundedValue.x === Math.round(to.x) && roundedValue.y === Math.round(to.y),
        value: roundedValue
      };
    });
    this.initialValue = { x: Math.round(to.x), y: Math.round(to.y) };
    return this;
  }
}
