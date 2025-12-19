import Vue from "vue";
import { formattingMixin } from "./shared/mixins/formatting-mixin.component";
import type { ColumnHeader } from "./models/column-header";
import type { DepartmentRow } from "./models/department-row";
import TableFilterRow from "./components/table-filter-row.component";

type MoneyFilterMode = "" | "eq0" | "gt0";
type ActiveFilter =
  | { kind: "text"; header: ColumnHeader; filterText: string }
  | { kind: "money"; header: ColumnHeader; mode: Exclude<MoneyFilterMode, ""> };

export default Vue.extend({
  name: "department-table",
  mixins: [formattingMixin],
  components: {
    "table-filter-row": TableFilterRow,
  },
  props: {
    rows: {
      type: Array,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
  },
  data(): {
    filters: Record<string, any>;
    page: number;
    itemsPerPage: number;
  } {
    return {
      filters: {},
      page: 1,
      itemsPerPage: 10,
    };
  },
  created(): void {
    this.ensureFiltersForHeaders();
  },
  watch: {
    headers: {
      handler(): void {
        this.ensureFiltersForHeaders();
      },
      deep: true,
    },
    filters: {
      handler(): void {
        this.page = 1;
      },
      deep: true,
    },
  },
  computed: {
    normalizedHeaders(): ColumnHeader[] {
      return (this.headers as any) as ColumnHeader[];
    },
    filteredRows(): DepartmentRow[] {
      const activeFilters = this.getActiveFilters(this.normalizedHeaders, this.filters);
      const rows = (this.rows as any) as DepartmentRow[];
      if (!activeFilters.length) return rows;
      return rows.filter((row: DepartmentRow) => this.isRowMatchesFilters(row, activeFilters));
    },
  },
  methods: {
    onSetFilter(payload: { key: string; value: any }): void {
      this.$set(this.filters, payload.key, payload.value);
    },
    normalizeFilterText(raw: any): string {
      return String(raw ?? "").trim().toLowerCase();
    },
    getActiveFilters(headers: ColumnHeader[], filters: Record<string, any>): ActiveFilter[] {
      const activeFilters: ActiveFilter[] = [];
      for (let i = 0; i < headers.length; i++) {
        const header = headers[i];

        if (header.useMoneyFilter) {
          const mode = (filters[header.value] as MoneyFilterMode) || "";
          if (mode === "eq0" || mode === "gt0") activeFilters.push({ kind: "money", header, mode });
          continue;
        }

        const filterText = this.normalizeFilterText(filters[header.value]);
        if (filterText) activeFilters.push({ kind: "text", header, filterText });
      }
      return activeFilters;
    },
    isRowMatchesFilters(row: DepartmentRow, filters: ActiveFilter[]): boolean {
      for (let i = 0; i < filters.length; i++) {
        if (!this.isCellMatchesFilter(row, filters[i])) return false;
      }
      return true;
    },
    isCellMatchesFilter(row: DepartmentRow, filter: ActiveFilter): boolean {
      const raw = this.getCellValue(row, filter.header);

      if (filter.kind === "money") {
        // Treat null/undefined/empty as 0.
        if (raw === null || raw === undefined || raw === "") return filter.mode === "eq0";
        const asNumber = typeof raw === "number" ? raw : Number(raw);
        const value = isFinite(asNumber) ? asNumber : 0;
        return filter.mode === "eq0" ? value === 0 : value > 0;
      }

      const cellText = String(raw ?? "").toLowerCase();
      return cellText.indexOf(filter.filterText) !== -1;
    },
    ensureFiltersForHeaders(): void {
      const headers = this.normalizedHeaders;
      for (let i = 0; i < headers.length; i++) {
        const key = headers[i].value;
        if (!(key in this.filters)) this.$set(this.filters, key, "");
      }
    },
    getCellValue(row: any, header: ColumnHeader | undefined): any {
      if (!header) return undefined;
      if (row === null || row === undefined) return undefined;
      if (!header.getValue) return row[header.value] ?? undefined;
      return header.getValue(row, header);
    },
    formatCell(row: any, header: ColumnHeader): string {
      const raw = this.getCellValue(row, header);
      if (typeof header.formatter !== "function") return String(raw ?? "");
      return header.formatter.call(this, raw, row, header);
    },
  },
  template: `
    <v-card outlined>
      <v-card-title>Departments</v-card-title>
      <v-data-table
        :headers="normalizedHeaders"
        :items="filteredRows"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        :footer-props="{ itemsPerPageOptions: [5, 10, 20, -1] }"
        item-key="id"
        dense
        class="elevation-0"
      >
        <template v-slot:body.prepend>
          <tr
            is="table-filter-row"
            :headers="normalizedHeaders"
            :filters="filters"
            @set-filter="onSetFilter"
          ></tr>
        </template>
        <template v-slot:item="{ item }">
          <tr>
            <td
              v-for="header in normalizedHeaders"
              :key="'cell-' + header.value"
              :style="{ width: header.width }"
            >
              {{ formatCell(item, header) }}
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  `,
});


