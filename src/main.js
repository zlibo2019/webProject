// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import "babel-polyfill";
import store from './store'
import './plugins/element'
import 'swiper/dist/css/swiper.min.css';
import API from './api'
import utils from './utils';
import './assets/css/theme.scss';
// require('./mock/mock.js')
console.log('111111111111XXXXXXXXXX',process.env.NODE_ENV)


Vue.use(API);
Vue.use(utils);

Vue.config.productionTip = false;


let aaa = new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
console.log(aaa);
