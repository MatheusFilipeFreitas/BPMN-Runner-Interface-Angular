import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import NavigationComponent from './components/navigation/navigation';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('bpmn-runner-doc-page');
}
