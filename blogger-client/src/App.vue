<template>
  <v-app>
    <v-expand-transition>
      <v-alert
        v-show="
          this.$store.state.chatMessageNotification &&
            !this.$store.state.paidMember
        "
        prominent
        dark
        color="pink"
        icon="mdi-chat-alert"
        border="bottom"
        @click="closeChatAlert"
      >
        <div style="display: flex; justify-content: space-between;">
          <div style="padding-top: 8px; font-weight: bold;">
            <strong>YOU HAVE A CHAT MESSAGE:</strong>
            {{ this.$store.state.chatMessage }}
          </div>
          <v-btn icon large @click="closeChatAlert"
            ><v-icon>mdi-close-circle</v-icon></v-btn
          >
        </div>
      </v-alert>
    </v-expand-transition>
    <v-main>
      <Header />
      <v-row justify="center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          transition="scale-transition"
          width="120"
          :src="src"
        />
      </v-row>
      <chat v-if="this.$store.state.isLoggedOn && this.windowWidth < 768" />
      <br v-if="this.$store.state.isLoggedOn && this.windowWidth < 768" />
      <v-layout text-center wrap>
        <v-flex xs12 md12 offsetmd9>
          <router-view />
        </v-flex>
      </v-layout>
      <Cookie v-if="!this.$store.state.cookiesAccepted" />
    </v-main>
    <v-snackbar v-model="snackbar" :timeout="timeOut" bottom top>
      {{ snackBarMessage }}
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import Header from "./components/Header";
import DirectoryService from "./services/DirectoryServices";
export default {
  name: "App",
  components: {
    Header,
    Chat: () => import("./components/Chat.vue"),
    Cookie: () => import("./components/Cookie")
  },
  data: () => ({
    windowWidth: window.innerWidth,
    src: require("../src/assets/Logo.png"),
    snackBarMessage: "",
    snackbar: false,
    timeout: 2000
  }),
  watch: {},
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    closeChatAlert() {
      this.$store.dispatch("chatMessageClose");
    },
    onResize() {
      this.windowWidth = window.innerWidth;
    }
  },
  async mounted() {
    try {
      let response = await DirectoryService.getallowedViewsNonSubscriber();
      let data = {
        allowedToView: parseInt(response.data[0].allowedViews)
      };
      // console.log(this.$store.state.allowedViews);
      // console.log(this.$store.state.paidMember);
      this.$store.dispatch("resetAllowedToView", data);
      this.$store.dispatch("resetLatestArticles");
      this.$store.dispatch("resetInterestArticles");
      this.$store.dispatch("resetFollowingArticles");
      this.$store.dispatch("resetPopularArticles");
      setTimeout(() => {
        this.$store.dispatch("showIntro");
        this.windowWidth = window.innerWidth;
        this.$nextTick(() => {
          window.addEventListener("resize", this.onResize);
        });
      }, 0);
    } catch (e) {
      this.snackBarMessage = "There was an error, please refresh";
      this.snackbar = true;
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Barlow&family=Montserrat&family=Raleway&display=swap");
#app {
  font-family: "Barlow", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
h1,
h2,
h3 {
  font-family: Raleway;
  font-weight: bold;
}
span {
  font-family: Raleway;
}
</style>
