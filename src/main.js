import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import axios from 'axios';
import './assets/style.sass';
import './assets/style.css';

Vue.config.productionTip = false;

Vue.prototype.$axios = axios;

// BaseUrl
axios.defaults.baseURL = 'http://192.168.18.56:3000/';
// axios.defaults.baseURL = 'https://api-rrest.sparkosol.com/';

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
