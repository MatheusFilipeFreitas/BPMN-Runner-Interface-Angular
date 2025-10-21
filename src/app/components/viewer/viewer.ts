import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import BpmnJS from 'bpmn-js/dist/bpmn-viewer.production.min.js';

@Component({
  selector: 'app-viewer',
  standalone: true,
  template: `<div #canvas class="bpmn-container"></div>`,
  styles: [`
    .bpmn-container {
        width: 100%;
        height: 518px;
        border: 1px solid #ccc;
        border-radius: 0;
        color: var(--primary-contrast);
        background-color: #ffffff;
    }
  `]
})
export default class ViewerComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) private canvasRef!: ElementRef;
  private bpmnViewer!: BpmnJS;

  async ngOnInit() {
    this.bpmnViewer = new BpmnJS({ container: this.canvasRef.nativeElement });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI"
  targetNamespace="http://bpmn.io/schema/bpmn">
  <process id="Process_1" isExecutable="false">
    <startEvent id="StartEvent_1" name="Start" />
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="Shape_StartEvent_1" bpmnElement="StartEvent_1">
        <omgdc:Bounds x="150" y="150" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`;

    try {
      await this.bpmnViewer.importXML(xml);
      const canvas: any = this.bpmnViewer.get('canvas');
      canvas.zoom('fit-viewport');
    } catch (err) {
      console.error('Erro ao carregar diagrama BPMN:', err);
    }
  }

  ngOnDestroy(): void {
    this.bpmnViewer?.destroy();
  }
}
