import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.min.css";

import PeopleTable, { PersonRow } from "./table";
import rows from "./people.json";

Vue.use(Vuetify);
const vuetify = new Vuetify({});

const AppRoot = Vue.extend({
  name: "AppRoot",
  components: { PeopleTable },
  data(): { rows: PersonRow[] } {
    return { rows: (rows as any) as PersonRow[] };
  },
  template: `
    <v-app>
      <v-container fluid class="app-layout d-flex flex-column">
        <header class="page-header">
          <h1>Vuetify data table</h1>
          <p>Example of vuetify data table with column filtering headers</p>
        </header>
        <main>
          <people-table :rows="rows" />
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
