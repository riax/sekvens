import * as helpers from "./helpers";
import * as types from "./types";
import { AnimationBase } from "./animation-base";
export class ChainedAnimation extends AnimationBase {
  private currentIndex = 0;
  constructor(private groups: AnimationBase[]) {
    super();
  }
  go(onGoComplete?: types.Command) {
    onGoComplete && helpers.ensureFunction(onGoComplete);
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