import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { BanxicoService } from '../services/banxico.service'; 
import { BanxicoData } from '../interface/Banxico';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-banxicofix',
  standalone: true,
  imports: [
    FormsModule, 
    NgIf,
    NgFor,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './banxicofix.component.html',
  styleUrls: ['./banxicofix.component.css']
})
export class BanxicoFixComponent implements AfterViewInit {
  fechaIni: string = '';
  fechaFin: string = ''; 
  exchangeRates: BanxicoData[] = [];
  displayedColumns: string[] = ['fecha', 'dato'];
  dataSource = new MatTableDataSource<BanxicoData>(this.exchangeRates);
  token = 'c47a0fea006717fcfc21e34b04576c32d809362863d1ee92bc16eeb6d9e5e948'; 

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private banxicoService: BanxicoService) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchExchangeRates() {
    if (!this.fechaIni || !this.fechaFin) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    this.banxicoService.getFix(this.fechaIni, this.fechaFin, this.token).subscribe({
      next: (data: any) => {
        this.exchangeRates = data.bmx.series[0].datos;
        this.dataSource.data = this.exchangeRates; 
        this.dataSource.paginator = this.paginator; 
        this.dataSource.sort = this.sort; 
      },
      error: error => {
        console.error('Error al obtener los datos', error);
      }
    });
  }
}
