import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.min.css";

import PeopleTable from "./people-table.component";
import DepartmentTable from "./department-table.component";
import type { ColumnHeader } from "./models/column-header";
import type { PersonRow } from "./models/person-row";
import type { DepartmentRow } from "./models/department-row";
import peopleRows from "./people.json";
import departmentRows from "./departments.json";

Vue.use(Vuetify);
const vuetify = new Vuetify({});

const AppRoot = Vue.extend({
  name: "AppRoot",
  components: { PeopleTable, DepartmentTable },
  data(): {
    peopleRows: PersonRow[];
    peopleHeaders: ColumnHeader[];
    departmentRows: DepartmentRow[];
    departmentHeaders: ColumnHeader[];
  } {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const peopleHeaders: ColumnHeader[] = [
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

    for (let i = 0; i < months.length; i++) {
      peopleHeaders.push({
        text: `${months[i]} Exp`,
        value: `expenses[${i}].value`,
        width: "110px",
        useMoneyFilter: true,
        getValue: (row: PersonRow): any => row?.expenses?.[i]?.value,
        formatter: function (this: any, value: any): string {
          return this.formatCurrency(value);
        },
      });
    }

    const departmentHeaders: ColumnHeader[] = [
      {
        text: "Department",
        value: "name",
        width: "220px",
        formatter: function (this: any, value: any): string {
          return String(value ?? "");
        },
      },
      {
        text: "Total Salary",
        value: "totalSalary",
        width: "160px",
        getValue: (row: DepartmentRow): any => {
          const salaries = row?.salaries ?? [];
          let sum = 0;
          for (let i = 0; i < salaries.length; i++) {
            const n = Number((salaries[i] as any)?.amount);
            if (isFinite(n)) sum += n;
          }
          return sum;
        },
        formatter: function (this: any, value: any): string {
          return this.formatCurrency(value);
        },
      },
    ];

    for (let i = 0; i < months.length; i++) {
      departmentHeaders.push({
        text: `${months[i]} Salary`,
        value: `salaries[${i}].amount`,
        width: "140px",
        useMoneyFilter: true,
        getValue: (row: DepartmentRow): any => row?.salaries?.[i]?.amount,
        formatter: function (this: any, value: any): string {
          return this.formatCurrency(value);
        },
      });
    }

    return {
      peopleRows: (peopleRows as any) as PersonRow[],
      peopleHeaders,
      departmentRows: (departmentRows as any) as DepartmentRow[],
      departmentHeaders,
    };
  },
  template: `
    <v-app>
      <v-container fluid class="app-layout d-flex flex-column">
        <header class="page-header">
          <h1>Vuetify data table</h1>
          <p>Example of vuetify data table with column filtering headers</p>
        </header>
        <main>
          <people-table :rows="peopleRows" :headers="peopleHeaders" />
          <div class="mt-8"></div>
          <department-table :rows="departmentRows" :headers="departmentHeaders" />
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
