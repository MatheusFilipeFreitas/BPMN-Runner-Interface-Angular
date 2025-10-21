import { Component, EventEmitter, Output } from "@angular/core";
import { NavigationLayer, navigationLayers } from "./data/navigation-options";

@Component({
  selector: "app-doc-navigator",
  imports: [],
  templateUrl: "./doc-navigator.html",
  styleUrls: ["./doc-navigator.scss"]
})
export default class DocNavigatorComponent {
  @Output() selectItemEmit = new EventEmitter();

  get navigationLayers(): NavigationLayer[] {
    return navigationLayers;
  }

  selectItem(id: string): void {
    this.selectItemEmit.emit(id);
  }
}