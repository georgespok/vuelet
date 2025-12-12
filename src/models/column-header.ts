export interface ColumnHeader {
  text: string;
  value: string;
  width: string;
  formatter: (this: any, value: any, row: any, header: ColumnHeader) => string;
}

