import type { ColumnHeader } from "../models/column-header";
import type { ActiveFilter, MoneyFilterCondition } from "./table-filtering.types";

export namespace Filtering {
  export class TableFiltering {
    static normalizeFilterText(raw: any): string {
      return String(raw ?? "").trim().toLowerCase();
    }

    static getActiveFilters(headers: ColumnHeader[], filters: Record<string, any>): ActiveFilter[] {
      const activeFilters: ActiveFilter[] = [];
      for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        const filterSpec = header.filterSpec;

        if (filterSpec?.kind === "select") {
          const raw = filters[header.value];
          const values = Array.isArray(raw) ? (raw.filter((x) => x !== null && x !== undefined) as Array<string | number>) : [];
          if (values.length) activeFilters.push({ kind: "select", header, values });
          continue;
        }

        if (filterSpec?.kind === "money") {
          const condition = (filters[header.value] as MoneyFilterCondition) || "";
          if (condition === "eq0" || condition === "gt0") {
            activeFilters.push({ kind: "money", header, condition });
          }
          continue;
        }

        const filterText = TableFiltering.normalizeFilterText(filters[header.value]);
        if (filterText) activeFilters.push({ kind: "text", header, filterText });
      }
      return activeFilters;
    }

    static defaultGetCellValue(row: any, header: ColumnHeader | undefined): any {
      if (!header) return undefined;
      if (row === null || row === undefined) return undefined;

      if (!header.getValue) {
        return row[header.value] ?? undefined;
      }

      return header.getValue(row, header);
    }

    static isCellValueMatchesFilter(raw: any, filter: ActiveFilter): boolean {
      if (filter.kind === "select") {
        return filter.values.indexOf(raw as any) !== -1;
      }

      if (filter.kind === "money") {
        // Treat null/undefined/empty as 0.
        if (raw === null || raw === undefined || raw === "") return filter.condition === "eq0";
        const asNumber = typeof raw === "number" ? raw : Number(raw);
        const value = isFinite(asNumber) ? asNumber : 0;
        return filter.condition === "eq0" ? value === 0 : value > 0;
      }

      const cellText = String(raw ?? "").toLowerCase();
      return cellText.indexOf(filter.filterText) !== -1;
    }

    static isRowMatchesFilters<Row>(
      row: Row,
      filters: ActiveFilter[],
      getCellValue: (row: Row, header: ColumnHeader | undefined) => any
    ): boolean {
      for (let i = 0; i < filters.length; i++) {
        const filter = filters[i];
        const raw = getCellValue(row, filter.header);
        if (!TableFiltering.isCellValueMatchesFilter(raw, filter)) return false;
      }
      return true;
    }
  }
}


