import { ChangeDetectionStrategy, Component, DestroyRef, DOCUMENT, inject, Renderer2, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import HomeAnimationComponent from "./animation/home-animation";

@Component({
  selector: 'app-home',
  imports: [HomeAnimationComponent],
  styleUrls: ['./home.scss'],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class HomeComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly renderer = inject(Renderer2);
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isUwu = 'uwu' in this.activatedRoute.snapshot.queryParams;

  private scrollProgress = signal<number>(0);
  public animationReady = signal<boolean>(false);

  constructor() {
    const scrollListenerCleanupFn = this.renderer.listen(window, 'scroll', () =>
      this.scrollProgress.set(window.scrollY / this.doc.body.scrollHeight),
    );
    this.destroyRef.onDestroy(() => scrollListenerCleanupFn());
  }

  public onAnimationReady(ready: boolean) {
    this.animationReady.set(ready);
  }
}