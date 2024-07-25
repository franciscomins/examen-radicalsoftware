import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
//import { NgChartsModule } from 'ng2-charts';

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
    //NgChartsModule
  ],
  templateUrl: './importexcel.component.html',
  styleUrls: ['./importexcel.component.css']
})
export class ImportexcelComponent {
  data: any[] = [];
  chartLabels: string[] = [];
  chartData: any[] = [{ data: [], label: 'SALDO_ACTUAL' }];
  chartOptions = {
    responsive: true,
  };

  // Método para manejar el cambio de archivo
  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Solo se puede insertar un solo archivo');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      this.data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      this.processChartData();
    };
    reader.readAsBinaryString(target.files[0]);
  }

  // Método para obtener los encabezados de las columnas
  getHeaders(): string[] {
    return this.data.length > 0 ? Object.keys(this.data[0]) : [];
  }

  // Métodos para obtener los cálculos necesarios
  getMinSaldo(): any {
    return this.data.reduce((min, p) => p.SALDO_ACTUAL < min.SALDO_ACTUAL ? p : min, this.data[0]);
  }

  getMaxSaldo(): any {
    return this.data.reduce((max, p) => p.SALDO_ACTUAL > max.SALDO_ACTUAL ? p : max, this.data[0]);
  }

  getSumSaldo(): number {
    return this.data.reduce((sum, p) => sum + p.SALDO_ACTUAL, 0);
  }

  getSumLimiteCredito(): number {
    return this.data.reduce((sum, p) => sum + p.LIMITE_DE_CREDITO, 0);
  }

  getSumSaldoVencido(): number {
    return this.data.reduce((sum, p) => sum + p.SALDO_VENCIDO, 0);
  }

  getSumSaldoDisponible(): number {
    return this.data.reduce((sum, p) => sum + (p.LIMITE_DE_CREDITO - p.SALDO_ACTUAL), 0);
  }

  getTotalRegistros(): number {
    return this.data.length;
  }

  // Método para procesar los datos de la gráfica
  processChartData() {
    const estados = [...new Set(this.data.map(d => d.ESTADO))];
    this.chartLabels = estados;
    const saldoData = estados.map(estado => {
      return this.data
        .filter(d => d.ESTADO === estado)
        .reduce((sum, d) => sum + d.SALDO_ACTUAL, 0);
    });
    this.chartData = [{ data: saldoData, label: 'SALDO_ACTUAL' }];
  }
}
