import { Component } from "@angular/core";
import { NavigationLayer, navigationLayers } from "./data/navigation-options";

@Component({
  selector: "app-doc-navigator",
  imports: [],
  templateUrl: "./doc-navigator.html",
  styleUrls: ["./doc-navigator.scss"]
})
export default class DocNavigatorComponent {
  get navigationLayers(): NavigationLayer[] {
    return navigationLayers;
  }
}