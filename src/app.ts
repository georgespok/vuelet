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

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

const plainTextFormatter = function (this: any, value: any): string {
  return String(value ?? "");
};

const currencyFormatter = function (this: any, value: any): string {
  return this.formatCurrency(value);
};

function sumMoney(values: Array<any>): number {
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    const n = Number(values[i]);
    if (isFinite(n)) sum += n;
  }
  return sum;
}

function buildPeopleHeaders(): ColumnHeader[] {
  const headers: ColumnHeader[] = [
    { text: "ID", value: "id", width: "80px", formatter: plainTextFormatter },
    { text: "Name", value: "name", width: "220px", formatter: plainTextFormatter },
    { text: "Role", value: "role", width: "200px", formatter: plainTextFormatter },
    { text: "Location", value: "location", width: "160px", formatter: plainTextFormatter },
    { text: "Salary", value: "salary", width: "140px", formatter: currencyFormatter },
    { text: "Deductions", value: "deductions", width: "150px", formatter: currencyFormatter },
    { text: "Net Pay", value: "netPay", width: "140px", formatter: currencyFormatter },
  ];

  for (let i = 0; i < MONTHS.length; i++) {
    headers.push({
      text: `${MONTHS[i]} Exp`,
      value: `expenses[${i}].value`,
      width: "110px",
      useMoneyFilter: true,
      getValue: (row: PersonRow): any => row?.expenses?.[i]?.value,
      formatter: currencyFormatter,
    });
  }

  return headers;
}

function buildDepartmentHeaders(): ColumnHeader[] {
  const headers: ColumnHeader[] = [
    { text: "Department", value: "name", width: "220px", formatter: plainTextFormatter },
    {
      text: "Total Salary",
      value: "totalSalary",
      width: "160px",
      getValue: (row: DepartmentRow): any => sumMoney((row?.salaries ?? []).map((x: any) => x?.amount)),
      formatter: currencyFormatter,
    },
  ];

  for (let i = 0; i < MONTHS.length; i++) {
    headers.push({
      text: `${MONTHS[i]} Salary`,
      value: `salaries[${i}].amount`,
      width: "140px",
      useMoneyFilter: true,
      getValue: (row: DepartmentRow): any => row?.salaries?.[i]?.amount,
      formatter: currencyFormatter,
    });
  }

  return headers;
}

type AppRootVm = {
  peopleRows: PersonRow[];
  peopleHeaders: ColumnHeader[];
  departmentRows: DepartmentRow[];
  departmentHeaders: ColumnHeader[];
};

const AppRoot = Vue.extend({
  name: "AppRoot",
  components: { PeopleTable, DepartmentTable },
  data(): AppRootVm {
    return {
      peopleRows: (peopleRows as any) as PersonRow[],
      peopleHeaders: buildPeopleHeaders(),
      departmentRows: (departmentRows as any) as DepartmentRow[],
      departmentHeaders: buildDepartmentHeaders(),
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
