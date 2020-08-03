<template>
  <v-row justify="center" xs="12">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card xs="12">
        <v-toolbar dark color="indigo">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Sign up or Login</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="dialog = false">Not now</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list three-line subheader>
          <v-subheader>Login or Signup</v-subheader>
          <v-list-item>
            <v-list-item-action>
              <v-btn class="indigo" dark :to="{ name: 'login' }">
                <span>Login</span>
                <v-icon>mdi-login</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Login</v-list-item-title>
              <v-list-item-subtitle>Login to view content</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-action>
              <v-btn class="indigo" dark :to="{ name: 'signup' }">
                <span>Signup</span>

                <v-icon>mdi-location-enter</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Signup</v-list-item-title>
              <v-list-item-subtitle
                >Signup to read more content</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-card-text
          >Lorem ipsum dolor sit amet consectetur, adipisicing elit. Pariatur
          maxime quos adipisci incidunt repudiandae, quasi asperiores, facilis
          itaque explicabo eaque vero eum deserunt sit sint inventore illum
          obcaecati, fuga repellat.</v-card-text
        >
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      dialog: false
    };
  },
  components: {},
  mounted() {
    setTimeout(() => {
      if (!this.$store.state.isLoggedOn) {
        this.dialog = true;
      }
    }, 3000);
  }
};
</script>
