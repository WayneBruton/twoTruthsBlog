import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store";
import vuetify from "./plugins/vuetify";
// import VueLocalStorage from "vue-localstorage";
import Cloudinary from "cloudinary-vue";
import VueSanitize from "vue-sanitize";
import VueCountable from "vue-countable";
// var VueCookie = require("vue-cookie");
import VueMask from "v-mask";
import MyPlugin from "./plugins/myPlugins";
import vueDebounce from "vue-debounce";

Vue.use(vueDebounce, {
  listenTo: "keyup",
  defaultTime: "500ms",
  fireOnEmpty: false
});

Vue.use(MyPlugin);
Vue.use(VueMask);

VueSanitize.defaults.allowedTags = ["p"];
VueSanitize.defaults.disallowedTagsMode = "discard";
let defaults = VueSanitize.defaults;
Vue.use(VueSanitize, defaults);
Vue.use(Cloudinary);
Vue.component("vue-countable", VueCountable);
// Vue.use(VueCookie);
// Vue.use(VueLocalStorage);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
