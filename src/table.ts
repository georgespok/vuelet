import Vue from "vue";
import { formattingMixin } from "./shared/mixins/formatting-mixin.component";
import type { ColumnHeader } from "./models/column-header";
import type { PersonRow } from "./models/person-row";

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
    filteredRows(): PersonRow[] {
      const rows = (this.rows as any) as PersonRow[];
      const headers = this.normalizedHeaders;
      const filters = this.filters;

      const activeFilters: Array<{ key: string; needle: string }> = [];
      for (let i = 0; i < headers.length; i++) {
        const key = headers[i].value;
        const raw = filters[key];
        const needle = ((raw as any) || "").toString().trim().toLowerCase();
        if (needle.length > 0) activeFilters.push({ key, needle });
      }

      if (activeFilters.length === 0) return rows;

      return rows.filter((row: PersonRow) => {
        for (let i = 0; i < activeFilters.length; i++) {
          const filter = activeFilters[i];
          const cellRaw = this.resolveValue(row, filter.key);
          const cell = String(cellRaw ?? "").toLowerCase();
          if (cell.indexOf(filter.needle) === -1) return false;
        }
        return true;
      });
    },
  },
  methods: {
    ensureFiltersForHeaders(): void {
      const headers = this.normalizedHeaders;
      for (let i = 0; i < headers.length; i++) {
        const key = headers[i].value;
        if (!(key in this.filters)) this.$set(this.filters, key, "");
      }
    },
    resolveValue(row: any, path: string): any {
      if (!path) return undefined;

      // Support dot-paths and simple bracket notation, e.g. `expenses[0].value`
      const normalizedPath = path.replace(/\[(\d+)\]/g, ".$1");

      if (normalizedPath.indexOf(".") === -1) return row ? row[normalizedPath] : undefined;

      const parts = normalizedPath.split(".");
      let current: any = row;
      for (let i = 0; i < parts.length; i++) {
        if (current === null || current === undefined) return undefined;
        current = current[parts[i]];
      }
      return current;
    },
    formatCell(row: any, header: ColumnHeader): string {
      const raw = this.resolveValue(row, header.value);
      if (typeof header.formatter !== "function") return String(raw ?? "");
      return header.formatter.call(this, raw, row, header);
    },
    customSort(items: any[], sortBy: string[], sortDesc: boolean[]): any[] {
      if (!Array.isArray(sortBy) || sortBy.length === 0) return items;

      const copy = items.slice();

      const compare = (a: any, b: any): number => {
        for (let i = 0; i < sortBy.length; i++) {
          const key = sortBy[i];
          const desc = !!(sortDesc && sortDesc[i]);

          const aRaw = this.resolveValue(a, key);
          const bRaw = this.resolveValue(b, key);

          const aNull = aRaw === null || aRaw === undefined;
          const bNull = bRaw === null || bRaw === undefined;
          if (aNull && bNull) continue;
          if (aNull) return desc ? 1 : -1;
          if (bNull) return desc ? -1 : 1;

          const aNum = typeof aRaw === "number" ? aRaw : Number(aRaw);
          const bNum = typeof bRaw === "number" ? bRaw : Number(bRaw);

          let cmp = 0;
          if (Number.isFinite(aNum) && Number.isFinite(bNum)) {
            cmp = aNum === bNum ? 0 : aNum < bNum ? -1 : 1;
          } else {
            const aStr = String(aRaw);
            const bStr = String(bRaw);
            cmp = aStr.localeCompare(bStr);
          }

          if (cmp !== 0) return desc ? -cmp : cmp;
        }
        return 0;
      };

      copy.sort(compare);
      return copy;
    },
  },
  template: `
    <v-card outlined>
      <v-card-title>People</v-card-title>
      <v-data-table
        :headers="normalizedHeaders"
        :items="filteredRows"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        :custom-sort="customSort"
        :footer-props="{ itemsPerPageOptions: [5, 10, 20, -1] }"
        item-key="id"
        dense
        class="elevation-0"
      >
        <template v-slot:body.prepend>
          <tr>
            <td v-for="header in normalizedHeaders" :key="'filter-' + header.value" :style="{ width: header.width }">
              <v-text-field
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
