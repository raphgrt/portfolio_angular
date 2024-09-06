import { Component } from '@angular/core';
import {WelcomeComponent} from "../components/welcome/welcome.component";
import {RepositorieComponent} from "../components/repositorie/repositorie.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    WelcomeComponent,
    RepositorieComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
