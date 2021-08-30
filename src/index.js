import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const SQL = await initSqlJs({
  locateFile: (file) =>
    `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.1/${file}`,
});

const db = new SQL.Database(new Uint8Array([]));

const HomePage = (db) => ({
  data() {
    return {
      query: "",
      results: [],
    };
  },
  template: `<div>
        <h1>UK Politics DB</h1>
        <p>Write your SQL queries into the below space and hit <code>Execute</code> to see results.</p>
        <div><textarea v-model="query"></textarea></div>
        <button v-on:click.prevent="execute">Execute</button>

        <table v-for="result in results">
            <thead>
                <tr>
                    <th v-for="column in result.columns">{{column}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in result.values">
                    <td v-for="field in row">{{field}}</td>
                </tr>
            </tbody>
        </table>
    </div>`,

  methods: {
    execute() {
      try {
        this.results = db.exec(this.query);
      } catch (err) {
        alert(`Failed to execute query: ${err.message}`);
      }
    },
  },
});

new Vue({
  router: new VueRouter({
    routes: [
      {
        path: "/",
        component: HomePage(db),
      },
    ],
  }),
}).$mount("#app");
