import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-doc-header',
    templateUrl: './doc-header.html',
    styleUrls: ['./doc-header.scss'],
    imports: []
})
export default class DocHeaderComponent {
    @Input() title: string = "";
}