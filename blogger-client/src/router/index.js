import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "About" */ "../views/About.vue")
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "Login" */ "../views/Login.vue")
  },
  {
    path: "/signup",
    name: "signup",
    component: () =>
      import(/* webpackChunkName: "Signup" */ "../views/Signup.vue")
  },
  {
    path: "/setup",
    name: "setup",
    component: () =>
      import(/* webpackChunkName: "Setup" */ "../views/Setup.vue")
  },
  {
    path: "/uploadArticle",
    name: "uploadArticle",
    component: () =>
      import(
        /* webpackChunkName: "UploadArticle" */ "../views/UploadArticle.vue"
      )
  },
  {
    path: "/articles",
    name: "articles",
    component: () =>
      import(/* webpackChunkName: "Article" */ "../views/Articles.vue")
  },
  {
    path: "/profileView",
    name: "profileview",
    component: () =>
      import(/* webpackChunkName: "Article" */ "../views/ProfileView.vue")
  },
  {
    path: "/editdraft",
    name: "editdraft",
    component: () =>
      import(/* webpackChunkName: "EditDraft" */ "../views/EditDraft.vue")
  },
  {
    path: "/search",
    name: "search",
    component: () =>
      import(/* webpackChunkName: "Search" */ "../views/Search.vue")
  },
  {
    path: "/faq",
    name: "faq",
    component: () => import(/* webpackChunkName: "Faq" */ "../views/Faq.vue")
  },
  {
    path: "/terms",
    name: "terms",
    component: () =>
      import(/* webpackChunkName: "Terms" */ "../views/Terms.vue")
  },
  {
    path: "/contact",
    name: "contact",
    component: () =>
      import(/* webpackChunkName: "Contact" */ "../views/Contact.vue")
  },
  {
    path: "/privacypolicy",
    name: "privacypolicy",
    component: () =>
      import(/* webpackChunkName: "Contact" */ "../views/PrivacyPolicy.vue")
  },
  {
    path: "/pmtSuccessfull",
    name: "pmtSuccessfull",
    component: () =>
      import(
        /* webpackChunkName: "PmtSuccessfull" */ "../views/PmtSuccessfull.vue"
      )
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () =>
      import(/* webpackChunkName: "Dashboard" */ "../views/Dashboard.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
