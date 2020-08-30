<template>
  <div>
    <v-app-bar app color="#111d5e" dark style="opacity:1;">
      <div class="d-flex align-center">
        <v-img
          v-if="this.$route.name === 'home'"
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          transition="scale-transition"
          width="35"
          :src="src"
        />
        <div class="returnHome" v-if="this.$route.name !== 'home'">
          <v-icon @click="home" dark x-large>mdi-chevron-left</v-icon>
        </div>

        <div v-if="windowWidth > 768">
          <h1 class="returnHome" @click="home">Vellum</h1>
        </div>
        <div v-else>
          <h3 class="returnHome" @click="home">Vellum</h3>
        </div>
      </div>
      <v-spacer></v-spacer>

      <v-btn
        icon
        text
        :to="{ name: 'dashboard' }"
        v-if="
          this.$store.state.isLoggedOn &&
            this.$store.state.isAdmin &&
            this.$route.name != 'dashboard'
        "
      >
        <v-icon>mdi-desktop-mac-dashboard</v-icon>
      </v-btn>
      <v-spacer
        v-if="this.$store.state.isLoggedOn && this.windowWidth > 768"
      ></v-spacer>

      <div v-if="this.$store.state.isLoggedOn && this.windowWidth > 768">
        <chat />
      </div>
      <v-spacer></v-spacer>

      <div v-if="windowWidth > 768" style="display: flex; padding-top: 12px;">
        <div v-for="item in activeItems" :key="item.id">
          <v-btn
            v-if="item.menu !== 1"
            class="active-items"
            text
            :to="{ name: item.name }"
            :id="item.id"
            @click="logout($event)"
          >
            <span class="mr-2">{{ item.title }}</span>
            <v-icon>{{ item.icon }}</v-icon>
          </v-btn>
        </div>
        <v-spacer></v-spacer>
        <v-menu bottom left offsetY min-width="12%" max-width="100%">
          <template v-slot:activator="{ on }">
            <v-btn dark icon v-on="on">
              <v-icon style="padding-bottom: 12px;">mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list v-for="item in activeItems" :key="item.id">
            <v-list-item
              v-if="item.menu === 1"
              class="active-items"
              :id="item.id"
              @click="logout($event)"
              :to="{ name: item.name }"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-icon color="#111d5e" style="margin-right: 5px;">{{
                item.icon
              }}</v-icon>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div v-else>
        <v-menu bottom left offsetY min-width="80%" max-width="80%">
          <template v-slot:activator="{ on }">
            <v-btn dark icon v-on="on">
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              class="active-items"
              v-for="item in activeItems"
              :key="item.id"
              :id="item.id"
              @click="logout($event)"
              :to="{ name: item.name }"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-icon color="#111d5e" style="margin-right: 5px;">{{
                item.icon
              }}</v-icon>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>
  </div>
</template>

<script>
import Chat from "./Chat";
export default {
  data: () => ({
    windowWidth: null,
    src: require("../assets/Logo.png"),
    items: [
      //MENU 1 = DROPDOWN
      {
        title: "Sign up",
        name: "signup",
        icon: "mdi-location-enter",
        show: 2,
        menu: 0,
        id: "signup"
      },
      {
        title: "Login",
        name: "login",
        icon: "mdi-login",
        show: 2,
        menu: 0,
        id: "login"
      },
      {
        title: "Search",
        name: "search",
        icon: "mdi-magnify",
        show: 1,
        menu: 0,
        id: "search"
      },
      {
        title: "Upload",
        name: "uploadArticle",
        icon: "mdi-book-open-page-variant",
        show: 1,
        menu: 0,
        id: "upload"
      },
      {
        title: "My Stuff",
        name: "setup",
        icon: "mdi-account-box",
        show: 1,
        menu: 0,
        id: "setup"
      },

      {
        title: "About",
        name: "about",
        icon: "mdi-information",
        show: 3,
        menu: 1,
        id: "about"
      },
      {
        title: "FAQ",
        name: "faq",
        icon: "mdi-progress-question",
        show: 3,
        menu: 1,
        id: "faq"
      },
      {
        title: "T&C's",
        name: "terms",
        icon: "mdi-file-document-multiple",
        show: 3,
        menu: 1,
        id: "t&c"
      },
      {
        title: "Contact",
        name: "contact",
        icon: "mdi-chat-plus",
        show: 3,
        menu: 1,
        id: "contact"
      },
      {
        title: "Logout",
        name: "logout",
        icon: "mdi-logout",
        show: 1,
        menu: 1,
        id: "logout"
      }
    ]
  }),
  components: {
    Chat
  },
  created() {
    this.windowWidth = window.innerWidth;
    window.onresize = () => {
      this.windowWidth = window.innerWidth;
    };
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  computed: {
    activeItems: function() {
      //IF LOGGED ON
      if (this.$store.state.isLoggedOn) {
        return this.items.filter(function(item) {
          return item.show !== 2;
        });
      } else {
        //NOT LOGGED ON
        return this.items.filter(function(item) {
          return item.show !== 1;
        });
      }
    }
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    home() {
      if (this.$route.name !== "home") {
        this.$router.push({ name: "home" });
      }
    },
    about() {
      if (this.$route.name !== "about") {
        this.$router.push({ name: "about" });
      }
    },
    logout(event) {
      let targetID = event.currentTarget.id;
      if (targetID === "logout") {
        this.$store.dispatch("logout");
        // this.about();
        setTimeout(() => {
          this.home();
        }, 1);
        window.localStorage.removeItem("token");
      }
    }
  }
};
</script>

<style scoped>
.returnHome:hover {
  cursor: pointer;
}
</style>
