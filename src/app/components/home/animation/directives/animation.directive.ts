import { Directive, ElementRef, inject, input } from "@angular/core";

@Directive({
  selector: '[appAnimationLayer]',
})
export class AnimationLayerDirective {
  readonly elementRef = inject(ElementRef);
  id = input.required<string>({alias: 'layerId'});
}