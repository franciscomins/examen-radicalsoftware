export interface ExcelData {
  PRIMER_NOMBRE: string;
  SEGUNDO_NOMBRE: string;
  APELLIDO_PATERNO: string;
  APELLIDO_MATERNO: string;
  FECHA_DE_NACIMIENTO: string;
  RFC: string;
  COLONIA_O_POBLACION: string;
  DELEGACION_O_MUNICIPIO: string;
  CIUDAD: string;
  ESTADO: string;
  CP: string;
  DIRECCION_CALLE_NUMERO: string;
  SALDO_ACTUAL: number;
  LIMITE_DE_CREDITO: number;
  SALDO_VENCIDO: number;
}

export const defaultExcelData: ExcelData = {
  PRIMER_NOMBRE: '',
  SEGUNDO_NOMBRE: '',
  APELLIDO_PATERNO: '',
  APELLIDO_MATERNO: '',
  FECHA_DE_NACIMIENTO: '',
  RFC: '',
  COLONIA_O_POBLACION: '',
  DELEGACION_O_MUNICIPIO: '',
  CIUDAD: '',
  ESTADO: '',
  CP: '',
  DIRECCION_CALLE_NUMERO: '',
  SALDO_ACTUAL: 0,
  LIMITE_DE_CREDITO: 0,
  SALDO_VENCIDO: 0
};
