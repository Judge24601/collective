import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: undefined
  },
  mutations: {
    updateUser(state, user) {
      console.log("update!", user);
      state.user = user;
    }
  },
  actions: {},
  modules: {}
});
