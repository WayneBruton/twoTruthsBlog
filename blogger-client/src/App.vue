<template>
  <v-app>
    <v-container fluid>
      <!-- <v-system-bar
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
        </v-system-bar> -->
    </v-container>
    <Header />
    <chat v-if="this.$store.state.isLoggedOn" />

    <v-main>
      <v-layout text-center wrap>
        <v-flex xs12 md12 offsetmd9>
          <!-- <transition name="slide-fade" mode="out-in"> -->
          <router-view />
          <!-- </transition> -->
        </v-flex>
      </v-layout>
    </v-main>
    <!-- <chat /> -->

    <!-- </v-content> -->
  </v-app>
</template>

<script>
import Header from "./components/Header";
import Chat from "./components/Chat.vue";

export default {
  name: "App",

  components: {
    Header,
    Chat
  },

  data: () => ({
    //
  })
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
