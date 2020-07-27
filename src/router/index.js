import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "cn-notes-list",
      component: require("@/components/notes-list/NotesList").default
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});
