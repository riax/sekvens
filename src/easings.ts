export let swing = (t: number) => 0.5 - Math.cos(t * Math.PI) / 2
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
