import Vue from "vue";
import VueRouter from "vue-router";
import { AboutPage } from "./pages/about.js";
import { HelpPage } from "./pages/help.js";
import { ErrorPage } from "./pages/error.js";
import { HomePage } from "./pages/home.js";
import { init } from "./migrations.js";
import { ExamplesPage } from "./pages/examples.js";

Vue.use(VueRouter);

const SQL = await initSqlJs({
  locateFile: (file) =>
    `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.1/${file}`,
});

const db = new SQL.Database(new Uint8Array([]));

new Vue({
  data() {
    return {
      loading: true,
    };
  },
  template: `<div>
    <nav class="navbar" role="navigation">
      <div class="navbar-brand">
        <div class="navbar-item">
          <strong>UK Politics Database</strong>
        </div>
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <router-link to="/" class="navbar-item">Home</router-link>
          <router-link to="/about" class="navbar-item">About</router-link>
          <router-link to="/help" class="navbar-item">Help</router-link>
          <router-link to="/examples" class="navbar-item">Examples</router-link>
        </div>
      </div>
    </nav>
    <router-view v-if="!loading"></router-view>
    <div v-else>
      Loading...
    </div>
  </div>`,

  async mounted() {
    try {
      await init(db);
    } catch (error) {
      console.error(error);

      this.$router.push({
        name: "error",
        params: {
          message: error.message,
        },
      });
    } finally {
      this.loading = false;
    }
  },

  router: new VueRouter({
    routes: [
      {
        name: "home",
        path: "/",
        component: HomePage(db),
      },
      {
        name: "about",
        path: "/about",
        component: AboutPage,
      },
      {
        name: "help",
        path: "/help",
        component: HelpPage(db),
      },
      {
        name: "examples",
        path: "/examples",
        component: ExamplesPage,
      },
      {
        name: "error",
        path: "/error",
        component: ErrorPage,
        props: true,
      },
    ],
  }),
}).$mount("#app");
