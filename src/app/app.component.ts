import { NavbarComponent } from './navbar/navbar.component';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImportexcelComponent } from "./importexcel/importexcel.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ImportexcelComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'examen-radicalsoftware';
}
