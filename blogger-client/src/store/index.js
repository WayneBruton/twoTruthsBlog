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
    aboutMember: null
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
    }
  },
  actions: {
    setUser({ commit }, user) {
      commit("setUser", user);
    },
    logout({ commit }) {
      commit("logout");
    }
  },
  modules: {}
});
