<template>
  <div class="holding">
    <v-container>
      <v-col>
          <!-- <chat /> -->

        <v-container v-if="viewLook !== 'mdi-view-grid'">
          <h1 v-if="this.$store.state.isLoggedOn">
            Hello
            {{ this.$store.state.userName }}
          </h1>

          <h2>Latest Articles</h2>
          <v-btn icon @click="viewChange">
            <v-icon>{{ viewLook }}</v-icon>
          </v-btn>
          <br /><br />
          <v-card
            class="mx-auto"
            max-width="1000"
            elevation="0"
            min-height="5000"
          >
            <v-container
              fluid
              v-if="tokenValid && this.$store.state.isLoggedOn"
            >
              <v-row dense>
                <v-col
                  v-for="card in cards"
                  :key="card.id"
                  :cols="card.flex"
                  elevation="0"
                >
                  <v-card :id="card.id" @click="articleClick($event)">
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
                    <v-card-text>{{ card.credit }}</v-card-text>
                    <v-card-text
                      ><strong>By:</strong> {{ card.author }}</v-card-text
                    >
                    <v-card-text v-text="card.text"></v-card-text>
                    <v-card-text>Words:{{ card.word_count }}</v-card-text>
                    <v-card-text v-if="card.readtime > 1"
                      >Time to Read: {{ card.readtime }} Minutes</v-card-text
                    >
                    <v-card-text v-if="card.readtime < 2"
                      >Time to Read: {{ card.readtime }} Minute</v-card-text
                    >
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn icon>
                        <v-icon>mdi-book-open-page-variant</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
            <v-container fluid v-else>
              <v-card>
                <v-img
                  :src="require('../assets/eggs.jpg')"
                  class="white--text align-end"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                  height="200px"
                >
                  <v-card-title justify-center>YOU MUST LOGIN</v-card-title>
                </v-img>
                <v-card-text
                  >You need to signup in order to view articles.</v-card-text
                >
              </v-card>
            </v-container>
          </v-card>
        </v-container>

        <v-container v-else>
          <h1 v-if="this.$store.state.isLoggedOn">
            Hello
            {{ this.$store.state.userName }}
          </h1>
          <v-btn icon @click="viewChange">
            <v-icon>{{ viewLook }}</v-icon>
          </v-btn>
          <br /><br />
          <v-col :cols="flex" :offset="offset">
            <v-card max-width="1000" class="mx-auto" elevation="1">
              <v-toolbar color="rgba(171, 177, 184, 0.2)" elevation="0">
                <v-toolbar-title>Latest Articles</v-toolbar-title>
              </v-toolbar>
              <v-list multiple subheader>
                <v-list-item
                  v-for="item in cards"
                  :key="item.id"
                  :id="item.id"
                  @click="articleClick($event)"
                >
                  <v-list-item-content justify-start>
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                    <v-list-item-subtitle
                      >by: {{ item.author }}</v-list-item-subtitle
                    >
                    <v-list-item-subtitle
                      >{{ item.readtime }} min read</v-list-item-subtitle
                    >
                  </v-list-item-content>
                  <v-spacer></v-spacer>
                  <v-list-item-action>
                    <cld-image
                      :cloudName="cloudName"
                      :publicId="item.publicId"
                      loading="lazy"
                      width="60"
                      heigh="60"
                    >
                      <cld-transformation
                        crop="fill"
                        quality="auto"
                        angle="10"
                      />
                    </cld-image>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-container>
      </v-col>
    </v-container>

    <div v-if="!this.tokenValid || !this.$store.state.isLoggedOn">
      <SignupPopup />
    </div>
  </div>
</template>

<script>
import DirectoryServices from "@/services/DirectoryServices";
import SignupPopup from "./SignupPopup";
// import Chat from "../components/Chat";

export default {
  name: "MainPage",

  data: () => ({
    alignments: ["start", "center", "end"],
    tokenValid: true,
    cards: [],
    windowWidth: null,
    cloudName: `${process.env.VUE_APP_CLOUDNAME}`,
    preset: `${process.env.VUE_APP_PRESET}`,
    viewLook: "mdi-view-grid",
    flex: 12,
    offset: 0,
    loggedIn: false,
  }),
  components: {
    SignupPopup,
    // Chat
  },
  watch: {
    loggedIn: function() {
      if (!this.loggedIn) {
        this.viewLook = "mdi-format-list-bulleted";
      }
    },
    windowWidth: function() {
      this.resizePage();
    },
  },
  async mounted() {
    this.loggedIn = this.$store.state.isLoggedOn;
    let response = await DirectoryServices.startApp();

    if (response.data.success === false) {
      this.viewLook = "mdi-format-list-bulleted";
      this.tokenValid = false;
      this.$store.dispatch("logout");
    } else {
      this.tokenValid = true;
      this.cards = response.data;
    }
    this.windowWidth = window.innerWidth;
    setTimeout(() => {
      this.$nextTick(() => {
        window.addEventListener("resize", this.onResize);
      });
      this.resizePage();
    }, 0);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    resizePage() {
      if (this.windowWidth < 768) {
        this.cards.forEach((element) => {
          element.flex = 12;
          this.flex = 12;
          this.offset = 0;
          element.title = element.title.toUpperCase();
        });
      } else {
        this.cards.forEach((element) => {
          this.flex = 10;
          this.offset = 1;
          if (this.cards.length < 3) {
            element.flex = 6;
            element.title = element.title.toUpperCase();
          } else {
            element.flex = 4;
            element.title = element.title.toUpperCase();
          }
        });
      }
    },
    articleClick(event) {
      let targetID = event.currentTarget.id;
      this.$router.push({ name: "articles", query: { id: targetID } });
    },
    viewChange() {
      if (this.viewLook === "mdi-format-list-bulleted") {
        this.viewLook = "mdi-view-grid";
      } else {
        this.viewLook = "mdi-format-list-bulleted";
      }
    },
  },
};
</script>

<style scoped>
.custom-selector {
  font-size: 80%;
}
.holding {
  display: flex;
}
body {
  background-color: rgba(171, 177, 184, 0.2);
}
</style>
