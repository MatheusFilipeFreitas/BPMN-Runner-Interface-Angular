import {inject, Injectable, Injector} from '@angular/core';
import { Animation } from '../types/animation';
import { AnimationConfig } from '../types/animation.config';
import { AnimationLayerDirective } from '../directives/animation.directive';

@Injectable({providedIn: 'root'})
export class AnimationCreatorService {
  private readonly injector = inject(Injector);

  public createAnimation(
    layers: readonly AnimationLayerDirective[],
    config?: Partial<AnimationConfig>,
  ): Animation {
    return new Animation(layers, this.injector, config);
  }
}
