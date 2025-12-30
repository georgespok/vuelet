import type { ColumnHeader, MoneyFilterCondition } from "../models/column-header";

export type { MoneyFilterCondition } from "../models/column-header";

export type ActiveFilter =
  | { kind: "text"; header: ColumnHeader; filterText: string }
  | { kind: "money"; header: ColumnHeader; condition: Exclude<MoneyFilterCondition, ""> }
  | { kind: "select"; header: ColumnHeader; values: Array<string | number> };


