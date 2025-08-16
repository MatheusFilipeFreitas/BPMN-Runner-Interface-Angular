import { ViewportScroller } from '@angular/common';
import {
  Injectable,
  inject,
  ApplicationRef,
  afterNextRender,
  EnvironmentInjector,
  Injector,
  AfterRenderRef,
} from '@angular/core';
import { Scroll, Router } from '@angular/router';
import { filter, firstValueFrom, map, switchMap, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppScroller {
  private readonly router = inject(Router);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(EnvironmentInjector);

  private lastScroll?: Scroll;
  private cancelScroll?: () => void;

  constructor() {
    this.viewportScroller.setHistoryScrollRestoration('manual');

    this.router.events
      .pipe(
        filter((e): e is Scroll => e instanceof Scroll),
        tap((e) => {
          this.cancelScroll?.();
          this.lastScroll = e;
        }),
        filter(() => !this.isDisabled()),
        switchMap((e) =>
          firstValueFrom(this.appRef.isStable.pipe(filter(Boolean), map(() => e)))
        )
      )
      .subscribe(() => this.scroll());
  }

  private isDisabled(): boolean {
    const info = this.router.lastSuccessfulNavigation?.extras.info as 
      | { disableScrolling?: boolean }
      | undefined;
    return !!info?.disableScrolling;
  }

  public scroll(injector?: Injector): void {
    if (!this.lastScroll) return;

    const { anchor, position } = this.lastScroll;
    const ref = afterNextRender(
      {
        write: () =>
          position
            ? this.viewportScroller.scrollToPosition(position)
            : anchor
            ? this.viewportScroller.scrollToAnchor(anchor)
            : this.viewportScroller.scrollToPosition([0, 0]),
      },
      { injector: injector ?? this.injector }
    );

    this.resetParams(ref);
  }

  public resetParams(ref: AfterRenderRef): void {
    this.cancelScroll = () => ref.destroy();
    this.lastScroll = undefined;
  }
}
