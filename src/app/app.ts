import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import NavigationComponent from './components/navigation/navigation';
import { CommonModule } from '@angular/common';
import { LoadingService } from './services/loading.service';
import LoadComponent from './components/load/load';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationComponent, LoadComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('bpmn-runner-doc-page');
  loadingService = inject(LoadingService);
}
