import * as helpers from "./helpers";
import * as types from "./types";
import * as constants from "./constants";
import { AnimationBase, OnStepComplete } from "./animation-base";
import { easeInOutCubic } from "./easings";
export abstract class ValueAnimation<T> extends AnimationBase {
  protected onStepComplete: OnStepComplete<T>;
  protected sequence: T[] = null;
  protected actions: types.IAction<T>[] = [];
  protected initialValue: T;
  protected valueAnimationSettings: types.ValueAnimationSettings = { defaultEasing: easeInOutCubic };
  private isTicking: boolean;
  constructor(value: T) {
    super();
    this.initialValue = value;
  }
  stop() {
    this.stopAnimation();
  }
  on(onStepComplete: OnStepComplete<T>): ValueAnimation<T> {
    helpers.ensureFunction(onStepComplete);
    this.onStepComplete = onStepComplete;
    return this;
  }
  go(onGoComplete?: types.Command) {
    onGoComplete && helpers.ensureFunction(onGoComplete);
    let repeatCount = 0;
    let index = 0;
    this.sequence = this.sequence || this.createSequence(this.actions);
    this.startAnimation(() => {
      const value = this.sequence[index++]
      if (value !== undefined) {
        if (value !== null) {
          this.onStepComplete && this.onStepComplete(value, this);
        }
      } else {
        if (++repeatCount < this.numberOfRepeats) {
          index = 0;
        } else {
          this.executeOnComplete();
          !!onGoComplete && onGoComplete();
          return false;
        }
      }
      return true;
    });
  }
  settings(settings: types.ValueAnimationSettings): ValueAnimation<T> {
    this.valueAnimationSettings.defaultEasing = settings.defaultEasing;
    return this;
  }
  wait(duration: number): ValueAnimation<T> {
    helpers.ensurePositiveNumber(duration);
    const numberOfSteps = helpers.snapToFPSInterval(duration) / constants.FPS_INTERVAL;
    if (numberOfSteps === 0) return this;
    let stepCount = 0;
    this.actions.push(() => {
      return {
        isLast: stepCount++ === numberOfSteps,
        value: null
      };
    });
    return this;
  }
  protected createSequence(actions: types.IAction<T>[]) {
    const values: T[] = [];
    for (const action of actions) {
      let isLast: boolean;
      do {
        const result = action()
        values.push(result.value);
        isLast = result.isLast;
      } while (!isLast)
    }
    return values;
  }
  protected startAnimation(onTick: () => boolean) {
    this.isTicking = true;
    const ticker = () => {
      if (onTick() && this.isTicking) {
        helpers.rAF(ticker);
      };
    };
    helpers.rAF(ticker);
  }
  protected stopAnimation() {
    this.isTicking = false;
  }
}
