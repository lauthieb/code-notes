import Vue from 'vue';
import axios from 'axios';
import Buefy from 'buefy';

import 'font-awesome/css/font-awesome.min.css';
import 'source-sans-pro/source-sans-pro.css';


import App from './App';

import router from './router';
import store from './store';
import db from './datastore';

require('brace/mode/html');
require('brace/theme/monokai');

Vue.use(Buefy, {
  defaultIconPack: 'fa'
});

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.prototype.$db = db;

/* eslint-disable no-new */
new Vue({
  components: {App},
  router,
  store,
  template: '<App/>',
}).$mount('#app');
