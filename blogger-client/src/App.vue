<template>
  <v-app>
    <!-- <v-container fluid>
      <v-system-bar
        sticky
          color="lime"
          :height="height"
          :lights-out="lightsOut"
          :window="window"
        >
          <v-icon>mdi-gmail</v-icon>
          <span>10 unread emails</span>
          <v-spacer></v-spacer>
          <v-icon>mdi-wifi-strength-4</v-icon>
          <v-icon>mdi-signal-cellular-outline</v-icon>
          <v-icon>mdi-battery</v-icon>
          <span>12:30</span>
        </v-system-bar>
    </v-container> -->

    <v-main>
      <Header />
      <v-row justify="center">
        <!-- <v-layout text-center wrap> -->
        <!-- v-show="this.$route.name === 'home'" -->
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          transition="scale-transition"
          width="185"
          :src="src"
        />
        <!-- </v-layout> -->
      </v-row>
      <chat v-if="this.$store.state.isLoggedOn && this.windowWidth < 768" />
      <br v-if="this.$store.state.isLoggedOn && this.windowWidth < 768" />
      <v-layout text-center wrap>
        <v-flex xs12 md12 offsetmd9>
          <!-- <transition name="slide-fade" mode="out-in"> -->
          <router-view />
          <!-- </transition> -->
        </v-flex>
      </v-layout>
      <Cookie v-if="!this.$store.state.cookiesAccepted" />
    </v-main>
  </v-app>
</template>

<script>
import Header from "./components/Header";
// import Chat from "./components/Chat.vue";
// import CookieLaw from "vue-cookie-law";

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
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth;
    }
  },
  mounted() {
    setTimeout(() => {
      this.$nextTick(() => {
        window.addEventListener("resize", this.onResize);
      });
      // this.resizePage();
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
