import { Component, ViewChild, AfterViewInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Chart, registerables } from 'chart.js';
import { ExcelData, defaultExcelData } from '../interface/dataExcel';
import { MatIconModule } from '@angular/material/icon';

Chart.register(...registerables);

@Component({
  selector: 'app-importexcel',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './importexcel.component.html',
  styleUrls: ['./importexcel.component.css']
})
export class ImportexcelComponent implements AfterViewInit {
  data: ExcelData[] = [defaultExcelData];
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<ExcelData>(this.data);
  dataCargada: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  barChart: any;
  pieChart: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Solo se puede insertar un solo archivo');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      // Leer los datos del archivo Excel
      const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];

      if (rawData.length > 1) {
        const headers = rawData[0];
        this.data = rawData.slice(1).map(row => {
          const obj: any = {};
          headers.forEach((header: string, index: number) => {
            obj[header] = row[index];
          });
          this.dataCargada = true;
          return obj;
        });
        console.log('DATA EXCEL', this.data);

        // Obtener los encabezados de las columnas
        this.displayedColumns = this.getHeaders();
        // Actualizar el DataSource de la tabla
        this.dataSource.data = this.data;

        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }

        // Crear las gráficas
        this.createBarChart();
        this.createPieChart();
      } else {
        this.data = [];
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  getHeaders(): string[] {
    return this.data.length > 0 ? Object.keys(this.data[0]) : [];
  }

  getMinSaldo(): any {
    return this.data.reduce((min, p) => (Number(p.SALDO_ACTUAL) < Number(min.SALDO_ACTUAL) ? p : min), this.data[0]);
  }

  getMaxSaldo(): any {
    return this.data.reduce((max, p) => (Number(p.SALDO_ACTUAL) > Number(max.SALDO_ACTUAL) ? p : max), this.data[0]);
  }

  getSumSaldo(): number {
    return this.data.reduce((sum, p) => sum + (Number(p.SALDO_ACTUAL) || 0), 0);
  }

  getSumLimiteCredito(): number {
    return this.data.reduce((sum, p) => sum + (Number(p.LIMITE_DE_CREDITO) || 0), 0);
  }

  getSumSaldoVencido(): number {
    return this.data.reduce((sum, p) => sum + (Number(p.SALDO_VENCIDO) || 0), 0);
  }

  getTotalRegistros(): number {
    return this.data.length;
  }

  formatDate(dateStr: string): string {
    if (!dateStr || dateStr.length !== 8) return '';

    const day = dateStr.substring(0, 2);
    const month = dateStr.substring(2, 4);
    const year = dateStr.substring(4, 8);

    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString('es-ES');
  }

  formatCurrency(value: any): string {
    const numberValue = parseFloat(value);
    if (isNaN(numberValue)) return '';

    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 }).format(numberValue);
  }

  createBarChart() {
    const estados = Array.from(new Set(this.data.map(item => item.ESTADO)));
    const saldoActualPorEstado = estados.map(estado => {
      return this.data
        .filter(item => item.ESTADO === estado)
        .reduce((sum, item) => sum + Number(item.SALDO_ACTUAL || 0), 0);
    });

    if (this.barChart) {
      this.barChart.destroy();
    }

    this.barChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: estados,
        datasets: [{
          label: 'Saldo Actual por Estado',
          data: saldoActualPorEstado,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';

                const value = Number(context.raw) || 0;
                return `${label}: ${new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)}`;
              }
            }
          }
        }
      }
    });
  }

  createPieChart() {
    const limiteCredito = this.data.reduce((sum, item) => sum + Number(item.LIMITE_DE_CREDITO || 0), 0);
    const saldoActual = this.data.reduce((sum, item) => sum + Number(item.SALDO_ACTUAL || 0), 0);
    const saldoDisponible = limiteCredito - saldoActual;

    if (this.pieChart) {
      this.pieChart.destroy();
    }

    this.pieChart = new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: ['Saldo Actual', 'Saldo Disponible'],
        datasets: [{
          data: [saldoActual, saldoDisponible],
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = Number(context.raw) || 0;
                return `${label}: ${new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)}`;
              }
            }
          }
        }
      }
    });
  }
}
