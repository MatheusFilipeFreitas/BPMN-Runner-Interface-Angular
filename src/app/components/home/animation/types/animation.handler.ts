import { ElementRef, Injector, Renderer2, RendererFactory2 } from '@angular/core';
import { Animation } from './animation';
import { AnimationPlugin } from './animation.plugin';

const RESIZE_DEBOUNCE = 500;

export class AnimationScrollHandler implements AnimationPlugin {
  private win: Window;
  private renderer: Renderer2;
  private unlisteners: (() => void)[] = [];
  private scrollHeight: number = 0;
  private spacer?: HTMLElement;
  private resizeDebounceTimeout?: ReturnType<typeof setTimeout>;
  private ticking: boolean = false;

  constructor(
    private hostElementRef: ElementRef,
    injector: Injector,
    private addSpacer: boolean = true,
  ) {
    this.win = window;
    this.renderer = injector.get(RendererFactory2).createRenderer(null, null);
  }

  public init(animation: Animation): void {
    this.scrollHeight = animation.duration / animation.timestep;

    this.unlisteners.push(
      this.renderer.listen(this.win, 'scroll', () => {
        if (!this.ticking) {
          requestAnimationFrame(() => {
            if (animation.isPlaying()) {
              animation.pause();
            }
            const progress = this.win.scrollY / this.scrollHeight;
            animation.seek(progress);
            this.ticking = false;
          });
          this.ticking = true;
        }
      }),
    );

    if (this.addSpacer) {
      this.createSpacer();
      this.unlisteners.push(
        this.renderer.listen(this.win, 'resize', () => {
          if (this.resizeDebounceTimeout) {
            clearTimeout(this.resizeDebounceTimeout);
          }
          this.resizeDebounceTimeout = setTimeout(() => this.updateSpacerHeight(), RESIZE_DEBOUNCE);
        }),
      );
    }
  }

  public destroy(): void {
    for (const unlisten of this.unlisteners) {
      unlisten();
    }
  }

  private createSpacer(): void {
    this.spacer = this.renderer.createElement('div');
    this.renderer.addClass(this.spacer, 'anim-scroll-spacer');
    this.updateSpacerHeight();

    this.hostElementRef.nativeElement.appendChild(this.spacer);
  }

  private updateSpacerHeight(): void {
    const spacerHeight = this.scrollHeight + this.win.innerHeight;
    this.renderer.setStyle(this.spacer, 'height', spacerHeight + 'px');
  }
}
