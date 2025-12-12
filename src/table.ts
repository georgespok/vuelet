import Vue from "vue";

export interface PersonRow {
  id: number;
  name: string;
  role: string;
  location: string;
}

export default Vue.extend({
  name: "PeopleTable",
  props: {
    rows: {
      type: Array,
      required: true,
    },
  },
  data(): {
    headers: Array<{ text: string; value: keyof PersonRow }>;
    filters: Record<keyof PersonRow, string>;
    page: number;
    itemsPerPage: number;
  } {
    return {
      headers: [
        { text: "ID", value: "id" },
        { text: "Name", value: "name" },
        { text: "Role", value: "role" },
        { text: "Location", value: "location" },
      ],
      filters: {
        id: "",
        name: "",
        role: "",
        location: "",
      },
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
    filteredRows(): PersonRow[] {
      const activeFilters: Array<{ key: keyof PersonRow; needle: string }> = [];

      for (let i = 0; i < this.headers.length; i++) {
        const key = this.headers[i].value;
        const raw = this.filters[key];
        const needle = ((raw as any) || "").toString().trim().toLowerCase();
        if (needle.length > 0) activeFilters.push({ key, needle });
      }

      const rows = (this.rows as any) as PersonRow[];

      if (activeFilters.length === 0) return rows;

      return rows.filter((row: PersonRow) => {
        for (let i = 0; i < activeFilters.length; i++) {
          const filter = activeFilters[i];
          const cell = String(row[filter.key] || "").toLowerCase();
          if (cell.indexOf(filter.needle) === -1) return false;
        }
        return true;
      });
    },
  },
  template: `
    <v-card outlined>
      <v-card-title>People</v-card-title>
      <v-data-table
        :headers="headers"
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
            <td v-for="header in headers" :key="'filter-' + header.value">
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
      </v-data-table>
    </v-card>
  `,
});
