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
    isAdmin: 0,
    viewLook: "mdi-view-grid",
    cookiesAccepted: false,
    chatMessageNotification: false,
    chatMessage: "",
    showIntro: true,
    viewArticleIdBeforeLoggedIn: null,
    limitLatestArticles: 6,
    limitInterestArticles: 6,
    limitFollowingArticles: 6,
    limitPopularArticles: 6,

    allowedViews: 2,
    actualViews: 0,
    thisMonth: "test",
    allowedToView: true,
    showSubscribe: false
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
      state.isAdmin = user.isAdmin;
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
      state.isAdmin = null;
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
    },
    limitLatestArticles(state) {
      state.limitLatestArticles = state.limitLatestArticles + 3;
    },
    resetLatestArticles(state) {
      state.limitLatestArticles = 6;
    },
    limitInterestArticles(state) {
      state.limitInterestArticles = state.limitInterestArticles + 3;
    },
    resetInterestArticles(state) {
      state.limitInterestArticles = 6;
    },
    limitFollowingArticles(state) {
      state.limitFollowingArticles = state.limitFollowingArticles + 3;
    },
    resetFollowingArticles(state) {
      state.limitFollowingArticles = 6;
    },
    limitPopularArticles(state) {
      state.limitPopularArticles = state.limitPopularArticles + 3;
    },
    resetPopularArticles(state) {
      state.limitPopularArticles = 6;
    },
    resetAllowedToView(state, data) {
      state.allowedViews = data.allowedToView;
      // state.actualViews = 0;
      state.showSubscribe = false;
      state.allowedToView = true;
    },
    showSubscribe(state) {
      if (!state.allowedToView) {
        state.showSubscribe = true;
      } else {
        state.showSubscribe = false;
      }
    },
    resetSubscribe(state) {
      state.showSubscribe = false;
    },
    memberPaid(state) {
      state.paidMember = 1;
    },
    allowedToView(state, data) {
      if (state.paidMember === 1) {
        state.allowedToView = true;
        state.actualViews = 0;
        state.thisMonth = data.thisMonth;
      } else if (state.thisMonth !== data.thisMonth && state.paidMember === 0) {
        state.thisMonth = data.thisMonth;
        state.actualViews = 1;
        state.allowedToView = true;
      } else if (
        state.thisMonth === data.thisMonth &&
        state.paidMember === 0 &&
        state.actualViews >= state.allowedViews
      ) {
        state.allowedToView = false;
      } else if (
        state.thisMonth === data.thisMonth &&
        state.paidMember === 0 &&
        state.actualViews < state.allowedViews
      ) {
        state.actualViews = state.actualViews + 1;
      }
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
    },
    limitLatestArticles({ commit }) {
      commit("limitLatestArticles");
    },
    resetLatestArticles({ commit }) {
      commit("resetLatestArticles");
    },
    limitInterestArticles({ commit }) {
      commit("limitInterestArticles");
    },
    resetInterestArticles({ commit }) {
      commit("resetInterestArticles");
    },
    limitFollowingArticles({ commit }) {
      commit("limitFollowingArticles");
    },
    resetFollowingArticles({ commit }) {
      commit("resetFollowingArticles");
    },
    limitPopularArticles({ commit }) {
      commit("limitPopularArticles");
    },
    resetPopularArticles({ commit }) {
      commit("resetPopularArticles");
    },
    allowedToView({ commit }, data) {
      commit("allowedToView", data);
    },
    resetAllowedToView({ commit }, data) {
      commit("resetAllowedToView", data);
    },
    showSubscribe({ commit }) {
      commit("showSubscribe");
    },
    resetSubscribe({ commit }) {
      commit("resetSubscribe");
    },
    memberPaid({ commit }) {
      commit("memberPaid");
    }
  },
  modules: {}
});
