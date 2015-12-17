export interface IAction<T> { (): { isLast: boolean; value: T; }};
export type OnStepComplete<T> = (result: T, sekvens: AnimationBase) => void;
export type Command = () => void;
export type Point = { x: number, y: number };
export type EasingFunction = (t: number) => number;
export type ValueAnimationSettings = { defaultEasing?: EasingFunction }
export let swing = (t: number) => 0.5 - Math.cos(t * Math.PI) / 2
export let linear = (t: number) => t;
export let easeInQuad = (t: number) => t * t;
export let easeOutQuad = (t: number) => t * (2 - t);
export let easeInOutQuad = (t: number) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
export let easeInCubic = (t: number) => t * t * t;
export let easeOutCubic = (t: number) => (--t) * t * t + 1;
export let easeInOutCubic = (t: number) => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
export let easeInQuart = (t: number) => t * t * t * t;
export let easeOutQuart = (t: number) => 1 - (--t) * t * t * t;
export let easeInOutQuart = (t: number) => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
export let easeInQuint = (t: number) => t * t * t * t * t;
export let easeOutQuint = (t: number) => 1 + (--t) * t * t * t * t;
export let easeInOutQuint = (t: number) => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
const FPS_INTERVAL = 1000 / 60;
let rAF = window.requestAnimationFrame || requestAnimationFrameShim;

export function from(value: number) {
  return new SingleValueAnimation(value);
}

export function fromPoint(value: Point) {
  return new PointValueAnimation(value);
}

export function chain(...groups: AnimationBase[]) {
  return new ChainedAnimation(groups);
}

export abstract class AnimationBase {
  protected numberOfRepeats = 0;
  private onCompleteCallbacks: Command[] = [];
  abstract stop(): void;
  abstract go(onDone?: Command): void;
  repeat(count: number = Number.MAX_VALUE) {
    this.numberOfRepeats = count;
    return <AnimationBase>this;
  }
  done(onComplete: Command) {
    this.onCompleteCallbacks.push(onComplete);
    return <AnimationBase>this;
  }
  protected executeOnComplete() {
    for (let callback of this.onCompleteCallbacks) {
      callback();
    }
  }
}

export class ChainedAnimation extends AnimationBase {
  private currentIndex = 0;
  constructor(private groups: AnimationBase[]) {
    super();
  }
  go(onGoComplete?: Command) {
    let repeatCount = 0;
    let execute = (index: number) => {
      let animation = this.groups[index];
      animation.go(() => {
        let nextIndex = index + 1;
        let shouldRepeat = repeatCount++ < this.numberOfRepeats;
        if (this.groups[nextIndex] !== undefined) {
          execute(nextIndex);
        } else {
          if (shouldRepeat) {
            execute(0);
          } else {
            onGoComplete && onGoComplete();
            this.executeOnComplete();
          }
          return;
        }
      });
      this.currentIndex = index;
    }
    this.groups.length > 0 && execute(0);
  }
  stop() {
    this.groups[this.currentIndex].stop();
  }
}

export abstract class ValueAnimation<T> extends AnimationBase {
  protected onStepComplete: OnStepComplete<T>;
  protected sequence: T[] = null;  
  protected actions: IAction<T>[] = [];
  protected initialValue: T;
  protected valueAnimationSettings: ValueAnimationSettings = { defaultEasing: easeInOutCubic };
  private isTicking: boolean;
  constructor(value: T){
    super();
    this.initialValue = value; 
  }
  stop() {
    this.stopAnimation();
  }
  on(onStepComplete: OnStepComplete<T>) {
    this.onStepComplete = onStepComplete;
    return <ValueAnimation<T>>this;
  }
  go(onGoComplete?: Command) {
    let repeatCount = 0;
    let index = 0;
    this.sequence = this.sequence || this.createSequence(this.actions);
    this.startAnimation(() => {
      let value = this.sequence[index++]
      if (value !== undefined) {
        if (value !== null) {
          this.onStepComplete && this.onStepComplete(value, this);
        }
      } else {
        if (++repeatCount < this.numberOfRepeats) {
          index = 0;
        } else {
          this.executeOnComplete();
          onGoComplete && onGoComplete();
          return false;
        }
      }
      return true;
    });
  }
  settings(settings: ValueAnimationSettings) {
    this.valueAnimationSettings.defaultEasing = settings.defaultEasing;
    return <ValueAnimation<T>>this;
  }
  wait(duration: number) {
    let steps = Math.floor(duration / FPS_INTERVAL);
    let stepCount = 0;
    this.actions.push(() => {
      return {
        isLast: stepCount++ === steps,
        value: null
      };
    });
    return <ValueAnimation<T>>this;
  }
  protected createSequence(actions: IAction<T>[]) {
    let values: T[] = [];
    for (let action of actions) {
      let isLast: boolean;
      do {
        let result = action()
        values.push(result.value);
        isLast = result.isLast;
      } while (!isLast)
    }
    return values;
  }
  public startAnimation(onTick: () => boolean) {
    this.isTicking = true;
    let ticker = () => {
      if(onTick() && this.isTicking){
        rAF(ticker);
      };
    };
    rAF(ticker);
  }
  public stopAnimation() {
    this.isTicking = false;
  }
}

export class SingleValueAnimation extends ValueAnimation<number> {
  constructor(value: number) {
    super(value);
  }
  to(to: number, duration: number, easing = this.valueAnimationSettings.defaultEasing) {
    let currentFraction = 0;
    let initial = this.initialValue;
    let steps = duration / FPS_INTERVAL;
    let fraction = 1 / steps;
    let delta = to - this.initialValue;
    this.actions.push(() => {
      let value = initial + (easing(currentFraction += fraction) * delta)
      let roundedValue = Math.round(value);
      return {
        isLast: roundedValue === to,
        value: roundedValue
      };
    });
    this.initialValue = Math.round(to);
    return <SingleValueAnimation>this;
  }
}

export class PointValueAnimation extends ValueAnimation<Point>{
  constructor(value: Point) {
    super(value);
  }
  to(to: Point, duration: number, easing = this.valueAnimationSettings.defaultEasing) {
    let currentFraction = 0;
    let initial = this.initialValue;
    let steps = duration / FPS_INTERVAL;
    let fraction = 1 / steps;
    let deltaX = to.x - this.initialValue.x;
    let deltaY = to.y - this.initialValue.y;
    this.actions.push(() => {
      let easedFraction = easing(currentFraction += fraction);
      let x = initial.x + (easedFraction * deltaX)
      let y = initial.y + (easedFraction * deltaY)
      let value = { x: Math.round(x), y: Math.round(y)};
      return {
        isLast: value.x === to.x && value.y === to.y,
        value: value
      };
    });
    this.initialValue = { x: Math.round(to.x), y: Math.round(to.y) };
    return <PointValueAnimation>this;
  }
}

function requestAnimationFrameShim(ticker: () => void) {
  return setTimeout(() => {
    ticker();
  }, FPS_INTERVAL);
}