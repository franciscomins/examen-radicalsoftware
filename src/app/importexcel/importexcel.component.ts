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

@Component({
  selector: 'app-importexcel',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './importexcel.component.html',
  styleUrls: ['./importexcel.component.css']
})
export class ImportexcelComponent implements AfterViewInit {
  data: any[] = [];
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>(this.data);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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
          return obj;
        });
        console.log('DATA EXCEL', this.data);
      } else {
        this.data = [];
      }

      // Obtener los encabezados de las columnas
      this.displayedColumns = this.getHeaders();

      // Actualizar el DataSource de la tabla
      this.dataSource.data = this.data;
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
    return date.toLocaleDateString('es-ES'); // Ajusta el formato de la fecha según sea necesario
  }

  formatCurrency(value: any): string {
    const numberValue = parseFloat(value);
    if (isNaN(numberValue)) return '';
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 }).format(numberValue);  
  }
}
