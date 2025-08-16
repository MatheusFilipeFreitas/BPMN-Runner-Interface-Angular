import { Animation } from "./animation";

export interface AnimationPlugin {
  /** Contains the plugin initialization login. */
  init(animation: Animation): void;

  /** Will be called on Animation disposal. */
  destroy(): void;
}