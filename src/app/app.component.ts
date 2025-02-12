import { NavbarComponent } from './navbar/navbar.component';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ImportexcelComponent } from "./importexcel/importexcel.component";
import { BanxicoFixComponent } from "./banxicofix/banxicofix.component";



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ImportexcelComponent, NavbarComponent,BanxicoFixComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'examen-radicalsoftware';


  constructor(  private route: ActivatedRoute,
    private router: Router,){}
}
