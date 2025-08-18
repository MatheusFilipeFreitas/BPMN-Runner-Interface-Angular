import { afterNextRender, Component, computed, DestroyRef, ElementRef, inject, Injector, input, output, signal, viewChildren } from "@angular/core";
import { shouldReduceMotion } from "./utils/animation.utils";
import { RouterLink } from "@angular/router";
import { ANIM_TIMESTEP, generateHomeAnimationDefinition } from "./utils/animation.definition";
import { AnimationScrollHandler } from "./types/animation.handler";
import { AnimationCreatorService } from "./services/animation.service";
import { AnimationLayerDirective } from "./directives/animation.directive";
import { WINDOW } from "../../../utils/window";

export const METEOR_HW_RATIO = 1.42;
export const METEOR_GAP_RATIO = 1.33;

export const METEOR_WIDTH_MAP = [
  [800, 60],
  [1100, 90],
];

export const METEOR_WIDTH_DEFAULT = 120;

type MeteorDimensions = {
  width: number;
  height: number;
  tailLength: number;
  gap: number;
  tiltAngle: number;
};

type MeteorFieldData = {
  width: number;
  height: number;
  count: number;
  marginLeft: number;
  marginTop: number;
};

@Component({
  selector: 'app-home-animation',
  imports: [AnimationLayerDirective],
  templateUrl: './home-animation.html',
  styleUrls: ['./home-animation.scss']
})
export default class HomeAnimationComponent {
  private readonly injector = inject(Injector);
  private readonly elementRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly animCreator = inject(AnimationCreatorService);
  private readonly window = inject(WINDOW);

  readonly animationLayers = viewChildren(AnimationLayerDirective);

  readonly ready = output<boolean>();
  readonly reducedMotion = signal<boolean>(shouldReduceMotion());
  readonly meteorFieldData = signal<MeteorFieldData | null>(null);
  readonly meteors = signal<number[]>([]);

  constructor() {
    if (!this.reducedMotion()) {
      this.initAnimation();
    } else {
      this.ready.emit(true);
    }
  }

  private initAnimation() {
    const meteorDimensions = this.calculateMeteorDimensions();
    const data = this.calculateMeteorFieldData(meteorDimensions);
    this.setCssVariables(meteorDimensions);
    this.meteorFieldData.set(data);

    this.meteors.set(new Array(data.count).fill(1).map(() => Math.round(Math.random() * 2 + 1)));

    afterNextRender({
      read: () => {
        const animation = this.animCreator
          .createAnimation(this.animationLayers(), {timestep: ANIM_TIMESTEP})
          .define(generateHomeAnimationDefinition(this.meteors().length))
          .addPlugin(new AnimationScrollHandler(this.elementRef, this.injector));

        this.ready.emit(true);
        this.destroyRef.onDestroy(() => animation.dispose());
      },
    });
  }

  private calculateMeteorDimensions(): MeteorDimensions {
    let width = METEOR_WIDTH_DEFAULT;

    for (const [screenSize, meteorWidth] of METEOR_WIDTH_MAP) {
      if (this.window.innerWidth <= screenSize) {
        width = meteorWidth;
      }
    }

    const height = width * METEOR_HW_RATIO;
    const gap = width * METEOR_GAP_RATIO;

    const tailLength = Math.sqrt(width * width + height * height);
    const tiltAngle = -Math.asin(width / tailLength);

    return {
      width,
      height,
      gap,
      tailLength,
      tiltAngle,
    };
  }

  private calculateMeteorFieldData(meteorDim: MeteorDimensions): MeteorFieldData {
    const mW = meteorDim.width + meteorDim.gap;
    const mH = meteorDim.height + meteorDim.gap;
    let rows = 1;
    let cols = 1;

    while (cols * mW - meteorDim.gap <= this.window.innerWidth) {
      cols++;
    }
    while (rows * mH - meteorDim.gap <= this.window.innerHeight) {
      rows++;
    }

    const width = cols * mW - meteorDim.gap;
    const height = rows * mH - meteorDim.gap;

    return {
      count: rows * cols,
      width,
      height,
      marginLeft: -(width - this.window.innerWidth) / 2,
      marginTop: -(height - this.window.innerHeight) / 2,
    };
  }

  private setCssVariables({width, height, tailLength, tiltAngle, gap}: MeteorDimensions) {
    const styleRef = this.elementRef.nativeElement.style;
    styleRef.setProperty('--meteor-width', width + 'px');
    styleRef.setProperty('--meteor-height', height + 'px');
    styleRef.setProperty('--meteor-tail-length', tailLength + 'px');
    styleRef.setProperty('--meteor-tilt-angle', tiltAngle + 'rad');
    styleRef.setProperty('--meteor-gap', gap + 'px');
  }
}