import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.min.css";

import PeopleTable from "./table";
import type { ColumnHeader } from "./models/column-header";
import type { PersonRow } from "./models/person-row";
import rows from "./people.json";

Vue.use(Vuetify);
const vuetify = new Vuetify({});

const AppRoot = Vue.extend({
  name: "AppRoot",
  components: { PeopleTable },
  data(): { rows: PersonRow[]; headers: ColumnHeader[] } {
    const headers: ColumnHeader[] = [
      {
        text: "ID",
        value: "id",
        width: "80px",
        formatter: function (this: any, value: any): string {
          return String(value ?? "");
        },
      },
      {
        text: "Name",
        value: "name",
        width: "220px",
        formatter: function (this: any, value: any): string {
          return String(value ?? "");
        },
      },
      {
        text: "Role",
        value: "role",
        width: "200px",
        formatter: function (this: any, value: any): string {
          return String(value ?? "");
        },
      },
      {
        text: "Location",
        value: "location",
        width: "160px",
        formatter: function (this: any, value: any): string {
          return String(value ?? "");
        },
      },
      {
        text: "Salary",
        value: "salary",
        width: "140px",
        formatter: function (this: any, value: any): string {
          return this.formatCurrency(value);
        },
      },
      {
        text: "Deductions",
        value: "deductions",
        width: "150px",
        formatter: function (this: any, value: any): string {
          return this.formatCurrency(value);
        },
      },
      {
        text: "Net Pay",
        value: "netPay",
        width: "140px",
        formatter: function (this: any, value: any): string {
          return this.formatCurrency(value);
        },
      },
    ];

    return { rows: (rows as any) as PersonRow[], headers };
  },
  template: `
    <v-app>
      <v-container fluid class="app-layout d-flex flex-column">
        <header class="page-header">
          <h1>Vuetify data table</h1>
          <p>Example of vuetify data table with column filtering headers</p>
        </header>
        <main>
          <people-table :rows="rows" :headers="headers" />
        </main>
      </v-container>
    </v-app>
  `,
});

new Vue({
  el: "#app",
  vuetify,
  components: { AppRoot },
  template: "<AppRoot />",
});
