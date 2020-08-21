<template>
  <div>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        hide-overlay
        persistent
        opacity="1"
        width="1100"
        max-width="100%"
      >
        <v-card max-width="1100">
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
              ><u
                ><h3 style="color: #111d5e;">Earn from your Passion</h3></u
              ></span
            >
            <v-spacer></v-spacer>
            <!-- <v-btn text icon @click="close">
              Close
              <v-icon color="red">mdi-close-circle</v-icon>
            </v-btn> -->
          </v-card-title>
          <br />
          <v-card-subtitle><h3>Why we are here</h3></v-card-subtitle>
          <v-card-text>
            <p>
              South African Bloggers & Writers tend to harshly lose out on sites
              in other countries that offer bloggers and writers an income for
              "Good Work". Many of these sites do not deal with online merchants
              that deal with South Afican banks resulting in us South Africans
              being unable to earn from our writing and blogging. With COVID-19
              so many people have lost an income, many of you are exceptional
              writers and bloggers with a huge following. We want to adress this
              and ensure that you get paid for your passion.
            </p>
          </v-card-text>
          <v-card-subtitle><h3>How we will do this</h3></v-card-subtitle>
          <v-card-text>
            <p>
              A sizeable pool from subscribers will be formed and each month the
              divisible portion of the pool will be paid out to subscribed
              writer's / blogger's in a ratio the total "likes" received on all
              the writer's / blogger's articles for that given month in
              proportion the total of all "likes" for the given month. Please
              see the 'FAQ' and 'about' sections for more details. On top of
              this we want to set up a charitable fund to support people whose
              livelihoods have been destroyed by the pandemic.
            </p>
          </v-card-text>
          <v-card-subtitle
            ><h3>I am not a writer - why subscribe?</h3></v-card-subtitle
          >
          <v-card-text>
            <p>
              You will be able to read / view an unlimited number of blog
              articles. You will have an opportunity to expand your knowledge
              and experience by reading blogs posted by some awesome writers /
              bloggers and some not so awesome ones (like yours truly). Also you
              will be contributing to the livelihoods of people in a difficult
              industry. Also you will be assisting people whose livelihoods have
              been destroyed by the way the the pandemic has been handled, good
              hard working people who have lost jobs and livelihoods.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text icon @click="close" style="padding-bottom: 10px;">
              Close
              <v-icon color="red">mdi-close-circle</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialog: true,
      src: require("../assets/Logo.png")
    };
  },
  methods: {
    close() {
      this.dialog = false;
      this.$store.dispatch("hideIntro");
    }
  }
};
</script>

<style scoped>
p {
  color: black;
  font-size: 100%;
}
h3 {
  font-size: 100%;
}
.v-card v-card-subtitle {
  margin: 0px 0px;
}
</style>
