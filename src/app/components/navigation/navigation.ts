import { Component, DestroyRef, DOCUMENT, inject, signal } from "@angular/core";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { CdkMenuModule } from '@angular/cdk/menu';
import { IconComponent } from "../icon/icon";
import { Theme, ThemeService } from "../../services/theme.service";
import { ConnectionPositionPair } from "@angular/cdk/overlay";
import { Location } from "@angular/common";
import { filter, map, startWith } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { PagePrefix } from "../../utils/page";

type MenuType = 'social' | 'theme-picker' | 'version-picker';

@Component({
  selector: 'app-nav',
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.scss'],
  imports: [RouterLink, CdkMenuModule, IconComponent]
})
export default class NavigationComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private themeService = inject(ThemeService);
  private router = inject(Router);
  private readonly location = inject(Location);

  public theme = this.themeService.theme;
  public openedMenu: MenuType | null = null;

  public miniMenuPositions = [
    new ConnectionPositionPair(
      {originX: 'end', originY: 'center'},
      {overlayX: 'start', overlayY: 'center'},
    ),
    new ConnectionPositionPair(
      {originX: 'end', originY: 'top'},
      {overlayX: 'start', overlayY: 'top'},
    ),
  ];

  public activeRouteItem = signal<string | null>(null);

  constructor() {
    this.listenToRouteChange();
  }

  public setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  get getThemeIcon(): string {
    switch (this.theme()) {
      case 'light':
        return 'light_mode';
      case 'dark':
        return 'dark_mode';
      case 'auto':
        return 'routine';
      default:
        return 'routine';
    }
  }

  public openVersionMenu($event: MouseEvent): void {
    $event.stopImmediatePropagation();
    $event.preventDefault();
    this.openMenu('version-picker');
  }

  public openMenu(menuType: MenuType): void {
    this.openedMenu = menuType;
  }

  public closeMenu(): void {
    this.openedMenu = null;
  }

  private listenToRouteChange(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event) => (event as NavigationEnd).urlAfterRedirects),
      )
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        startWith(this.location.path()),
      )
      .subscribe((url) => {
        // setActivePrimaryRoute(getBaseUrlAfterRedirects(url, this.router));
      });
  }

}