export const SHARK_ANIMATIONS = {
  IDLE: 'idle',
  MOVE: 'walk',
  ATTACK: 'attack',
  DEAD: 'dead',
} as const;

export type SharkAnimation =
  (typeof SHARK_ANIMATIONS)[keyof typeof SHARK_ANIMATIONS];

export const SHARK_DEFAULTS = {
  animation: SHARK_ANIMATIONS.MOVE,
  speed: 0.75,
  scale: 2.2,
  rotationY: Math.PI,
} as const;
