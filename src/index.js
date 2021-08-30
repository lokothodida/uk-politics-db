import Vue from "vue";
import VueRouter from "vue-router";
import { HomePage } from "./pages/home.js";

Vue.use(VueRouter);

const SQL = await initSqlJs({
  locateFile: (file) =>
    `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.1/${file}`,
});

const db = new SQL.Database(new Uint8Array([]));

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
