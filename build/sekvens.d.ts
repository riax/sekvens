export interface IAction<T> {
    (): {
        isLast: boolean;
        value: T;
    };
}
export declare type OnStepComplete<T> = (result: T, sekvens: AnimationBase) => void;
export declare type Command = () => void;
export declare type Point = {
    x: number;
    y: number;
};
export declare type EasingFunction = (t: number) => number;
export declare type ValueAnimationSettings = {
    defaultEasing?: EasingFunction;
};
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
export declare function from(value: number): SingleValueAnimation;
export declare function fromPoint(value: Point): PointValueAnimation;
export declare function chain(...groups: AnimationBase[]): ChainedAnimation;
export declare abstract class AnimationBase {
    protected numberOfRepeats: number;
    private onCompleteCallbacks;
    abstract stop(): void;
    abstract go(onDone?: Command): void;
    repeat(count?: number): AnimationBase;
    done(onComplete: Command): AnimationBase;
    protected executeOnComplete(): void;
}
export declare class ChainedAnimation extends AnimationBase {
    private groups;
    private currentIndex;
    constructor(groups: AnimationBase[]);
    go(onGoComplete?: Command): void;
    stop(): void;
}
export declare abstract class ValueAnimation<T> extends AnimationBase {
    protected onStepComplete: OnStepComplete<T>;
    protected sequence: T[];
    protected actions: IAction<T>[];
    protected initialValue: T;
    protected valueAnimationSettings: ValueAnimationSettings;
    private isTicking;
    constructor(value: T);
    stop(): void;
    on(onStepComplete: OnStepComplete<T>): ValueAnimation<T>;
    go(onGoComplete?: Command): void;
    settings(settings: ValueAnimationSettings): ValueAnimation<T>;
    wait(duration: number): ValueAnimation<T>;
    protected createSequence(actions: IAction<T>[]): T[];
    protected startAnimation(onTick: () => boolean): void;
    protected stopAnimation(): void;
}
export declare class SingleValueAnimation extends ValueAnimation<number> {
    constructor(value: number);
    to(to: number, duration?: number, easing?: (t: number) => number): SingleValueAnimation;
}
export declare class PointValueAnimation extends ValueAnimation<Point> {
    constructor(value: Point);
    to(to: Point, duration?: number, easing?: (t: number) => number): PointValueAnimation;
}
