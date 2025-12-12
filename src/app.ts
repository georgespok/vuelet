import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.min.css";

import PeopleTable from "./table";

Vue.use(Vuetify);
const vuetify = new Vuetify({});

const AppRoot = Vue.extend({
  name: "AppRoot",
  components: { PeopleTable },
  template: `
    <v-app>
      <v-container fluid class="app-layout d-flex flex-column">
        <header class="page-header">
          <h1>Vuetify data table</h1>
          <p>Example of vuetify data table with column filtering headers</p>
        </header>
        <main>
          <people-table />
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
