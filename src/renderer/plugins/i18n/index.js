import Vue from 'vue';
import VueI18n from 'vue-i18n';
import Formatter from './formatter';
import { fr, en } from './locale/index';

Vue.use(VueI18n);


const locale = 'en-US'; // default locale
const formatter = new Formatter({ locale });

export default new VueI18n({
  locale,
  formatter,
  messages: {
    en,
    fr,
  },
});
