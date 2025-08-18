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
import { filter, first, map, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface NavigationInfo {
  disableScrolling?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AppScroller {
  private readonly router = inject(Router);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(EnvironmentInjector);

  private lastScrollEvent?: Scroll;
  private cancelPendingScroll?: () => void;

  constructor() {
    this.viewportScroller.setHistoryScrollRestoration('manual');
    this.observeNavigationScroll();
  }

  private observeNavigationScroll(): void {
    this.router.events
      .pipe(
        filter((event): event is Scroll => event instanceof Scroll),
        tap((event) => {
          this.cancelPendingScroll?.();
          this.lastScrollEvent = event;
        }),
        filter(() => !this.isScrollingDisabled()),
        switchMap((event) =>
          this.appRef.isStable.pipe(
            filter(Boolean),
            first(),
            map(() => event)
          )
        ),
        takeUntilDestroyed()
      )
      .subscribe(() => this.executeScroll());
  }

  private isScrollingDisabled(): boolean {
    const info = this.router.lastSuccessfulNavigation?.extras
      .info as NavigationInfo | undefined;
    return !!info?.disableScrolling;
  }

  public executeScroll(customInjector?: Injector): void {
    if (!this.lastScrollEvent) return;

    const target = this.resolveScrollTarget(this.lastScrollEvent);
    const ref = afterNextRender(
      {
        write: () =>
          Array.isArray(target)
            ? this.viewportScroller.scrollToPosition(target)
            : this.viewportScroller.scrollToAnchor(target),
      },
      { injector: customInjector ?? this.injector }
    );

    this.finalizeScroll(ref);
  }

  private resolveScrollTarget(scroll: Scroll): [number, number] | string {
    if (scroll.position) return scroll.position;
    if (scroll.anchor) return scroll.anchor;
    return [0, 0];
  }

  private finalizeScroll(ref: AfterRenderRef): void {
    this.cancelPendingScroll = () => ref.destroy();
    this.lastScrollEvent = undefined;
  }
}
