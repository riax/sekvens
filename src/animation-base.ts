import * as helpers from "./helpers";
import * as types from "./types";
export type OnStepComplete<T> = (result: T, sekvens: AnimationBase) => void;
export abstract class AnimationBase {
  protected numberOfRepeats = 0;
  private onCompleteCallbacks: types.Command[] = [];
  abstract stop(): void;
  abstract go(onDone?: types.Command): void;
  repeat(count: number = Number.MAX_VALUE): AnimationBase {
    this.numberOfRepeats = count;
    return this;
  }
  done(onComplete: types.Command): AnimationBase {
    onComplete && helpers.ensureFunction(onComplete);
    this.onCompleteCallbacks.push(onComplete);
    return this;
  }
  protected executeOnComplete() {
    for (let callback of this.onCompleteCallbacks) {
      callback();
    }
  }
}
