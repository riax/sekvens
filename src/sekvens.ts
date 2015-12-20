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
interface IValidator {
    (input:any): boolean;
    description: string;
}
const FPS_INTERVAL = 1000 / 60;
let rAF = window.requestAnimationFrame || requestAnimationFrameShim;

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

export abstract class AnimationBase {
  protected numberOfRepeats = 0;
  private onCompleteCallbacks: Command[] = [];
  abstract stop(): void;
  abstract go(onDone?: Command): void;
  repeat(count: number = Number.MAX_VALUE) : AnimationBase {
    this.numberOfRepeats = count;
    return this;
  }
  done(onComplete: Command) : AnimationBase {
    onComplete && ensureFunction(onComplete);
    this.onCompleteCallbacks.push(onComplete);
    return this;
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
    onGoComplete && ensureFunction(onGoComplete);
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
            !!onGoComplete && onGoComplete();
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
  on(onStepComplete: OnStepComplete<T>) : ValueAnimation<T> {
    ensureFunction(onStepComplete);
    this.onStepComplete = onStepComplete;
    return this;
  }
  go(onGoComplete?: Command) {
    onGoComplete && ensureFunction(onGoComplete);
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
          !!onGoComplete && onGoComplete();
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
  wait(duration: number) : ValueAnimation<T> {
    ensurePositiveNumber(duration);
    let steps = Math.floor(duration / FPS_INTERVAL);
    let stepCount = 0;
    this.actions.push(() => {
      return {
        isLast: stepCount++ === steps,
        value: null
      };
    });
    return this;
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
  protected startAnimation(onTick: () => boolean) {
    this.isTicking = true;
    let ticker = () => {
      if(onTick() && this.isTicking){
        rAF(ticker);
      };
    };
    rAF(ticker);
  }
  protected stopAnimation() {
    this.isTicking = false;
  }
}

export class SingleValueAnimation extends ValueAnimation<number> {
  constructor(value: number) {
    super(value);
  }
  to(to: number, duration: number, easing = this.valueAnimationSettings.defaultEasing) : SingleValueAnimation {
    ensureInteger(to);
    ensurePositiveNumber(duration);
    let delta = to - this.initialValue;
    if(delta === 0) return this;
    let currentFraction = 0;
    let initial = this.initialValue;
    let fraction = calculateFrameFraction(duration);
    this.actions.push(() => {
      let value = initial + (easing(currentFraction += fraction) * delta)
      let roundedValue = Math.round(value);
      return {
        isLast: roundedValue === Math.round(to),
        value: roundedValue
      };
    });
    this.initialValue = Math.round(to);
    return this;
  }
}

export class PointValueAnimation extends ValueAnimation<Point>{
  constructor(value: Point) {
    super(value);
  }
  to(to: Point, duration: number, easing = this.valueAnimationSettings.defaultEasing) : PointValueAnimation {
    ensurePoint(to);
    ensurePositiveNumber(duration);
    let deltaX = to.x - this.initialValue.x;
    let deltaY = to.y - this.initialValue.y;
    if(deltaX === 0 && deltaY === 0) return this;
    let currentFraction = 0;
    let initial = this.initialValue;
    let fraction = calculateFrameFraction(duration);
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

function calculateFrameFraction(duration: number){
    let adjustedDuration = Math.max(Math.round(duration / FPS_INTERVAL) * FPS_INTERVAL, FPS_INTERVAL);
    let numberOfSteps = adjustedDuration / FPS_INTERVAL;
    return 1 / numberOfSteps;
}

function requestAnimationFrameShim(ticker: () => void) {
  return setTimeout(() => {
    ticker();
  }, FPS_INTERVAL);
}

function ensurePoint(input: any) {
  let isObject = typeof input === "object";
  if (!isObject || typeof input.x !== "number" || typeof input.y !== "number")
    throwTypeError("point", isObject ? JSON.stringify(input) : typeof input);
}

function ensureFunction(input: any) {
  if (typeof input !== "function")
    throwTypeError("function", typeof input);
}

function ensureInteger(input: any) {
  if (typeof input !== "number" || input % 1 !== 0)
    throwTypeError("integer", input);
}

function ensurePositiveNumber(input: any) {
  ensureInteger(input);
  if (input < 0)
    throwTypeError("positive number", input);
}

function throwTypeError(expected: string, got: string) {
  throw `Expeted ${expected}, but got ${got}`;
}