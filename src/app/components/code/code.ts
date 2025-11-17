import { ChangeDetectionStrategy, Component, effect, ElementRef, EventEmitter, HostBinding, inject, Input, OnDestroy, Output, Renderer2, signal, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { fromEvent, Subject, takeUntil } from "rxjs";
import { CodeService } from "../../services/code.service";
import { registerProcessLang } from "../../config/lang/bpmn-runner";
import { Theme, ThemeService } from "../../services/theme.service";
import { ConfirmationService } from "primeng/api";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LoadingService } from "../../services/loading.service";

declare const monaco: any;

@Component({
    selector: 'app-code-editor',
    template: '<div #editorContainer class="editor-container"></div>',
    styleUrls: ['./code.scss'],
    imports: [FormsModule, ConfirmDialogModule],
    providers: [ConfirmationService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class CodeComponent implements OnDestroy {
  @ViewChild('editorContainer') editorContentRef!: ElementRef;

  @Input() hasEdited: boolean = false;
  @Input() options: any;
  @Input() content: string = '';
  @Input() @HostBinding('style.height') height: string = '100%';

  @Output() contentChange = new EventEmitter<string>();
  @Output() readonly editorInitialized: EventEmitter<any> =
    new EventEmitter<any>();

  private themeService = inject(ThemeService);
  private loadingService = inject(LoadingService);
  private destroyRef$: Subject<void> = new Subject<void>();
  private editor: any = undefined;

  private disposables: any[] = [];

  private codeService = inject(CodeService);
  private renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      const mode = this.resolveThemeMode(this.themeService.theme());
      if (this.editor && (window as any).monaco) {
        (window as any).monaco.editor.setTheme(`bpmnRunner-${mode}`);
      }
    });

    window.addEventListener('beforeunload', (e) => {
      if (this.hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
  }

  ngAfterViewInit(): void {
    this.loadingService.isLoading.set(true);
    this.codeService
      .getScriptLoadSubject()
      .pipe(takeUntil(this.destroyRef$))
      .subscribe((isLoaded) => {
        if (isLoaded) {
          this.initMonaco();
          this.loadingService.isLoading.set(false);
        }
      });

    fromEvent(window, 'resize')
      .pipe(takeUntil(this.destroyRef$))
      .subscribe(() => {
        if (this.editor) {
          this.editor.layout();
        }
      });
  }

  private hasUnsavedChanges(): boolean {
    if (!this.editor) return false;
    return this.hasEdited;
  }

  private resolveThemeMode(mode: Theme | null = 'light'): 'light' | 'dark' {
    if (!mode) return 'light';

    if (mode === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    return mode!;
  }

  private initMonaco(): void {
    const options = this.options;
    const editorWrapper: HTMLDivElement = this.editorContentRef.nativeElement;

    const monaco = (window as any).monaco;
    if (!monaco) {
      console.warn('Monaco didn\'t loaded.');
      return;
    }

    let mode = this.themeService.theme();
    
    if (mode === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      mode = (isDark) ? 'dark' : 'light'
    }

    if (!monaco.languages.getLanguages().some((l: any) => l.id === 'bpmnRunner')) {
      registerProcessLang(monaco, mode);
    }

    if (!this.editor) {
    this.editor = monaco.editor.create(editorWrapper, {
      ...options,
      language: 'bpmnRunner',
      theme: 'bpmnRunner-' + mode,
    });

    this.editor.setModel(monaco.editor.createModel(this.content, 'bpmnRunner'));

    this.editorInitialized.emit(this.editor);

    this.renderer.setStyle(
      this.editorContentRef.nativeElement,
      'height',
      this.height
    );

    this.setValueEmitter();
    this.editor.layout();
    }
  }

  private setValueEmitter() {
    if (this.editor) {
      const model = this.editor.getModel();
      this.disposables.push(
        model.onDidChangeContent(() => {
          const value = model.getValue();
          this.contentChange.emit(value);
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.destroyRef$.next();
    this.destroyRef$.complete();

    if (this.editor) {
      this.editor.dispose();
      this.editor = undefined;
    }

    this.disposables.forEach((d) => d.dispose());
  }
}