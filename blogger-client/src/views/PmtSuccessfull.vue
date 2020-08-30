<template>
  <div class="about">
    <v-container>
      <v-layout wrap>
        <v-flex mb-5 xs12 md-8 offset-md1 style="background-color: green;">
          <v-flex justify-center mb-2 mt-5 xs12>
            <h1 style="color: white;">Payment Successfull</h1>
          </v-flex>
        </v-flex>
      </v-layout>
    </v-container>
    <v-snackbar v-model="snackbar" :timeout="timeOut" bottom top>
      {{ snackBarMessage }}
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import moment from "moment";
import DirectoryService from "../services/DirectoryServices";
export default {
  name: "pmtSuccessfull",
  data() {
    return {
      newExpiry: null,
      snackbar: false,
      snackBarMessage: "There was a problem, please contact us.",
      timeOut: 1500
    };
  },
  metaInfo: {
    title: "Vellum - Success",
    titleTemplate: "%s",
    meta: [
      {
        name: `description`,
        content: `Successful Payment.`
      }
    ],
    htmlAttrs: {
      lang: "en",
      amp: true
    }
  },
  async mounted() {
    try {
      let search = window.location.search;
      // this.src = this.$router.path;
      let query = search.replace("?", "").split("=");
      let credentials = {
        str: query[query.length - 1]
      };
      let response = await DirectoryService.checkPaidURL(credentials);
      let today = moment(new Date()).format("YYYY-MM-DD");
      if (
        today === response.data.decrypt.variable1 &&
        response.data.decrypt.variable2 === this.$store.state.userId
      ) {
        this.getPmtDetails();
      } else {
        this.snackBarMessage = "Something went wrong";
        this.snackbar = true;
      }
    } catch (e) {
      this.snackBarMessage = "Error getting Payment";
      this.snack = true;
    } finally {
      setTimeout(() => {
        this.$store.dispatch("memberPaid");
        this.gotoHome();
      }, 1500);
    }
  },
  methods: {
    async processPmt() {
      let credentials = {
        id: this.$store.state.userId,
        newExpiry: this.newExpiry
      };
      // console.log(credentials);
      try {
        await DirectoryService.processPayment(credentials);
      } catch (e) {
        this.snackBarMessage = "Error Processing Payment";
        this.snack = true;
      }
    },
    async getPmtDetails() {
      let credentials = {
        id: this.$store.state.userId
      };
      try {
        // console.log(credentials);
        let response = await DirectoryService.memberDetails(credentials);
        let now = moment(new Date())
          .add(1, "month")
          .add(2, "hour")
          .format("YYYY-MM-DD HH:mm:ss");
        let expires = moment(response.data[0].expires)
          .add(1, "month")
          .add(2, "hour")
          .format("YYYY-MM-DD HH:mm:ss");

        if (now > expires) {
          this.newExpiry = now;
        } else {
          this.newExpiry = expires;
        }
        let credentials2 = {
          id: this.$store.state.userId,
          newExpiry: this.newExpiry
        };
        // console.log(credentials2);
        await DirectoryService.processPayment(credentials2);
      } catch (e) {
        this.snackBarMessage = "Error getting payment details";
        this.snack = true;
      }
    },
    gotoHome() {
      this.$router.push({ name: "home" });
    }
  }
};
</script>

<style scoped>
h3 {
  color: #010a43;
  text-decoration-line: underline;
}
a {
  text-decoration: none;
  color: black;
}
h1 {
  color: #010a43;
}
</style>
