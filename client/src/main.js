import Vue from "vue";
import Argon from "@/plugins/argon-kit";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router/index";
import store from "./store";

Vue.use(Argon);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
