import { Component, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { CdkMenuModule } from '@angular/cdk/menu';
import { IconComponent } from "../icon/icon";
import { Theme, ThemeService } from "../../services/theme.service";
import { ConnectionPositionPair } from "@angular/cdk/overlay";
import { LoginService } from "../../services/login.service";
import { CommonModule } from "@angular/common";
import SettingsModalComponent from "../settings/settings";
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

type MenuType = 'social' | 'theme-picker' | 'version-picker' | 'login';
type ModalType = 'settings';

@Component({
  selector: 'app-nav',
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.scss'],
  imports: [RouterLink, CdkMenuModule, IconComponent, CommonModule],
  providers: [DialogService]
})
export default class NavigationComponent {
  private themeService = inject(ThemeService);
  private loginService = inject(LoginService);
  private dialogService = inject(DialogService);
  private router = inject(Router);

  public theme = this.themeService.theme;
  public openedMenu: MenuType | null = null;
  public activeRouteItem = signal<string | null>(null);
  ref: DynamicDialogRef<SettingsModalComponent> | null = null;

  readonly isUserLoggedIn = this.loginService.isLoggedIn;

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

  setTheme(theme: Theme): void {
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

  openVersionMenu($event: MouseEvent): void {
    $event.stopImmediatePropagation();
    $event.preventDefault();
    this.openMenu('version-picker');
  }

  openMenu(menuType: MenuType): void {
    this.openedMenu = menuType;
  }

  closeMenu(): void {
    this.openedMenu = null;
  }

  navigateToPath(path: string): void {
    this.router.navigateByUrl(path);
  }

  logout() {
    this.loginService.logout();
  }

  login() {
    this.loginService.login();
  }

  openModal(type: ModalType) {
    switch (type) {
      case 'settings':
        this.ref = this.dialogService.open(SettingsModalComponent, {
          header: 'Account Settings',
          width: '70%',
          contentStyle: { overflow: 'auto', background: 'var(--page-background) !important', fontFamily: 'Inter Tight', src: 'url(\"/assets/fonts/InterTight-VariableFont_wght.woff2\") format(\"woff2\")', fontWeight: 500, fontStyle: 'normal', fontDisplay: 'swap', letterSpacing: '1px' },
          baseZIndex: 10000,
          closable: true,
          styleClass: "gradient-box"
        });
      break;
    }
  }
}