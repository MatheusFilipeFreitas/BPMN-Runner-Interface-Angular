import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import DocNavigatorComponent from "./components/doc-navigator";
import { navigationLayers } from "./components/data/navigation-options";
import { HttpClient } from "@angular/common/http";
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { take } from "rxjs";

@Component({
  selector: "app-doc",
  imports: [DocNavigatorComponent],
  templateUrl: "./doc.html",
  styleUrls: ["./doc.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class DocComponent {
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);
  
  selectedItemId = signal<string>('introduction >> what-is');
  navigationLayers = navigationLayers;
  docHtml = signal<SafeHtml | null>(null);

  constructor() {
    this.loadMarkdown();
  }

  private loadMarkdown(): void {
    const [section, file] = this.selectedItemId().split(' >> ');
    const url = `assets/docs/${section}/${file}.md`;

    this.http.get(url, { responseType: 'text' }).pipe(take(1)).subscribe({
      next: (content) => {
        const html = marked.parse(content).toString();
        this.docHtml.set(this.sanitizer.bypassSecurityTrustHtml(html));
      },
      error: () => {
        this.docHtml.set(
          this.sanitizer.bypassSecurityTrustHtml('<p>⚠️ Documentation not found.</p>')
        );
      }
    });
  }

  selectItem(id: string): void {
    if (!id.trim()) {
      console.error('Id of navigation bar cannot be empty');
      return;
    }

    this.selectedItemId.set(id);
    this.loadMarkdown();

    requestAnimationFrame(() => {
      const container = document.querySelector('.doc-main-content');
      if (!container) return;

      const observer = new MutationObserver(() => {
        observer.disconnect();

        if (container.scrollHeight > container.clientHeight) {
          container.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
      observer.observe(container, { childList: true, subtree: true });
    });
  }


  get getTitle(): string {
    const currentId = this.selectedItemId();

    for (const layer of navigationLayers) {
      if (layer.childs) {
        const child = layer.childs.find(c => c.id === currentId);
        if (child) {
          return child.title;
        }
      }
      if (layer.id === currentId) {
        return layer.title;
      }
    }
    return 'Unknown Section';
  }
}