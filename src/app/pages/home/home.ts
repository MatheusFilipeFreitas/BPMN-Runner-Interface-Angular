import { ChangeDetectionStrategy, Component, DestroyRef, DOCUMENT, inject, signal } from "@angular/core";
import { WINDOW } from "../../utils/window";
import HomeAnimationComponent from './animation/home-animation';

@Component({
  selector: 'app-home',
  imports: [HomeAnimationComponent],
  styleUrls: ['./home.scss'],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class HomeComponent {
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly window = inject(WINDOW);

  public scrollProgress = signal<number>(0);
  public animationReady = signal<boolean>(false);

  constructor() {
    this.onScrollEventHandler();
  }

  public onAnimationReady(ready: boolean): void {
    this.animationReady.set(ready);
  }

  private onScrollEventHandler(): void {
    const onScroll = () => {
      const maxScroll = this.doc.body.scrollHeight - this.window.innerHeight;
      this.scrollProgress.set(this.window.scrollY / maxScroll);
    };

    this.window.addEventListener('scroll', onScroll);
    this.destroyRef.onDestroy(() => this.window.removeEventListener('scroll', onScroll));
  }
}
