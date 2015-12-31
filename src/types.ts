export type Command = () => void;
export type Point = { x: number, y: number };
export type EasingFunction = (t: number) => number;
export type ValueAnimationSettings = { defaultEasing?: EasingFunction }
export interface IAction<T> { (): { isLast: boolean; value: T; }};
export interface IValidator {
    (input:any): boolean;
    description: string;
}