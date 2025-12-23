import Vue from "vue";
import { formattingMixin } from "./shared/mixins/formatting-mixin.component";
import type { ColumnHeader } from "./models/column-header";
import type { PersonRow } from "./models/person-row";
import TableFilterRow from "./components/table-filter-row.component";
import type { ActiveFilter } from "./shared/table-filtering.types";
import { Filtering } from "./shared/table-filtering";

export default Vue.extend({
  name: "people-table",
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
  watch: {
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
      const activeFilters = Filtering.TableFiltering.getActiveFilters(this.normalizedHeaders, this.filters);
      const rows = (this.rows as any) as PersonRow[];
      if (!activeFilters.length) {
        return rows;
      }

      return rows.filter((row: PersonRow) =>
        Filtering.TableFiltering.isRowMatchesFilters(row, activeFilters, this.getCellValue)
      );
    },
  },
  methods: {
    onSetFilter(payload: { key: string; value: any }): void {
      this.$set(this.filters, payload.key, payload.value);
    },
    getCellValue(row: any, header: ColumnHeader | undefined): any {
      return Filtering.TableFiltering.defaultGetCellValue(row, header);
    },
    formatCell(row: any, header: ColumnHeader): string {
      const raw = this.getCellValue(row, header);
      if (typeof header.formatter !== "function") return String(raw ?? "");
      return header.formatter.call(this, raw, row, header);
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


