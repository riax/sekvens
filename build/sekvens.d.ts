export declare type OnStepComplete = (result: number, sekvens: ValueAnimation) => void;
export declare type Command = () => void;
export declare let swing: (t: number) => number;
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
export declare function chain(...sequences: AnimationBase[]): SequenceAnimation;
export declare abstract class AnimationBase {
    protected numberOfRepeats: number;
    private onCompleteCallbacks;
    abstract stop(): void;
    abstract go(onDone?: Command): void;
    repeat(count?: number): AnimationBase;
    done(onComplete: Command): AnimationBase;
    protected executeOnComplete(): void;
}
export declare class SequenceAnimation extends AnimationBase {
    private sequences;
    private currentIndex;
    constructor(sequences: AnimationBase[]);
    go(onGoComplete?: Command): void;
    stop(): void;
}
export declare class ValueAnimation extends AnimationBase {
    private actions;
    private sequence;
    private stepCompleteCallback;
    private animationId;
    private initialValue;
    constructor(value: number);
    to(to: number, duration: number, easing?: (t: number) => number): ValueAnimation;
    wait(duration: number): ValueAnimation;
    stop(): void;
    on(onStepComplete: OnStepComplete): ValueAnimation;
    go(onGoComplete?: Command): void;
    private startAnimation(callback);
    private stopAnimation();
    private createSequence(actions);
}
