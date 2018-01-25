import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'snippets-list',
      component: require('@/components/SnippetsList').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
