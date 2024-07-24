import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ExcelService } from './excel.service';
import { HttpClient } from '@angular/common/http';
import { ChartDataset, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['NOMBRE', 'SALDO_ACTUAL', 'LIMITE_DE_CREDITO', 'SALDO_VENCIDO', 'SALDO_DISPONIBLE'];
  dataSource = new MatTableDataSource<any>();
  minSaldo: any;
  maxSaldo: any;
  sumaSaldos: number;
  sumaLimites: number;
  sumaVencidos: number;
  sumaDisponibles: number;
  totalRegistros: number;
  temperaturaActual: string;

  // Gráficas
  barChartOptions: ChartOptions = { responsive: true };
  barChartLabels: Label[] = [];
  barChartType: string = 'bar';
  barChartLegend = true;
  barChartData: ChartDataset[] = [{ data: [], label: 'SALDO_ACTUAL' }];

  pieChartOptions: ChartOptions = { responsive: true };
  pieChartLabels: Label[] = ['SALDO_ACTUAL', 'SALDO_DISPONIBLE'];
  pieChartType: string = 'pie';
  pieChartLegend = true;
  pieChartData: ChartDataset[] = [{ data: [], label: 'LIMITE_DE_CREDITO' }];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private excelService: ExcelService, private http: HttpClient) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;

    // Cargar el archivo Excel desde una URL (opcional)
    // const fileUrl = 'https://tu-servidor.com/ruta/al/archivo/base.xlsx';
    // this.excelService.loadFileFromUrl(fileUrl).subscribe(data => this.procesarDatos(data));

    // Obtener la temperatura actual
    this.obtenerTemperaturaActual('TuCiudad');
  }

  onFileChange(event: any) {
    this.excelService.readFile(event).then(data => this.procesarDatos(data));
  }

  procesarDatos(data: any[]) {
    this.dataSource.data = data;
    this.minSaldo = data.reduce((prev, curr) => prev.SALDO_ACTUAL < curr.SALDO_ACTUAL ? prev : curr);
    this.maxSaldo = data.reduce((prev, curr) => prev.SALDO_ACTUAL > curr.SALDO_ACTUAL ? prev : curr);
    this.sumaSaldos = data.reduce((acc, curr) => acc + curr.SALDO_ACTUAL, 0);
    this.sumaLimites = data.reduce((acc, curr) => acc + curr.LIMITE_DE_CREDITO, 0);
    this.sumaVencidos = data.reduce((acc, curr) => acc + curr.SALDO_VENCIDO, 0);
    this.sumaDisponibles = data.reduce((acc, curr) => acc + (curr.LIMITE_DE_CREDITO - curr.SALDO_ACTUAL), 0);
    this.totalRegistros = data.length;

    this.generarGraficas(data);
  }

  generarGraficas(data: any[]) {
    this.barChartLabels = Array.from(new Set(data.map(d => d.ESTADO)));
    this.barChartData[0].data = this.barChartLabels.map(label => {
      return data.filter(d => d.ESTADO === label).reduce((acc, curr) => acc + curr.SALDO_ACTUAL, 0);
    });

    this.pieChartData[0].data = [
      data.reduce((acc, curr) => acc + curr.SALDO_ACTUAL, 0),
      data.reduce((acc, curr) => acc + (curr.LIMITE_DE_CREDITO - curr.SALDO_ACTUAL), 0)
    ];
  }

  obtenerTemperaturaActual(ciudad: string) {
    const apiKey = 'TuAPIKey';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric`;
    this.http.get(url).subscribe((data: any) => {
      this.temperaturaActual = `${data.main.temp} °C`;
    });
  }
}
