import Vue from "vue";
import { formattingMixin } from "./shared/mixins/formatting-mixin.component";
import type { ColumnHeader } from "./models/column-header";
import type { PersonRow } from "./models/person-row";

type ExpenseFilterMode = "" | "eq0" | "gt0";
type ActiveFilter =
  | { kind: "text"; header: ColumnHeader; filterText: string }
  | { kind: "expense"; header: ColumnHeader; mode: Exclude<ExpenseFilterMode, ""> };

export default Vue.extend({
  name: "PeopleTable",
  mixins: [formattingMixin],
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
    
    headerByValue(): Record<string, ColumnHeader> {
      const headers = this.normalizedHeaders;
      const map: Record<string, ColumnHeader> = {};
      for (let i = 0; i < headers.length; i++) {
        map[headers[i].value] = headers[i];
      }
      return map;
    },

    filteredRows(): PersonRow[] {
      const activeFilters = this.getActiveFilters(this.normalizedHeaders, this.filters);      
      const rows = (this.rows as any) as PersonRow[];
      if (!activeFilters.length) { 
        return rows; 
      }

      return rows.filter((row: PersonRow) => this.isRowMatchesFilters(row, activeFilters));
    },
  },
  methods: {
    isExpenseHeader(header: ColumnHeader): boolean {
      // All expense columns use a dropdown filter instead of free-text.
      return typeof header.value === "string" && header.value.indexOf("expenses") === 0;
    },
    normalizeFilterText(raw: any): string {
      return String(raw ?? "").trim().toLowerCase();
    },
    getActiveFilters(headers: ColumnHeader[], filters: Record<string, any>): ActiveFilter[] {
      const activeFilters: ActiveFilter[] = [];
      for (let i = 0; i < headers.length; i++) {
        const header = headers[i];

        if (this.isExpenseHeader(header)) {
          const mode = (filters[header.value] as ExpenseFilterMode) || "";
          if (mode === "eq0" || mode === "gt0") activeFilters.push({ kind: "expense", header, mode });
          continue;
        }

        const filterText = this.normalizeFilterText(filters[header.value]);
        if (filterText) activeFilters.push({ kind: "text", header, filterText });
      }
      return activeFilters;
    },
    isRowMatchesFilters(row: PersonRow, filters: ActiveFilter[]): boolean {
      for (let i = 0; i < filters.length; i++) {
        if (!this.isCellMatchesFilter(row, filters[i])) { 
          return false; 
        }
      }
      return true;
    },
    isCellMatchesFilter(row: PersonRow, filter: ActiveFilter): boolean {
      const raw = this.getCellValue(row, filter.header);

      if (filter.kind === "expense") {
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
      
      if (!header) {
        return undefined;
      }

      if (row === null || row === undefined) {
        return undefined;
      }
      
      if (!header.getValue) {
        return row[header.value] ?? undefined;
      }

      return header.getValue(row, header);
    },
    formatCell(row: any, header: ColumnHeader): string {
      const raw = this.getCellValue(row, header);
      if (typeof header.formatter !== "function") return String(raw ?? "");
      return header.formatter.call(this, raw, row, header);
    }    
  },
  template: `
    <v-card outlined>
      <v-card-title>People</v-card-title>
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
          <tr>
            <td v-for="header in normalizedHeaders" :key="'filter-' + header.value" :style="{ width: header.width }">
              <v-select
                v-if="isExpenseHeader(header)"
                v-model="filters[header.value]"
                :items="[
                  { text: 'All', value: '' },
                  { text: '= 0', value: 'eq0' },
                  { text: '> 0', value: 'gt0' }
                ]"
                item-text="text"
                item-value="value"
                dense
                hide-details
                class="ma-0 pa-0"
              />
              <v-text-field
                v-else
                v-model="filters[header.value]"
                dense
                clearable
                hide-details
                placeholder="Filter"
                class="ma-0 pa-0"
              />
            </td>
          </tr>
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
