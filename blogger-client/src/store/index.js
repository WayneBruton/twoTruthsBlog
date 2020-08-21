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
    paidMember: null,
    memberExpires: null,
    viewLook: "mdi-view-grid",
    cookiesAccepted: false,
    chatMessageNotification: false,
    chatMessage: "",
    showIntro: true,
    viewArticleIdBeforeLoggedIn: null
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
      state.paidMember = user.paidMember;
      state.memberExpires = user.memberExpires;
    },
    logout(state) {
      state.isLoggedOn = false;
      state.userId = null;
      state.email = null;
      state.userName = null;
      state.avatar = null;
      state.website = null;
      state.showEmail = null;
      state.aboutMember = null;
      state.paidMember = null;
      state.memberExpires = null;
    },
    changeView(state, data) {
      state.viewLook = data.viewLook;
    },
    chatMessageReceived(state, data) {
      state.chatMessage = data.chatMessage;
      state.chatMessageNotification = true;
    },
    viewArticleIdBeforeLoggedIn(state, data) {
      state.viewArticleIdBeforeLoggedIn = data;
    },
    clearArticleIdBeforeLoggedIn(state) {
      state.viewArticleIdBeforeLoggedIn = null;
    },
    chatMessageClose(state) {
      state.chatMessage = "";
      state.chatMessageNotification = false;
    },
    acceptCookies(state) {
      state.cookiesAccepted = true;
    },
    showIntro(state) {
      state.showIntro = true;
    },
    hideIntro(state) {
      state.showIntro = false;
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
    chatMessageReceived({ commit }, data) {
      commit("chatMessageReceived", data);
    },
    viewArticleIdBeforeLoggedIn({ commit }, data) {
      commit("viewArticleIdBeforeLoggedIn", data);
    },
    clearArticleIdBeforeLoggedIn({ commit }) {
      commit("clearArticleIdBeforeLoggedIn");
    },
    chatMessageClose({ commit }) {
      commit("chatMessageClose");
    },
    acceptCookies({ commit }) {
      commit("acceptCookies");
    },
    showIntro({ commit }) {
      commit("showIntro");
    },
    hideIntro({ commit }) {
      commit("hideIntro");
    }
  },
  modules: {}
});
