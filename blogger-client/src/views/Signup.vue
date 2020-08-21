<template>
  <div>
    <br />
    <v-row dense>
      <v-col>
        <h1>Signup</h1>
        <v-layout align-center justify-center style="padding: 8px;">
          <!-- <v-layout(align-center justify-center)> -->
          <!-- <v-flex
        class="text-xs-center"
        xs-12
        md-6
        lg-4
        offset-md2
        width="300"
        pa-5
      >
        <v-flex
          class="text-xs-center"
          xs-12
          md-6
          lg-4
          offset-md2
          width="300"
          pa-5
          row
        > -->
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              ref="nameInput"
              v-model="name"
              :counter="20"
              maxValue="20"
              :rules="nameRules"
              label="Name"
              @blur="checkName"
              required
            ></v-text-field>
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              @blur="checkEmail"
              required
            ></v-text-field>
            <v-text-field
              ref="mobile"
              v-mask="'###-###-####'"
              v-model="mobile"
              :counter="13"
              maxValue="12"
              placeholder="082-555-5555"
              label="Mobile SA Only"
              required
              @blur="correctNumber"
            ></v-text-field>
            <v-text-field
              v-model="password"
              :rules="passwordRules"
              label="Password"
              :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
              color="#111d5e"
              @click:append="() => (value = !value)"
              :type="value ? 'password' : 'text'"
              required
            ></v-text-field>
            <v-text-field
              v-model="repeatPassword"
              label="Repeat Password"
              type="password"
              required
            ></v-text-field>
            <p v-if="repeatPasswordError">{{ repeatPasswordErrorMessage }}</p>
            <v-checkbox
              v-model="checkbox"
              color="#111d5e"
              :rules="[v => !!v || 'You must agree to continue!']"
              label="Do you agree to behave as per our terms & conditions?"
              required
            ></v-checkbox>
            <br />
            <v-btn
              :disabled="!valid"
              text
              color="success"
              class="mr-4"
              v-if="!emailExists"
              @click="createMember"
            >
              Sign Up
            </v-btn>

            <v-btn text color="error" class="mr-4" @click="reset">
              Reset Form
            </v-btn>

            <v-btn
              color="success"
              text
              v-if="emailExists && email !== '' && checkbox"
              :to="{ name: 'login' }"
            >
              Login
            </v-btn>
            <v-snackbar v-model="snackbar">
              {{ snackbarMessage }}
              <v-btn color="pink" text @click="snackbar = false">
                Close
              </v-btn>
            </v-snackbar>
            <br /><br />
          </v-form>
          <!-- </v-flex> -->
          <!-- </v-flex> -->
        </v-layout>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import DirectoryServices from "@/services/DirectoryServices";
export default {
  name: "signup",
  data: () => ({
    valid: true,
    value: true,
    name: "Wayne Bruton",
    mobile: "",
    mobileForDB: "",
    nameRules: [
      v => !!v || "Name is required",
      v => (v && v.length <= 20) || "Name must be less than 15 characters"
    ],
    // email: "",
    email: "waynebruton@icloud.coma",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    password: "Qwerty1!",
    passwordRules: [
      v => !!v || "Password is required",
      v =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(v) ||
        "Min. 8 characters with at least one capital letter, a number and a special character."
    ],
    repeatPassword: "Qwerty1!",
    repeatPasswordError: false,
    repeatPasswordErrorMessage: "Passwords do not match",
    checkbox: false,
    emailExists: true,
    snackbar: false,
    snackbarMessage: ""
  }),
  components: {},
  mounted() {},
  methods: {
    correctNumber() {
      if (this.mobile.length < 10) {
        this.snackbarMessage = "Mobile number incorrect";
        this.snackbar = true;
        setTimeout(() => {
          this.$refs.mobile.focus();
        }, 0);
      } else {
        let adjustNumber = this.mobile.split("");
        adjustNumber.shift(adjustNumber[0]);
        adjustNumber.unshift("+27");
        adjustNumber = adjustNumber.join("");
        adjustNumber = adjustNumber.split("-");
        adjustNumber = adjustNumber.join("");
        this.mobileForDB = adjustNumber;
        // console.log(this.mobileForDB);
      }
    },
    async checkName() {
      let nameCheck = await DirectoryServices.checkName({ name: this.name });
      // console.log("Name Check", nameCheck.data);
      if (nameCheck.data.length) {
        this.snackbarMessage = "Your Name must be unique";
        this.snackbar = true;
        this.name = "";
        setTimeout(() => {
          this.$nextTick(() => {
            this.$refs.nameInput.focus();
          });
        }, 0);
      }
    },
    async createMember() {
      let user = {
        name: this.name,
        email: this.email,
        password: this.password,
        mobile: this.mobileForDB
      };
      let response = await DirectoryServices.createMember(user);
      window.localStorage.setItem("token", response.data.token);
      let member = response.data.member;
      this.$store.dispatch("setUser", member);
      if (this.$store.state.viewArticleIdBeforeLoggedIn !== null) {
        this.$router.push({
          name: "articles",
          query: { id: this.$store.state.viewArticleIdBeforeLoggedIn }
        });
      } else {
        this.$router.push({ name: "home" });
      }
    },
    reset() {
      this.$refs.form.reset();
      this.checkbox = false;
    },
    // resetValidation() {
    //   this.$refs.form.resetValidation();
    // },
    async checkEmail() {
      let email = {
        email: this.email
      };
      let response = await DirectoryServices.checkEmail(email);
      if (response.data.length > 0) {
        this.emailExists = true;
        this.snackbarMessage = "Email exists - Rather login?";
        this.snackbar = true;
      } else {
        this.emailExists = false;
      }
    },
    logoff() {
      this.$store.dispatch("logout");
    }
  },
  watch: {
    repeatPassword: function() {
      if (this.repeatPassword !== this.password) {
        this.repeatPasswordError = true;
      } else {
        this.repeatPasswordError = false;
      }
    },
    mobile: function() {
      let test = this.mobile.split("");
      if (test[0] !== "0") {
        test.unshift("0");
        this.mobile = test.join("");
      }
      // console.log(this.mobile);
    }
  }
};
</script>

<style scoped>
p {
  color: red;
  font-size: 80%;
  text-align: left;
}
</style>
