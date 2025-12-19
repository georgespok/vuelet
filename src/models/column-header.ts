export interface ColumnHeader {
  text: string;
  value: string;
  width: string;
  /**
   * If true, this column uses the money filter dropdown (All, = 0, > 0)
   * instead of the default free-text filter.
   */
  useMoneyFilter?: boolean;
  formatter: (this: any, value: any, row: any, header: ColumnHeader) => string;
  getValue?: (row: any, header: ColumnHeader) => any;
}

