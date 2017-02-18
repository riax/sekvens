export const swing = (t: number) => 0.5 - Math.cos(t * Math.PI) / 2
export const linear = (t: number) => t;
export const easeInQuad = (t: number) => t * t;
export const easeOutQuad = (t: number) => t * (2 - t);
export const easeInOutQuad = (t: number) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
export const easeInCubic = (t: number) => t * t * t;
export const easeOutCubic = (t: number) => (--t) * t * t + 1;
export const easeInOutCubic = (t: number) => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
export const easeInQuart = (t: number) => t * t * t * t;
export const easeOutQuart = (t: number) => 1 - (--t) * t * t * t;
export const easeInOutQuart = (t: number) => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
export const easeInQuint = (t: number) => t * t * t * t * t;
export const easeOutQuint = (t: number) => 1 + (--t) * t * t * t * t;
export const easeInOutQuint = (t: number) => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
