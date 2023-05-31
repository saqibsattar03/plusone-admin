import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import axios from 'axios';
import './assets/style.sass';
import './assets/style.css';
import 'leaflet/dist/leaflet.css';
import * as VueGoogleMaps from 'vue2-google-maps';
import VueTheMask from 'vue-the-mask';
import '@fortawesome/fontawesome-free/css/all.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import 'primeicons/primeicons.css';
// import { fab } from '@fortawesome/free-brands-svg-icons';

// library.add(fab);
// Add the specific icons you want to use to the library
library.add(faUserSecret);
/* add icons to the library */
// library.add(faUserSecret);

/* add font awesome icon component */
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(VueTheMask);
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCqP_po3VVErDM_bd9sGVUmMNDJwEhHyUA',
    libraries: 'places'
  }
});

Vue.config.productionTip = false;

Vue.prototype.$axios = axios;

// BaseUrl
axios.defaults.baseURL = 'http://192.168.18.56:3000/';
// axios.defaults.baseURL = 'http://192.168.18.70:3000/';
// axios.defaults.baseURL = 'https://api.plusoneworldwide.com/';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.common['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
  created() {}
}).$mount('#app');
