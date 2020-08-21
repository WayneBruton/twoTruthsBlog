<template>
  <div class="about temp">
    <br />
    <v-row justify="center">
      <v-card elevation="15" width="800" max-width="90%">
        <br />
        <v-btn color="#111d5e" text icon @click="back">
          <v-icon color="#111d5e" x-large>mdi-chevron-left</v-icon>
          <strong>Back</strong>
        </v-btn>
        <v-card-title>
          <span class="headline">Contact Vellum</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" xs="12" sm="12" md="12" v-if="!isLoggedOn">
                <v-text-field
                  v-model="email"
                  label="email*"
                  type="email"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" xs="12" sm="6" md="6" v-if="!isLoggedOn">
                <v-text-field
                  label="First Name*"
                  v-model="name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="12">
                <v-text-field
                  label="Subject*"
                  v-model="subject"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="12">
                <v-textarea
                  label="Content*"
                  v-model="content"
                  required
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="#010a43" text @click="reset"
            ><v-icon color="#010a43">mdi-lock-reset</v-icon>Reset</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn color="#010a43" text @click="send"
            ><v-icon color="#010a43">mdi-email-send</v-icon>Send</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
      <v-snackbar v-model="snackbar" :timeout="timeOut" bottom top>
        {{ snackBarMessage }}
        <v-btn color="pink" text @click="snackbar = false">
          Close
        </v-btn>
      </v-snackbar>
    </v-row>
    <br /><br /><br /><br />
  </div>
</template>

<script>
import DirectoryService from "../services/DirectoryServices";
export default {
  name: "contact",
  metaInfo: {
    title: `Vellum - Contact`,
    meta: [
      {
        name: `description`,
        content: `Staff Policies, remote work, telecommute`
      }
    ]
  },
  data() {
    return {
      timeOut: 2000,
      subject: "",
      content: "",
      email: "",
      name: "",
      // lastName: "",
      userID: null,
      isLoggedOn: false,
      snackbar: false,
      snackBarMessage: "Awesome"
    };
  },
  mounted() {
    // try {
    window.scrollTo(0, 0);
    this.isLoggedOn = this.$store.state.isLoggedOn;
    if (this.isLoggedOn) {
      this.userID = this.$store.state.userId;
      this.email = this.$store.state.email;
      this.name = this.$store.state.userName;
    }
    // this.snackBarMessage = `${this.userID}: ${this.email}; ${this.name}`;
    // this.snackbar = true;
  },
  methods: {
    back() {
      this.$router.back();
    },
    async send() {
      try {
        if (
          this.subject === "" ||
          this.content === "" ||
          this.email === "" ||
          this.name === ""
        ) {
          this.snackBarMessage = "All fields must be filled in.";
          return (this.snackbar = true);
        } else {
          let credentials = {
            firstName: this.name,
            email: this.email,
            subject: this.subject,
            message: this.content
          };
          let response = await DirectoryService.contactForm(credentials);
          // console.log(response.data);
          if (response.data.error) {
            this.snackBarMessage =
              "There was a problem, please try again later.";
            this.snackbar = true;
          } else {
            this.subject = "";
            this.content = "";
            // if (!this.isLoggedOn) {
            //   this.email = "";
            //   this.name = "";
            // }
            this.snackBarMessage = `${this.name}, your message has been sent. We will get back to you.`;
            this.snackbar = true;
          }
          // console.log(credentials)
        }
      } catch (error) {
        this.snackBarMessage = "Network Error(55), please try later!";
        this.snackbar = true;
        // this.dialog = false;
      }
    },
    reset() {
      this.subject = "";
      this.content = "";
      if (!this.isLoggedIn) {
        this.email = "";
        this.lastName = "";
        this.firstName = "";
      }
    }
  }
};
</script>

<style styles>
.temp {
  min-height: 95vh;
}
</style>
