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
  </v-app>
</template>

<script>
import Header from "./components/Header";
export default {
  name: "App",

  components: {
    Header,
    Chat: () => import("./components/Chat.vue"),
    Cookie: () => import("./components/Cookie")
    // CookieLaw,
  },

  data: () => ({
    windowWidth: window.innerWidth,
    src: require("../src/assets/Logo.png")
    //
  }),
  watch: {},
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
    // this.$store.dispatch("showIntro");
  },
  methods: {
    closeChatAlert() {
      this.$store.dispatch("chatMessageClose");
    },
    onResize() {
      this.windowWidth = window.innerWidth;
    }
  },
  mounted() {
    setTimeout(() => {
      this.$store.dispatch("showIntro");
      this.windowWidth = window.innerWidth;
      this.$nextTick(() => {
        window.addEventListener("resize", this.onResize);
      });
    }, 0);
  }
};
</script>

<style>
/* @import url("https://fonts.googleapis.com/css?family=Varela+Round");
@import url("https://fonts.googleapis.com/css2?family=Montserrat&family=Raleway&display=swap"); */
@import url("https://fonts.googleapis.com/css2?family=Barlow&family=Montserrat&family=Raleway&display=swap");
/* @import url('https://fonts.googleapis.com/css2?family=Barlow&family=Lobster&family=Montserrat&family=Raleway&display=swap'); */
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
