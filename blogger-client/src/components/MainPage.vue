<template>
  <div class="about">
    <v-layout fluid style="display:flex; flex-direction:column;">
      <v-col :cols="flex" :offset="offset">
        <h1 v-if="this.$store.state.isLoggedOn">
          Hello
          {{ this.$store.state.userName }}
        </h1>
      </v-col>
      <v-col :cols="flex" :offset="offset">
        <v-btn icon @click="viewChange">
          <v-icon color="#111d5e" large>{{ viewLook }}</v-icon>
        </v-btn>

        <v-layout
          v-if="viewLook !== 'mdi-view-grid'"
          style="display:flex; flex-direction:column;"
        >
          <ArticlesLatestGrid />
          <br />
          <ArticlesInterestsGrid
            :tags="tags"
            v-if="tags.length !== 0 && this.$store.state.isLoggedOn"
          />
          <br />
          <ArticlesFollowingGrid
            :following="following"
            v-if="following.length !== 0 && this.$store.state.isLoggedOn"
          />
        </v-layout>
        <v-layout v-else style="display:flex; flex-direction:column;">
          <br /><br />
          <ArticlesLatestList />
          <br />
          <ArticlesInterestList
            :tags="tags"
            v-if="tags.length !== 0 && this.$store.state.isLoggedOn"
          />
          <br />
          <ArticlesFollowingList
            :following="following"
            v-if="following.length !== 0 && this.$store.state.isLoggedOn"
          />
        </v-layout>
      </v-col>
    </v-layout>
  </div>
</template>

<script>
import DirectoryService from "../services/DirectoryServices";
export default {
  name: "MainPage",

  data: () => ({
    windowWidth: null,
    viewLook: "mdi-view-grid",
    flex: 12,
    offset: 0,
    tags: [],
    following: []
  }),
  components: {
    ArticlesLatestGrid: () => import("./ArticlesLatestGrid"),
    ArticlesInterestsGrid: () => import("./ArticlesInterestsGrid"),
    ArticlesFollowingGrid: () => import("./ArticlesFollowingGrid"),
    ArticlesLatestList: () => import("./ArticlesLatestList"),
    ArticlesInterestList: () => import("./ArticlesInterestList"),
    ArticlesFollowingList: () => import("./ArticlesFollowingList")
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
    let response = await DirectoryService.yourInterests(credentials);
    let followingResponse = await DirectoryService.youFollowing(credentials);
    // console.log("followingResponse",followingResponse.data)
    let following = [];

    followingResponse.data.forEach(el => {
      following.push(el.member_following);
    });
    this.following = following;
    // console.log(following)
    // console.log(response.data[0].tags);
    this.tags = JSON.parse(response.data[0].tags);
    // console.log(this.tags)
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
</style>
