import Vue from "vue";

interface PersonRow {
  id: number;
  name: string;
  role: string;
  location: string;
}

export default Vue.extend({
  name: "PeopleTable",
  data(): {
    headers: Array<{ text: string; value: keyof PersonRow }>;
    rows: PersonRow[];
  } {
    return {
      headers: [
        { text: "ID", value: "id" },
        { text: "Name", value: "name" },
        { text: "Role", value: "role" },
        { text: "Location", value: "location" },
      ],
      rows: [
        { id: 1, name: "Ada Lovelace", role: "Mathematician", location: "London" },
        { id: 2, name: "Alan Turing", role: "Computer Scientist", location: "Princeton" },
        { id: 3, name: "Grace Hopper", role: "Rear Admiral", location: "Arlington" },
      ],
    };
  },
  template: `
    <v-card outlined>
      <v-card-title>People</v-card-title>
      <v-data-table
        :headers="headers"
        :items="rows"
        item-key="id"
        dense
        disable-pagination
        hide-default-footer
        class="elevation-0"
      />
    </v-card>
  `,
});
