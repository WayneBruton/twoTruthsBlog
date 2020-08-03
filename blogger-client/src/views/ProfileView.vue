<template>
  <div class="about">
    <br />
    <br />
    <v-container fluid v-if="this.$store.state.isLoggedOn">
      <v-row dense justify-center>
        <v-col :cols="flex" :offset="offset">
          <h1>{{ name }}</h1>
        </v-col>
        <v-col
          v-if="this.$store.state.avatar && src !== 0"
          :cols="flex"
          :offset="offset"
          center
        >
          <cld-image :cloudName="cloudName" :publicId="src">
            <cld-transformation
              crop="fill"
              border="2px_solid_transparent"
              gravity="face"
              radius="max"
              width="150"
              height="150"
              quality="auto"
              loading="lazy"
            />
          </cld-image>
        </v-col>
        <br />

        <v-col :cols="flex" :offset="offset" v-if="this.showEmail === 1">
          <label justify-left>{{ email }}</label>
        </v-col>
        <v-col :cols="flex" :offset="offset">
          <label justify-left>{{ website }}</label>
        </v-col>
        <v-col :cols="flex" :offset="offset">
          <v-textarea
            style="margin: 15px 15px; padding: 5px 10px;"
            placeholder="Tell us about yourself"
            v-model="aboutMember"
            rounded
            solo
            readonly
          >
          </v-textarea>
        </v-col>
        <v-col :cols="flex" :offset="offset">
          <!-- :type="value ? 'password' : 'text'" -->
          <label justify-left
            >{{ followers }}
            {{ followers === 1 ? "follower" : "followers" }}</label
          >
        </v-col>
        <v-col :cols="flex" :offset="offset">
          <label justify-left
            >following: {{ following }}
            {{ following === 1 ? "member" : "members" }}
          </label>
        </v-col>
        <br /><br />
      </v-row>
    </v-container>
  </div>
</template>

<script>
import DirectoryService from "../services/DirectoryServices";
export default {
  name: "setup",
  components: {},
  data() {
    return {
      flex: 6,
      offset: 2,
      cloudName: `${process.env.VUE_APP_CLOUDNAME}`,
      preset: `${process.env.VUE_APP_PRESET}`,
      src: "",
      name: "",
      email: "",
      website: "",
      showEmail: null,
      aboutMember: "",
      followers: 999,
      following: 999,
      windowWidth: null
    };
  },
  async mounted() {
    this.windowWidth = window.innerWidth;
    setTimeout(() => {
      this.$nextTick(() => {
        window.addEventListener("resize", this.onResize);
      });
      this.resizePage()
    }, 0);
    // if (this.windowWidth < 768) {
    //   this.flex = 12;
    //   this.offset = 0;
    // } else {
    //   this.flex = 6;
    //   this.offset = 3;
    // }
    let search = window.location.search;
    let query = search.replace("?", "").split("=");
    // let credentials = query[query.length - 1];
    let credentials = { id: query[query.length - 1] };
    console.log(credentials);
    let response = await DirectoryService.viewProfile(credentials);
    console.log(response.data);
    this.email = response.data[0][0].email;
    this.name = response.data[0][0].name;
    this.website = response.data[0][0].website;
    this.src = response.data[0][0].avatar;
    this.showEmail = response.data[0][0].showEmail;
    this.aboutMember = response.data[0][0].aboutMember;
    this.followers = response.data[1][0].followers;
    this.following = response.data[2][0].following;
  },
  computed: {},
  watch: {
    windowWidth: function() {
      this.resizePage()
    }
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
      this.flex = 6;
      this.offset = 3;
    }
     }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
};
</script>

<style scoped></style>
