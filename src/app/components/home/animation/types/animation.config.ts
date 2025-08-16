export type AnimationConfig = {
  /**
   * In milliseconds. How much the time increments or decrements when you go forward or back in time.
   * In the case of auto play, the timestep virtually acts as FPS (frames per second).
   *
   * Default: `100`
   */
  timestep: number;
};