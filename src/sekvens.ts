interface IAction { (): IActionResult; }
interface IActionResult { isLast: boolean; value: number; }
export type ResultCallback = (result: number) => void;
export type Command = () => void;
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

export function from(value: number) {
  return new ValueAnimation(value);
}

export function chain(...sequences: Sequence[]) {
  return new SequenceAnimation(sequences);
}

export abstract class Sequence {
  protected numberOfRepeats = 0;
  private onCompleteCallbacks: Command[] = [];
  abstract stop(): void;
  abstract go(onDone?: Command): void;

  repeat(count: number = Number.MAX_VALUE) {
    this.numberOfRepeats = count;
    return this;
  }

  done(onComplete: Command) {
    this.onCompleteCallbacks.push(onComplete);
    return this;
  }

  protected executeOnComplete() {
    for (let callback of this.onCompleteCallbacks) {
      callback();
    }
  }
}

export class SequenceAnimation extends Sequence {
  private currentIndex = 0;
  constructor(private sequences: Sequence[]) {
    super();
  }

  go(onGoComplete?: Command) {
    let repeatCount = 0;
    let execute = (index: number) => {
      let sequence = this.sequences[index];
      sequence.go(() => {
        let nextIndex = index + 1;
        let shouldRepeat = repeatCount++ < this.numberOfRepeats;
        if (this.sequences[nextIndex] !== undefined) {
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
    this.sequences.length > 0 && execute(0);
  }

  stop() {
    this.sequences[this.currentIndex].stop();
  }
}

export class ValueAnimation extends Sequence {
  private actions: IAction[] = [];
  private sequence: number[] = null;
  private stepCompleteCallback: ResultCallback;
  private animationId: number;
  private initialValue: number;

  constructor(value: number) {
    super();
    this.initialValue = value;
  }

  to(to: number, duration: number, easing: (t: number) => number = easeInOutCubic) {
    let initial = this.initialValue;
    let steps = duration / FPS_INTERVAL;
    let fraction = 1 / steps;
    let delta = to - this.initialValue;
    let currentFraction = 0;
    this.actions.push(() => {
      let value = initial + (easing(currentFraction += fraction) * delta)
      return {
        isLast: Math.round(value) === to,
        value: Math.round(value)
      };
    });
    this.initialValue = Math.round(to);
    return this;
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
    return this;
  }

  stop() {
    this.stopAnimation();
  }

  on(onStepComplete: ResultCallback) {
    this.stepCompleteCallback = onStepComplete;
    return this;
  }

  go(onGoComplete?: Command) {
    let repeatCount = 0;
    let index = 0;
    this.sequence = this.sequence || this.createSequence(this.actions);
    this.startAnimation(() => {
      let value = this.sequence[index++]
      if (value !== undefined) {
        if (value !== null) {
          this.stepCompleteCallback && this.stepCompleteCallback(value);
        }
      } else {
        if (++repeatCount < this.numberOfRepeats) {
          index = 0;
        } else {
          this.stop();
          this.executeOnComplete();
          onGoComplete && onGoComplete();
        }
      }
    });
  }

  private startAnimation(callback: Command) {
    this.animationId = setInterval(() => callback(), FPS_INTERVAL)
  }

  private stopAnimation() {
    clearInterval(this.animationId);
    this.animationId = null;
  }

  private createSequence(actions: IAction[]) {
    let values: number[] = [];
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
}
