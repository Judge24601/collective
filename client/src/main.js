import Vue from "vue";
import Argon from "@/plugins/argon-kit";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router/index";
import store from "./store";

Vue.use(Argon);

// Import the Auth0 configuration
import { domain, clientId } from "../auth-config.json";

// Import the plugin here
import { Auth0Plugin } from "./auth";

// Install the authentication plugin here
Vue.use(Auth0Plugin, {
  domain,
  clientId,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  }
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
