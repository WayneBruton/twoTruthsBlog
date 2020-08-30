<template>
  <div class="about" v-if="cards.length > 0">
    <v-col :cols="flex" :offset="offset">
      <v-card max-width="1000" min-width="100%" class="mx-auto" elevation="1">
        <v-toolbar color="#111d5e" dark elevation="0">
          <v-toolbar-title>Your Interests</v-toolbar-title>
        </v-toolbar>
        <v-list multiple subheader>
          <v-list-item
            v-for="item in cards"
            :key="item.id"
            :id="item.id"
            @click="articleClick($event)"
          >
            <v-list-item-content justify-start>
              <v-list-item-title
                v-text="item.title"
                style="font-size: 100%;"
              ></v-list-item-title>
              <v-list-item-subtitle>by: {{ item.author }}</v-list-item-subtitle>
              <v-list-item-subtitle
                >{{ item.readtime }} min read</v-list-item-subtitle
              >
            </v-list-item-content>
            <v-list-item-action>
              <cld-image
                :cloudName="cloudName"
                :publicId="item.publicId"
                loading="lazy"
                :width="width"
                :height="height"
              >
                <cld-transformation crop="fill" quality="auto" angle="0" />
              </cld-image>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="showMore"
            v-if="cards.length >= this.$store.state.limitInterestArticles"
            >... more</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-col>
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
  props: ["tags"],
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
  watch: {
    windowWidth: function() {
      this.resizePage();
    }
  },
  async mounted() {
    window.scrollTo(0, 0);
    this.loggedIn = this.$store.state.isLoggedOn;
    let credentials = {
      tags: this.tags,
      newlimit: this.$store.state.limitInterestArticles
    };
    try {
      let response = await DirectoryServices.yourLatestInterests(credentials);

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
  methods: {
    async showMore() {
      this.$store.dispatch("limitInterestArticles");
      let credentials = {
        tags: this.tags,
        newlimit: this.$store.state.limitInterestArticles
      };
      try {
        let response = await DirectoryServices.yourLatestInterests(credentials);

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
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    resizePage() {
      if (this.windowWidth < 768) {
        this.flex = 12;
        this.offset = 0;
        this.width = 40;
        this.height = 40;
        this.cards.forEach(element => {
          element.flex = 12;

          element.title = element.title.toUpperCase();
        });
      } else {
        this.cards.forEach(element => {
          this.flex = 10;
          this.offset = 1;
          this.width = 60;
          this.height = 60;
          if (this.cards.length < 3) {
            element.flex = 6;
            element.title = element.title.toUpperCase();
          } else {
            element.flex = 4;
            element.title = element.title.toUpperCase();
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
.v-list-item {
  background: white;
}
.v-list-item:nth-child(odd) {
  background: rgba(245, 240, 240, 0.1);
}
/* } */
@media only screen and (max-width: 768px) {
  .v-list-item {
    font-size: 80%;
  }
  .v-list-item {
    background: white;
  }
  .v-list-item:nth-child(odd) {
    background: rgba(245, 240, 240, 0.1);
  }
}
</style>
