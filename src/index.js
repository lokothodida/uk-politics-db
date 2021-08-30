import Vue from "vue";
import VueRouter from "vue-router";
import { init } from "./migrations.js";
import { PieChart } from "./components/pie-chart.js";

Vue.use(VueRouter);

const SQL = await initSqlJs({
  locateFile: (file) =>
    `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.1/${file}`,
});

const db = new SQL.Database(new Uint8Array([]));

const HomePage = (db) => ({
  name: "HomePage",
  components: {
    "pie-chart": PieChart,
  },

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

            <div v-for="(result, idx) in results">
                <select :key="resultKey(idx, 'select')" v-model="results[idx].chartType">
                    <option value="pie">Pie Chart</option>
                    <option value="table">Table</option>
                </select>

                <table :key="resultKey(idx, 'table')" v-if="result.chartType === 'table'">
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

                <pie-chart :key="resultKey(idx, 'pie')" v-if="results[idx].chartType === 'pie'" :data="pieChart(result)"></pie-chart>
            </div>
        </div>
    </div>`,

  async mounted() {
    try {
      this.loadQueryFromUrl();
      await init(db);
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
    baseUrl() {
      return `${window.location.href.replace(window.location.hash, "")}`;
    },
    share() {
      this.url = `${this.baseUrl()}#/?query=` +
        encodeURIComponent(this.query);
    },

    loadQueryFromUrl() {
      const values = this.$route.query;

      if (!("query" in values)) {
        return;
      }

      const query = decodeURIComponent(values.query);

      if (!query) {
        return;
      }

      this.query = query;
    },

    execute() {
      try {
        this.results = db.exec(this.query);
        this.results = this.results.map((result) => {
          this.$set(result, "chartType", "table");
          return result;
        });
      } catch (err) {
        alert(`Failed to execute query: ${err.message}`);
      }
    },

    resultKey(idx, type) {
      return `result-${type}-${idx}`;
    },

    pieChart(result) {
      const valueIdx = result.columns.indexOf("value");
      const labelIdx = result.columns.indexOf("label");
      const colourIdx = result.columns.indexOf("colour");

      return result.values.map((item) => ({
        label: item[labelIdx],
        value: item[valueIdx],
        colour: item[colourIdx] || "#cccccc",
      }));
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