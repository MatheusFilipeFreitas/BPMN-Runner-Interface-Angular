import { Component, ElementRef, OnInit, OnDestroy, ViewChild, inject, effect } from '@angular/core';
import Modeler from 'bpmn-js/lib/Modeler';

// módulos extras
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import { XmlService } from '../../services/xml.service';
import { IconComponent } from '../icon/icon';
import { LoadingService } from '../../services/loading.service';
import LoadComponent from '../load/load';

@Component({
  selector: 'app-viewer',
  imports: [IconComponent, LoadComponent],
  template: `
  <div class="viewer-toolbar">
    <button class="fullscreen-button" type="button" (click)="toggleFullscreen()">
      <app-icon class="app-icon_high-contrast">fullscreen</app-icon>
    </button>
    <button class="fullscreen-button" type="button" (click)="downloadXml()">
      <app-icon class="app-icon_high-contrast">download</app-icon>
    </button>
  </div>
  @if (loadingService.isLoadingRequest()) {
    <app-loading></app-loading>
  } 
    <div #canvas class="bpmn-container"></div>
  `,
  styleUrls: ['./viewer.scss']
})
export default class ViewerComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) private canvasRef!: ElementRef;

  private xmlService = inject(XmlService);
  loadingService = inject(LoadingService);
  private bpmnModeler!: Modeler;

  constructor() {
    effect(async () => {
        const xml = this.xmlService.content();
        if (!xml || !this.bpmnModeler) return;

        try {
          await this.bpmnModeler.importXML(xml);
          const canvas: any = this.bpmnModeler.get('canvas');
          const eventBus: any = this.bpmnModeler.get('eventBus');
          const selection: any = this.bpmnModeler.get('selection');
          canvas.zoom('fit-viewport');

          eventBus.on('canvas.click', (event: any) => {
            if (!event.originalEvent.target.closest('.djs-element')) {
              selection.clear();
            }
          });

        } catch (err) {
          console.error('Erro ao carregar diagrama BPMN:', err);
        }
      });
  }

  ngOnInit() {
    this.bpmnModeler = new Modeler({
      container: this.canvasRef.nativeElement,
      additionalModules: [
        ZoomScrollModule,
        MoveCanvasModule
      ]
    });
  }

  ngOnDestroy(): void {
    this.bpmnModeler?.destroy();
  }

  toggleFullscreen(): void {
    const el = this.canvasRef.nativeElement as HTMLElement;

    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(err => {
        console.error('Error trying to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen?.().catch(err => {
        console.error('Error trying to exit fullscreen:', err);
      });
    }
  }

  async downloadXml(): Promise<void> {
    try {
      if (!this.bpmnModeler) {
        console.warn('Viewer not initialized');
        return;
      }
      const result = await this.bpmnModeler.saveXML({ format: true });
      const xml: string = result?.xml ?? '';

      if (!xml.trim()) {
        console.warn('No XML content available to download.');
        return;
      }

      const blob = new Blob([xml], { type: 'application/xml' });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bpmn-runner-diagram.bpmn';
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting BPMN XML:', err);
    }
  }

}
