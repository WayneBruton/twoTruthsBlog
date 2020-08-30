<template>
  <div class="about">
    <v-layout fluid style="display:flex; flex-direction:column;">
      <v-col :cols="flex" :offset="offset">
        <h1 v-if="this.$store.state.isLoggedOn">
          Hello
          {{ this.$store.state.userName }}
        </h1>
      </v-col>
      <!-- <v-col :cols="flex" :offset="offset">
        <Advert />
      </v-col> -->
      <v-col :cols="flex" :offset="offset">
        <v-btn icon @click="viewChange">
          <v-icon color="#111d5e" large>{{ viewLook }}</v-icon>
        </v-btn>

        <v-layout
          v-if="viewLook !== 'mdi-view-grid'"
          style="display:flex; flex-direction:column;"
        >
          <br />
          <ArticlesLatestGrid @notLoggedIn="dialog = true" />
          <br />
          <ArticlesInterestsGrid
            @notLoggedIn="dialog = true"
            :tags="tags"
            v-if="tags.length !== 0 && this.$store.state.isLoggedOn"
          />
          <br />
          <ArticlesPopularGrid @notLoggedIn="dialog = true" />
          <br />
          <ArticlesFollowingGrid
            @notLoggedIn="dialog = true"
            :following="following"
            v-if="following.length !== 0 && this.$store.state.isLoggedOn"
          />
        </v-layout>
        <v-layout v-else style="display:flex; flex-direction:column;">
          <br /><br />
          <ArticlesLatestList @notLoggedIn="dialog = true" />
          <br />
          <ArticlesInterestList
            @notLoggedIn="dialog = true"
            :tags="tags"
            v-if="tags.length !== 0 && this.$store.state.isLoggedOn"
          />
          <br />
          <ArticlesPopularList @notLoggedIn="dialog = true" />
          <br />
          <ArticlesFollowingList
            @notLoggedIn="dialog = true"
            :following="following"
            v-if="following.length !== 0 && this.$store.state.isLoggedOn"
          />
        </v-layout>
      </v-col>
      <!-- <v-col :cols="flex" :offset="offset">
        <Advert />
      </v-col> -->
    </v-layout>

    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        rounded
        hide-overlay
        persistent
        opacity="1"
        width="500"
        max-width="100%"
      >
        <v-card max-width="750" rounded style="border: 1px solid #111d5e;">
          <div style="display: flex; justify-content: center;" elevation="3">
            <v-img
              style="margin-top: 10px;"
              alt="Vuetify Logo"
              class="shrink mr-2"
              contain
              transition="scale-transition"
              width="80"
              :src="src"
            />
          </div>
          <v-card-title>
            <v-spacer></v-spacer>
            <span class="headline"
              ><h3 style="color: #111d5e;">
                You are not logged in.
              </h3></span
            >
            <v-spacer></v-spacer>
          </v-card-title>
          <br />
          <v-card-text>
            <p>
              You must be logged in, please <em><u>log in</u></em> or
              <em><u>signup</u></em> if you have not already done so.
            </p>
          </v-card-text>
          <br />
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog = false" style="padding-bottom: 10px;">
              Not Now
              <v-icon color="red">mdi-close-circle</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              text
              icon
              style="padding-bottom: 10px;"
              :to="{ name: 'login' }"
            >
              login
              <v-icon color="#111d5e">mdi-login-variant</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              text
              icon
              style="padding-bottom: 10px;"
              :to="{ name: 'signup' }"
            >
              Sign up
              <v-icon color="#111d5e">mdi-location-enter</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
          <br />
        </v-card>
      </v-dialog>
    </v-row>
    <div v-if="this.$store.state.showIntro && !this.$store.state.isLoggedOn">
      <Intro />
    </div>
    <div v-if="this.$store.state.showSubscribe">
      <Subscribe />
    </div>
  </div>
</template>

<script>
// import moment from "moment";
import DirectoryService from "../services/DirectoryServices";
export default {
  name: "MainPage",
  metaInfo: {
    title: "Vellum",
    titleTemplate: "%s",
    htmlAttrs: {
      lang: "en",
      amp: true
    }
  },
  data: () => ({
    windowWidth: null,
    viewLook: "mdi-view-grid",
    flex: 12,
    offset: 0,
    tags: [],
    following: [],
    dialog: false,
    src: require("../assets/Logo.png"),
    timeOut: 2000
  }),
  components: {
    ArticlesLatestGrid: () => import("./mainPage/ArticlesLatestGrid"),
    ArticlesInterestsGrid: () => import("./mainPage/ArticlesInterestsGrid"),
    ArticlesFollowingGrid: () => import("./mainPage/ArticlesFollowingGrid"),
    ArticlesPopularGrid: () => import("./mainPage/ArticlesPopularGrid"),
    ArticlesLatestList: () => import("./mainPage/ArticlesLatestList"),
    ArticlesInterestList: () => import("./mainPage/ArticlesInterestList"),
    ArticlesFollowingList: () => import("./mainPage/ArticlesFollowingList"),
    ArticlesPopularList: () => import("./mainPage/ArticlesPopularList"),
    // Advert: () => import("./Advert"),
    Intro: () => import("./Intro"),
    Subscribe: () => import("./Subscribe")
  },
  watch: {
    loggedIn: function() {
      if (!this.loggedIn) {
        this.viewLook = "mdi-format-list-bulleted";
      }
    },
    windowWidth: function() {
      this.resizePage();
    }
  },
  async mounted() {
    // this.$store.dispatch("showSubscribe");
    this.$store.dispatch("resetSubscribe");

    // console.log("THIS MONTH IS:", moment(new Date()).format("MMMM YYYY"));
    window.scrollTo(0, 0);
    this.loggedIn = this.$store.state.isLoggedOn;
    this.windowWidth = window.innerWidth;
    setTimeout(() => {
      this.$nextTick(() => {
        window.addEventListener("resize", this.onResize);
      });
      this.resizePage();
    }, 0);
    this.viewLook = this.$store.state.viewLook;
    let credentials = {
      id: this.$store.state.userId
    };
    try {
      if (this.$store.state.isLoggedOn) {
        let response = await DirectoryService.yourInterests(credentials);
        let followingResponse = await DirectoryService.youFollowing(
          credentials
        );
        let following = [];
        if (followingResponse.data.length) {
          followingResponse.data.forEach(el => {
            following.push(el.member_following);
          });
        }
        this.following = following;
        this.tags = JSON.parse(response.data[0].tags);
      }
    } catch (e) {
      // this.snackBarMessage = "Error getting articles";
      // this.snack = true;
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    // resetAlloweds() {
    //   this.$store.dispatch("resetAllowedToView");
    // },
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    resizePage() {
      if (this.windowWidth < 768) {
        this.flex = 12;
        this.offset = 0;
      } else {
        this.flex = 10;
        this.offset = 1;
      }
    },
    viewChange() {
      if (this.viewLook === "mdi-format-list-bulleted") {
        this.viewLook = "mdi-view-grid";
      } else {
        this.viewLook = "mdi-format-list-bulleted";
      }
      this.$store.dispatch("changeView", {
        viewLook: this.viewLook
      });
    }
  }
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
p {
  color: black;
  font-size: 140%;
}
h3 {
  font-size: 100%;
}
.v-card v-card-subtitle {
  margin: 0px 0px;
}
</style>
