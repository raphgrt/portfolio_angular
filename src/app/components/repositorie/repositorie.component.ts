import { Component } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@Component({
  selector: 'app-repositorie',
  standalone: true,
  imports: [PanelModule, BrowserAnimationsModule],
  templateUrl: './repositorie.component.html',
  styleUrl: './repositorie.component.scss'
})
export class RepositorieComponent {}
