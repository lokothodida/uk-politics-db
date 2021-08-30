import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const HomePage = {
  template: `<div>
        <h1>UK Politics DB</h1>
        <p>WIP...</p>
    </div>`,
};

new Vue({
  router: new VueRouter({
    routes: [
      {
        path: "/",
        component: HomePage,
      },
    ],
  }),
}).$mount("#app");
