<template>
  <v-card height="150">
    <v-footer fixed class="font-weight-medium" height="200">
      <v-col class="text-center" cols="9">
        {{ new Date().getFullYear() }} — <strong>Blog Name</strong> uses
        <strong>cookies</strong> to improve your experience.
      </v-col>
      <v-col class="text-right" cols="3">
        <v-btn color="green" @click="acceptCookie">Accept</v-btn>
        <v-btn color="red">
          <a href="http://www.google.com/">X</a>
        </v-btn>
      </v-col>
    </v-footer>
  </v-card>
</template>

<script>
export default {
  name: "cookiebar",
  data: () => {
    return {};
  },
  methods: {
    acceptCookie() {
      this.$store.dispatch("acceptCookies");
    }
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
  font-size: 200%;
  color: black;
  font-weight: bold;
}
</style>
