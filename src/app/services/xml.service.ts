import { Injectable, signal } from "@angular/core";

const initialSampleContent = `<definitions xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="definitions_01680c8f-0000-4b3d-b821-e76855d13123" targetNamespace="http://camunda.org/examples" xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL">
<process id="pc1" isExecutable="true" name="">
    <startEvent id="s1"/>
    <manualTask id="t1" name="Manual test"/>
    <endEvent id="e1"/>
    <sequenceFlow id="flow_s1_t1" sourceRef="s1" targetRef="t1"/>
    <sequenceFlow id="flow_t1_e1" sourceRef="t1" targetRef="e1"/>
  </process>
  <collaboration id="collaboration_1761171089524">
    <participant id="p1" name="Pool test" processRef="pc1"/>
  </collaboration>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1761171089528">
    <bpmndi:BPMNPlane bpmnElement="collaboration_1761171089524" id="BPMNPlane_1761171089528">
      <bpmndi:BPMNShape bpmnElement="s1" id="Shape_s1">
        <dc:Bounds height="80.0" width="100.0" x="150.0" y="100.0"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="t1" id="Shape_t1">
        <dc:Bounds height="80.0" width="100.0" x="350.0" y="100.0"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="e1" id="Shape_e1">
        <dc:Bounds height="80.0" width="100.0" x="550.0" y="100.0"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="p1" id="Shape_p1">
        <dc:Bounds height="230.0" width="650.0" x="100.0" y="50.0"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge bpmnElement="flow_s1_t1" id="Edge_flow_s1_t1">
        <di:waypoint x="250.0" y="140.0"/>
        <di:waypoint x="350.0" y="140.0"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="flow_t1_e1" id="Edge_flow_t1_e1">
        <di:waypoint x="450.0" y="140.0"/>
        <di:waypoint x="550.0" y="140.0"/>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`;

@Injectable({
    providedIn: 'root'
})
export class XmlService {
    private parser = new DOMParser();
    content = signal<string>(initialSampleContent);
    document = signal<Document>(this.parser.parseFromString(initialSampleContent, 'application/xml'));

    setNewXmlContent(content: string): void {
        this.content.set(content);
        const xmlDoc = this.parser.parseFromString(content, 'application/xml');
        this.document.set(xmlDoc);
    }
}