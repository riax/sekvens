import { ensureFunction } from "./helpers";
import { Command } from "./types";

export type OnStepComplete<T> = (result: T, sekvens: AnimationBase) => void;

export abstract class AnimationBase {
  protected numberOfRepeats = 0;
  private onCompleteCallbacks: Command[] = [];
  abstract stop(): void;
  abstract go(onDone?: Command): void;
  repeat(count: number = Number.MAX_VALUE): AnimationBase {
    this.numberOfRepeats = count;
    return this;
  }
  done(onComplete: Command): AnimationBase {
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
