import { Animation } from "./animation";

export interface AnimationPlugin {
  init(animation: Animation): void;

  destroy(): void;
}