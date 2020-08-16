import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    isLoggedOn: false,
    userId: null,
    userName: null,
    email: null,
    avatar: null,
    website: null,
    showEmail: null,
    aboutMember: null,
    viewLook: "mdi-view-grid",
    cookiesAccepted: false
  },
  mutations: {
    setUser(state, user) {
      state.isLoggedOn = true;
      state.userId = user.id;
      state.email = user.email;
      state.userName = user.name;
      state.avatar = user.avatar;
      state.website = user.website;
      state.showEmail = user.showEmail;
      state.aboutMember = user.aboutMember;
    },
    logout(state) {
      state.isLoggedOn = false;
      state.userId = null;
      state.email = null;
      state.userName = null;
      state.avatar = null;
      state.website = null;
    },
    changeView(state, data) {
      state.viewLook = data.viewLook;
    },
    acceptCookies(state) {
      state.cookiesAccepted = true;
    }
  },
  actions: {
    setUser({ commit }, user) {
      commit("setUser", user);
    },
    logout({ commit }) {
      commit("logout");
    },
    changeView({ commit }, data) {
      commit("changeView", data);
    },
    acceptCookies({ commit }) {
      commit("acceptCookies");
    }
  },
  modules: {}
});
