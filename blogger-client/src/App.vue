<template>
  <v-app>
    <Header />
    <!-- <v-content> -->
    <v-main>
      <v-layout text-center wrap>
        <v-flex xs12 md12 offsetmd9>
          <!-- <transition name="slide-fade" mode="out-in"> -->
          <router-view />
          <!-- </transition> -->
        </v-flex>
      </v-layout>
    </v-main>
    <!-- </v-content> -->
  </v-app>
</template>

<script>
import Header from "./components/Header";

export default {
  name: "App",

  components: {
    Header,
  },

  data: () => ({
    //
  }),
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
