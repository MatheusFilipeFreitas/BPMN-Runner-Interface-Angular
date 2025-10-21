import { ChangeDetectionStrategy, Component, inject, ViewChild } from "@angular/core";
import CodeComponent from "../../components/code/code";
import ViewerComponent from "../../components/viewer/viewer";

@Component({
  selector: "app-playground",
  imports: [CodeComponent, ViewerComponent],
  templateUrl: "./playground.html",
  styleUrls: ["./playground.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PlaygroundComponent {
  @ViewChild(CodeComponent) editorComponent:
  | CodeComponent
  | undefined;

  content: string = `// Simple sample:
pool(p1, "Pool test") {
    process(pc1, "Process test") {
        start(s1);
        task(t1, "Manual test", MANUAL);
        end(e1);
    }
}`;
  language: string = 'bpmnRunner';

  options = {
    theme: 'bpmnRunner-light',
    language: this.language,
    fontSize: 16,
    wordWrap: 'on',
    automaticLayout: true,
  };

  ngOnInit() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  async handleKeyDown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
    }
  }

  handleEditorChange(value: string) {
    // send to online interpreter
  }
}