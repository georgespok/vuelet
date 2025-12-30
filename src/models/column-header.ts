export type MoneyFilterCondition = "" | "eq0" | "gt0";

export type FilterItem<TValue extends string | number = string | number> = {
  text: string;
  value: TValue;
};

export type FilterSpec =
  | { kind: "text"; placeholder?: string }
  | { kind: "money"; items: Array<FilterItem<MoneyFilterCondition>> }
  | { kind: "select"; multiple: true; items: Array<FilterItem<string | number>>; clearable?: boolean };

export interface ColumnHeader {
  text: string;
  value: string;
  width: string;
  /**
   * Column filter configuration, used by the filter-row UI and the filtering policy.
   *
   * Note: we avoid the name `filter` because Vuetify's `v-data-table` headers already
   * use `filter` as a per-column filter function.
   */
  filterSpec?: FilterSpec;
  formatter: (this: any, value: any, row: any, header: ColumnHeader) => string;
  getValue?: (row: any, header: ColumnHeader) => any;
}

