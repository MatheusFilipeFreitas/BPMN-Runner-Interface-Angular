import { DOCUMENT, inject, provideEnvironmentInitializer } from "@angular/core";
import { createUrlTreeFromSnapshot, NavigationCancel, NavigationError, NavigationStart, provideRouter, RedirectCommand, Router, withComponentInputBinding, withInMemoryScrolling, withNavigationErrorHandler, withRouterConfig, withViewTransitions } from "@angular/router";
import { map, merge, Subject } from "rxjs";
import { WINDOW } from "./utils/window";
import { AppScroller } from "./app.scroller";
import { routes } from "./app.routes";
import { HttpErrorResponse } from "@angular/common/http";

const transitionCreated = new Subject<void>();
export const routerProviders = [
  provideRouter(
    routes,
    withInMemoryScrolling(),
    withRouterConfig({canceledNavigationResolution: 'computed'}),
    withNavigationErrorHandler(({error}) => {
      if (error instanceof HttpErrorResponse) {
        console.error('Handler called');
        return new RedirectCommand(inject(Router).parseUrl('/404'));
      }
      return void 0;
    }),
    withViewTransitions({
      onViewTransitionCreated: ({transition, to}) => {
        transitionCreated.next();
        const router = inject(Router);
        const toTree = createUrlTreeFromSnapshot(to, []);
        if (
          router.isActive(toTree, {
            paths: 'exact',
            matrixParams: 'exact',
            fragment: 'ignored',
            queryParams: 'ignored',
          })
        ) {
          transition.skipTransition();
        }
      },
    }),
    withComponentInputBinding(),
  ),
  provideEnvironmentInitializer(() => inject(AppScroller)),
  provideEnvironmentInitializer(() => initializeNavigationAdapter()),
];

const initializeNavigationAdapter = () => {
  const router = inject(Router);
  const window = inject(WINDOW);
  const navigation = (window as any).navigation;
  if (!navigation || !inject(DOCUMENT).startViewTransition) {
    return;
  }

  let intercept = false;
  let clearNavigation: (() => void) | undefined;
  navigation.addEventListener('navigateerror', async () => {
    if (!clearNavigation) {
      return;
    }
    clearNavigation = undefined;
    router.getCurrentNavigation()?.abort();
  });
  navigation.addEventListener('navigate', (navigateEvent: any) => {
    if (!intercept) {
      return;
    }
    navigateEvent.intercept({
      handler: () =>
        new Promise<void>((_, reject) => {
          clearNavigation = () => {
            clearNavigation = undefined;
            reject();
          };
        }),
    });
  });

  merge(transitionCreated.pipe(map(() => 'viewtransition')), router.events).subscribe((e) => {
    const currentNavigation = router.getCurrentNavigation();
    if (currentNavigation?.trigger === 'popstate' || currentNavigation?.extras.replaceUrl) {
      return;
    }
    if (e instanceof NavigationStart) {
      intercept = true;
      window.history.replaceState(window.history.state, '', window.location.href);
      intercept = false;
    } else if (
      e === 'viewtransition' ||
      e instanceof NavigationCancel ||
      e instanceof NavigationError
    ) {
      console.log('Cleared navigation');
      clearNavigation?.();
    }
  });
};
