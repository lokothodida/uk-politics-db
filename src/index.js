import Vue from "vue";
import VueRouter from "vue-router";
import { load2015Election, loadTables } from "./migrations.js";

Vue.use(VueRouter);

const SQL = await initSqlJs({
  locateFile: (file) =>
    `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.1/${file}`,
});

const db = new SQL.Database(new Uint8Array([]));

const HomePage = (db) => ({
  data() {
    return {
      loading: true,
      error: false,
      errorMessage: "",
      query: "",
      results: [],
      url: "",
    };
  },
  template: `<div>
        <h1>UK Politics DB</h1>
        <div v-if="loading">
            Loading...
        </div>
        <div v-else-if="error">
            <code>{{errorMessage}}</code>
        </div>
        <div v-else>
            <p>Write your SQL queries into the below space and hit <code>Execute</code> to see results.</p>
            <div><textarea v-model="query"></textarea></div>
            <button v-on:click.prevent="execute">Execute</button>
            <button v-on:click.prevent="share">Share</button>
            <p v-if="url"><input type="text" disabled v-model="url"></p>

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
        </div>
    </div>`,

  async mounted() {
    try {
      this.loadQueryFromUrl();
      await loadTables(["constituencies"], db);
      await load2015Election(db);
    } catch (err) {
      this.error = true;
      this.errorMessage = err.message;
      console.error(err);
    } finally {
      this.loading = false;
    }
  },

  watch: {
    "$route": "loadQueryFromUrl",
  },

  methods: {
    share() {
      this.url = `${window.location.origin}/#/?query=` +
        encodeURIComponent(this.query);
    },

    loadQueryFromUrl() {
      const query = decodeURIComponent(this.$route.query.query);

      if (query.length === 0) {
        return;
      }

      this.query = query;
    },

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
