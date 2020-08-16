<template>
  <div class="about" v-if="cards.length > 0">
    <h2>Following</h2>
    <br />
    <v-card class="mx-auto" max-width="1000" elevation="0">
      <v-layout>
        <v-row dense>
          <v-col
            v-for="card in cards"
            :key="card.id"
            :cols="card.flex"
            :offset="card.offset"
            elevation="0"
          >
            <v-card :id="card.id" @click="articleClick($event)" elevation="3">
              <cld-image
                :cloudName="cloudName"
                :publicId="card.publicId"
                class="white--text align-end"
                height="200px"
                width="100%"
                loading="lazy"
              >
                <cld-transformation crop="fill" quality="auto" />
              </cld-image>
              <v-card-title v-text="card.title"></v-card-title>
              <v-card-text><strong>By:</strong> {{ card.author }}</v-card-text>
              <v-card-text v-if="card.readtime > 1"
                >Time to Read: {{ card.readtime }} Minutes</v-card-text
              >
              <v-card-text v-if="card.readtime < 2"
                >Time to Read: {{ card.readtime }} Minute</v-card-text
              >
            </v-card>
          </v-col>
        </v-row>
      </v-layout>
    </v-card>
    <!-- </v-layout> -->
    <v-snackbar v-model="snackbar" :timeout="timeOut" bottom top>
      {{ snackBarMessage }}
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import DirectoryServices from "../services/DirectoryServices";
export default {
  name: "articlesFollowingGrid",
  props: ["following"],
  data: () => ({
    cards: [],
    windowWidth: null,
    cloudName: `${process.env.VUE_APP_CLOUDNAME}`,
    preset: `${process.env.VUE_APP_PRESET}`,
    viewLook: "mdi-view-grid",
    flex: 12,
    width: 30,
    height: 30,
    offset: 0,
    loggedIn: false,
    snackBarMessage: "",
    snackbar: false,
    timeOut: 2500
  }),
  async mounted() {
    // console.log("AWESOME!@!@",this.tags)
    this.windowWidth = window.innerWidth;
    setTimeout(() => {
      this.$nextTick(() => {
        window.addEventListener("resize", this.onResize);
      });
      this.resizePage();
      if (this.windowWidth < 768) {
        this.width = 30;
        this.height = 30;
      } else {
        this.width = 60;
        this.height = 60;
      }
    }, 0);
    this.cards = [];
    window.scrollTo(0, 0);
    this.loggedIn = this.$store.state.isLoggedOn;
    let credentials = {
      following: this.following
    };
    let response = await DirectoryServices.youFollowingArticles(credentials);
    // console.log(response.data);
    if (response.data.success === false) {
      this.viewLook = "mdi-format-list-bulleted";
      this.tokenValid = false;
      this.$store.dispatch("logout");
    } else {
      this.tokenValid = true;
      this.cards = response.data;
    }
    this.onResize();
    this.viewLook = this.$store.state.viewLook;
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth;
      if (this.windowWidth < 768) {
        this.flex = 12;
        this.offset = 0;
        this.cards.forEach(element => {
          element.flex = 12;
          element.offset = 0;
        });
      } else {
        this.cards.forEach(element => {
          this.flex = 10;
          this.offset = 1;
          if (this.cards.length == 1) {
            element.flex = 6;
            element.offset = 3;
          } else if (this.cards.length < 3) {
            element.flex = 6;
            element.offset = 0;
          } else {
            element.flex = 4;
            element.offset = 0;
          }
        });
      }
      //   this.resizePage();
    },
    resizePage() {
      if (this.windowWidth < 768) {
        this.flex = 12;
        this.offset = 0;
        this.cards.forEach(element => {
          element.flex = 12;
          element.offset = 0;
        });
      } else {
        this.flex = 10;
        this.offset = 1;
        this.cards.forEach(element => {
          if (this.cards.length == 2) {
            element.flex = 6;
            element.offset = 3;
          } else if (this.cards.length < 3) {
            element.flex = 6;
            element.offset = 0;
          } else {
            element.flex = 4;
            element.offset = 0;
          }
        });
      }
    },
    articleClick(event) {
      if (this.tokenValid && this.$store.state.isLoggedOn) {
        let targetID = event.currentTarget.id;
        this.$router.push({ name: "articles", query: { id: targetID } });
      } else {
        this.snackBarMessage =
          "You have to be registered and logged in to view articles";
        this.snackbar = true;
        setTimeout(() => {
          this.$router.push({ name: "login" });
        }, 2500);
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  }
};
</script>

<style scoped></style>
