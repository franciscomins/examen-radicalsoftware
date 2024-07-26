import {Routes} from '@angular/router';
import { ImportexcelComponent } from './importexcel/importexcel.component';
import { BanxicoFixComponent } from './banxicofix/banxicofix.component';
import { HomeComponent } from './home/home.component';
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'dashboard',
    component: ImportexcelComponent,
  },
  {
    path: 'banxico',
    component: BanxicoFixComponent,
  },
];