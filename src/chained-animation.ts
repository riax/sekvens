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
    const execute = (index: number) => {
      const animation = this.groups[index];
      animation.go(() => {
        const nextIndex = index + 1;
        const shouldRepeat = repeatCount++ < this.numberOfRepeats;
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
