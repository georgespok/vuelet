import Vue from "vue";
import type { ColumnHeader } from "../models/column-header";

type MoneyFilterMode = "" | "eq0" | "gt0";

export default Vue.extend({
  name: "table-filter-row",
  props: {
    headers: {
      type: Array,
      required: true,
    },
    filters: {
      type: Object,
      required: true,
    },
    moneyFilterItems: {
      type: Array,
      required: false,
      default: () => [
        { text: "All", value: "" },
        { text: "= 0", value: "eq0" },
        { text: "> 0", value: "gt0" },
      ],
    },
  },
  computed: {
    normalizedHeaders(): ColumnHeader[] {
      return (this.headers as any) as ColumnHeader[];
    },
    normalizedFilters(): Record<string, any> {
      return (this.filters as any) as Record<string, any>;
    },
  },
  methods: {
    onFilterInput(key: string, value: any): void {
      const normalized = value === null || value === undefined ? "" : value;
      this.$emit("set-filter", { key, value: normalized });
    },
    getMoneyFilterValue(key: string): MoneyFilterMode {
      const v = this.normalizedFilters[key] as MoneyFilterMode;
      return v === "eq0" || v === "gt0" || v === "" ? v : "";
    },
  },
  template: `
    <tr>
      <td
        v-for="header in normalizedHeaders"
        :key="'filter-' + header.value"
        :style="{ width: header.width }"
      >
        <v-select
          v-if="header.useMoneyFilter"
          :value="getMoneyFilterValue(header.value)"
          :items="moneyFilterItems"
          item-text="text"
          item-value="value"
          dense
          hide-details
          class="ma-0 pa-0"
          @input="onFilterInput(header.value, $event)"
        />
        <v-text-field
          v-else
          :value="normalizedFilters[header.value]"
          dense
          clearable
          hide-details
          placeholder="Filter"
          class="ma-0 pa-0"
          @input="onFilterInput(header.value, $event)"
        />
      </td>
    </tr>
  `,
});


