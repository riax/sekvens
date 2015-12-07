export declare type ResultCallback = (result: number) => void;
export declare type Command = () => void;
export declare let linear: (t: number) => number;
export declare let easeInQuad: (t: number) => number;
export declare let easeOutQuad: (t: number) => number;
export declare let easeInOutQuad: (t: number) => number;
export declare let easeInCubic: (t: number) => number;
export declare let easeOutCubic: (t: number) => number;
export declare let easeInOutCubic: (t: number) => number;
export declare let easeInQuart: (t: number) => number;
export declare let easeOutQuart: (t: number) => number;
export declare let easeInOutQuart: (t: number) => number;
export declare let easeInQuint: (t: number) => number;
export declare let easeOutQuint: (t: number) => number;
export declare let easeInOutQuint: (t: number) => number;
export declare function from(value: number): ValueAnimation;
export declare function chain(...sequences: Sequence[]): SequenceAnimation;
export declare abstract class Sequence {
    protected numberOfRepeats: number;
    private onCompleteCallbacks;
    abstract stop(): void;
    abstract go(onDone?: Command): void;
    repeat(count?: number): Sequence;
    done(onComplete: Command): Sequence;
    protected executeOnComplete(): void;
}
export declare class SequenceAnimation extends Sequence {
    private sequences;
    private currentIndex;
    constructor(sequences: Sequence[]);
    go(onGoComplete?: Command): void;
    stop(): void;
}
export declare class ValueAnimation extends Sequence {
    private actions;
    private sequence;
    private stepCompleteCallback;
    private animationId;
    private initialValue;
    constructor(value: number);
    to(to: number, duration: number, easing?: (t: number) => number): ValueAnimation;
    wait(duration: number): ValueAnimation;
    stop(): void;
    on(onStepComplete: ResultCallback): ValueAnimation;
    go(onGoComplete?: Command): void;
    private startAnimation(callback);
    private stopAnimation();
    private createSequence(actions);
}
