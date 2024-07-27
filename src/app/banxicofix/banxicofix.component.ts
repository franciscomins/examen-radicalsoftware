import { Component, ViewChild, AfterViewInit, inject } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UpdateTokenDialogComponent, DialogData } from '../banxicofix/update-token-dialog/update-token-dialog.component';

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
    MatProgressBarModule
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

  showTable: boolean = false;
  progressbar: boolean = false;
  readonly dialog = inject(MatDialog);

  constructor(private banxicoService: BanxicoService) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  fetchExchangeRates() {
    if (!this.fechaIni || !this.fechaFin) {
      Swal.fire({
        text: "Por favor, complete todos los campos.",
        icon: "warning"
      });
      return;
    }

    if (this.fechaIni > this.fechaFin) {
      Swal.fire({
        text: "La fecha inicial debe ser menor a la fecha final.",
        icon: "warning"
      });
      return;
    }

    const today = this.getTodayDate();
    if (this.fechaFin > today) {
      Swal.fire({
        text: "La fecha final no puede estar fuera del rango de la fecha actual.",
        icon: "warning"
      });
      return;
    }

    this.progressbar = true;

    this.banxicoService.getFix(this.fechaIni, this.fechaFin, this.token).subscribe({
      next: (data: any) => {
        this.exchangeRates = data.bmx.series[0].datos;
        this.dataSource.data = this.exchangeRates;
        this.showTable = this.exchangeRates.length > 0;

        this.progressbar = false;
      },
      error: error => {
        console.error('Error al obtener los datos', error);
        this.progressbar = false;
      }
    });
  }

  openUpdateTokenDialog(): void {
    const dialogRef = this.dialog.open(UpdateTokenDialogComponent, {
      data: { token: this.token },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.token = result;
        Swal.fire({
          text: "Token actualizado exitosamente.",
          icon: "success"
        });
      }
    });
  }
}
