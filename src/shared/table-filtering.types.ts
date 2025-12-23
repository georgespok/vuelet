import type { ColumnHeader } from "../models/column-header";

export type MoneyFilterCondition = "" | "eq0" | "gt0";

export type ActiveFilter =
  | { kind: "text"; header: ColumnHeader; filterText: string }
  | { kind: "money"; header: ColumnHeader; condition: Exclude<MoneyFilterCondition, ""> };


