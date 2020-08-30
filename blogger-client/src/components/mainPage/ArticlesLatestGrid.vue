<template>
  <div class="about">
    <h2>Latest Articles</h2>
    <br />
    <v-card class="mx-auto" max-width="1000" elevation="0">
      <v-layout>
        <v-row dense>
          <v-col
            v-for="card in cards"
            :key="card.id"
            :cols="card.flex"
            elevation="0"
          >
            <v-card :id="card.id" @click="articleClick($event)" elevation="3">
              <!-- width="100%" -->
              <cld-image
                style="padding: 5 5;"
                :cloudName="cloudName"
                :publicId="card.publicId"
                class="white--text align-end"
                height="200px"
                loading="lazy"
                gravity="center"
              >
                <cld-transformation crop="limit" quality="auto" />
                <!-- <cld-transformation gravity="center" /> -->
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
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text
          @click="showMore"
          v-if="cards.length >= this.$store.state.limitLatestArticles"
          >... more</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar" :timeout="timeOut" bottom top>
      {{ snackBarMessage }}
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import DirectoryServices from "@/services/DirectoryServices";
export default {
  name: "articlesLatesGrid",
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
    timeOut: 2500,
    newLimit: null
  }),
  async mounted() {
    this.cards = [];
    window.scrollTo(0, 0);
    this.loggedIn = this.$store.state.isLoggedOn;
    this.newLimit = this.$store.state.limitLatestArticles;
    setTimeout(() => {
      this.$nextTick(() => {
        this.loadData();
      }, 100);
    }, 100);
  },
  methods: {
    async loadData() {
      let credentials = {
        newlimit: this.$store.state.limitLatestArticles
      };
      try {
        let response = await DirectoryServices.startApp(credentials);
        if (response.data.success === false) {
          this.viewLook = "mdi-format-list-bulleted";
          this.tokenValid = false;
          this.$store.dispatch("logout");
        } else {
          this.tokenValid = true;
          this.cards = response.data;
        }
      } catch (e) {
        this.snackBarMessage = "Error getting articles";
        this.snack = true;
      } finally {
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
        this.viewLook = this.$store.state.viewLook;
      }
    },
    async showMore() {
      this.$store.dispatch("limitLatestArticles");

      this.newLimit = this.$store.state.limitLatestArticles;
      let credentials = {
        newlimit: this.newLimit
      };
      try {
        let response = await DirectoryServices.startApp(credentials);
        this.cards = response.data;
      } catch (e) {
        this.snackBarMessage = "Error getting articles";
        this.snack = true;
      } finally {
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
      }
    },
    onResize() {
      this.windowWidth = window.innerWidth;
      if (this.windowWidth < 768) {
        this.flex = 12;
        this.offset = 0;
        this.cards.forEach(element => {
          element.flex = 12;
        });
      } else {
        this.cards.forEach(element => {
          this.flex = 10;
          this.offset = 1;
          if (this.cards.length < 3) {
            element.flex = 6;
          } else {
            element.flex = 4;
          }
        });
      }
    },
    resizePage() {
      if (this.windowWidth < 768) {
        this.flex = 12;
        this.offset = 0;
        this.cards.forEach(element => {
          element.flex = 12;
        });
      } else {
        this.cards.forEach(element => {
          this.flex = 10;
          this.offset = 1;
          if (this.cards.length < 3) {
            element.flex = 6;
          } else {
            element.flex = 4;
          }
        });
      }
    }
    // articleClick(event) {
    //   if (this.tokenValid && this.$store.state.isLoggedOn) {
    //     let targetID = event.currentTarget.id;
    //     this.$router.push({ name: "articles", query: { id: targetID } });
    //   } else {
    //     this.$emit("notLoggedIn");
    //   }
    // }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  }
};
</script>

<style scoped>
/* .image {
  max-width: 100%;
} */
</style>
