import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy, OnInit, signal, ViewChild } from "@angular/core";
import CodeComponent from "../../components/code/code";
import ViewerComponent from "../../components/viewer/viewer";
import { IconComponent } from "../../components/icon/icon";
import { ScriptService } from "../../services/script.service";
import ToastCodeComponent from "../../components/code/dialog/toast-code";
import { LoginService } from "../../services/login.service";

@Component({
  selector: "app-playground",
  imports: [CodeComponent, ViewerComponent, IconComponent, ToastCodeComponent],
  templateUrl: "./playground.html",
  styleUrls: ["./playground.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PlaygroundComponent implements OnInit, OnDestroy{
  hasEdited = signal<boolean>(false);  
  private scriptService = inject(ScriptService);
  private loginService = inject(LoginService);
  
  @ViewChild(CodeComponent) editorComponent:
  | CodeComponent
  | undefined;

  content: string = 
`// Simple sample:
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

  constructor() {
    effect(() => {
      const isLoggedIn = this.loginService.isLoggedIn();
      const errors = this.scriptService.errors();
      if (isLoggedIn && errors.length > 0) {
        this.scriptService.clearAllErrors();
      }
    })
  }

  ngOnInit() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  ngOnDestroy() {
    this.scriptService.clearAllErrors();
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  async handleKeyDown(event: KeyboardEvent) {
    this.hasEdited.set(true);
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
    }
  }

  handleEditorChange(value: string) {
    this.content = value;
  } 

  processScript(): void {
    this.scriptService.processScript(this.content);
  }
}