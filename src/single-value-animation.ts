import { ensureInteger, ensurePositiveNumber, calculateFrameFraction } from "./helpers";
import { ValueAnimation } from "./value-animation";

export class SingleValueAnimation extends ValueAnimation<number> {
  constructor(value: number) {
    super(value);
  }
  to(to: number, duration: number, easing = this.valueAnimationSettings.defaultEasing): SingleValueAnimation {
    ensureInteger(to);
    ensurePositiveNumber(duration);
    const delta = to - this.initialValue;
    if (delta === 0) return this;
    let currentFraction = 0;
    const initial = this.initialValue;
    const fraction = calculateFrameFraction(duration);
    this.actions.push(() => {
      const value = initial + (easing(currentFraction += fraction) * delta)
      const roundedValue = Math.round(value);
      return {
        isLast: roundedValue === Math.round(to),
        value: roundedValue
      };
    });
    this.initialValue = Math.round(to);
    return this;
  }
}
