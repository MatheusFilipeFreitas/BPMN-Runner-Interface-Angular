 import { DOCUMENT, EnvironmentProviders, inject, provideEnvironmentInitializer } from "@angular/core";
import {
  createUrlTreeFromSnapshot,
  NavigationCancel,
  NavigationError,
  NavigationStart,
  provideRouter,
  RedirectCommand,
  Router,
  withComponentInputBinding,
  withInMemoryScrolling,
  withNavigationErrorHandler,
  withRouterConfig,
  withViewTransitions,
} from "@angular/router";
import { map, merge, Subject, fromEvent } from "rxjs";
import { WINDOW } from "./utils/window";
import { AppScroller } from "./app.scroller";
import { routes } from "./app.routes";
import { HttpErrorResponse } from "@angular/common/http";

const transitionCreated = new Subject<void>();

export const routerProviders: EnvironmentProviders[] = [
  provideRouter(
    routes,
    withInMemoryScrolling(),
    withRouterConfig({ canceledNavigationResolution: "computed" }),
    withNavigationErrorHandler(({ error }) => {
      const router = inject(Router);
      if (error instanceof HttpErrorResponse) {
        return new RedirectCommand(router.parseUrl("/404"));
      }
      return void 0;
    }),
    withViewTransitions({
      onViewTransitionCreated: ({ transition, to }) => {
        transitionCreated.next();
        const router = inject(Router);
        const toTree = createUrlTreeFromSnapshot(to, []);
        if (
          router.isActive(toTree, {
            paths: "exact",
            matrixParams: "exact",
            fragment: "ignored",
            queryParams: "ignored",
          })
        ) {
          transition.skipTransition();
        }
      },
    }),
    withComponentInputBinding()
  ),
  provideEnvironmentInitializer(() => inject(AppScroller)),
  provideEnvironmentInitializer(() => setupNavigationAdapter()),
];

const setupNavigationAdapter = (): void => {
  const router = inject(Router);
  const window = inject(WINDOW);
  const document = inject(DOCUMENT);
  const navigation = (window as any).navigation;

  if (!navigation || !document.startViewTransition) {
    return;
  }

  let cancelPendingNavigation: (() => void) | undefined;

  const navigateError$ = fromEvent(navigation, "navigateerror");
  const navigate$ = fromEvent(navigation, "navigate");

  navigateError$.subscribe(() => {
    cancelPendingNavigation?.();
    cancelPendingNavigation = undefined;
    router.getCurrentNavigation()?.abort();
  });

  navigate$.subscribe((navigateEvent: any) => {
    navigateEvent.intercept({
      handler: () =>
        new Promise<void>((_, reject) => {
          cancelPendingNavigation = () => {
            cancelPendingNavigation = undefined;
            reject();
          };
        }),
    });
  });

  merge(transitionCreated.pipe(map(() => "viewtransition")), router.events).subscribe((e) => {
    const currentNavigation = router.getCurrentNavigation();
    if (currentNavigation?.trigger === "popstate" || currentNavigation?.extras.replaceUrl) {
      return;
    }
    if (e instanceof NavigationStart) {
      window.history.replaceState(window.history.state, "", window.location.href);
    } else if (e === "viewtransition" || e instanceof NavigationCancel || e instanceof NavigationError) {
      cancelPendingNavigation?.();
    }
  });
};
