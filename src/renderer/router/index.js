import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'cb-snippets-list',
      component: require('@/components/snippets-list/SnippetsList').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
