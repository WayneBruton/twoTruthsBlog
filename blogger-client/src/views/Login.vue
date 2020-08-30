<template>
  <div>
    <br />
    <v-row dense>
      <v-col :cols="flex" :offset="offset">
        <h1>Login</h1>
        <v-layout align-center justify-center>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              @blur="checkEmail"
              required
            ></v-text-field>
            <div v-if="passwordResetToken === null">
              <v-text-field
                v-model="password"
                label="Password"
                :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="() => (value = !value)"
                :type="value ? 'password' : 'text'"
                required
              ></v-text-field>
              <br />
              <v-btn
                text
                color="success"
                class="mr-4"
                v-if="emailExists && password && passwordResetToken == null"
                @click="login"
              >
                Login
              </v-btn>
              <v-btn
                text
                color="success"
                class="mr-4"
                v-if="passwordIncorrect"
                @click="resetPasswordToken"
              >
                Lost Password
              </v-btn>
              <v-btn
                color="red"
                text
                v-if="!emailExists && email !== ''"
                :to="{ name: 'signup' }"
              >
                Signup
              </v-btn>
            </div>
            <div v-else>
              <v-text-field
                v-model="enteredToken"
                label="Enter Token"
                required
              ></v-text-field>
              <v-text-field
                v-model="newPassword"
                label="New Password"
                :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="() => (value = !value)"
                :type="value ? 'password' : 'text'"
                required
              ></v-text-field>
              <v-text-field
                v-model="newPasswordRepeat"
                label="Repeat New Password"
                type="password"
                required
              ></v-text-field>
              <v-btn
                text
                color="success"
                class="mr-4"
                @click="cancelResetPassword"
              >
                Cancel
              </v-btn>
              <v-btn text color="success" class="mr-4" @click="resetPassword">
                Reset Password
              </v-btn>
            </div>
            <v-snackbar v-model="snackbar" top>
              {{ errorMessage }}
              <v-btn color="pink" text @click="snackbar = false">
                Close
              </v-btn>
            </v-snackbar>
            <br /><br />
          </v-form>
        </v-layout>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import DirectoryServices from "@/services/DirectoryServices";
export default {
  name: "login",
  metaInfo: {
    title: "Login",
    titleTemplate: "Vellum - %s",
    meta: [
      {
        name: `description`,
        content: `Log in to Vellum here.`
      }
    ],
    htmlAttrs: {
      lang: "en",
      amp: true
    }
  },
  data: () => ({
    valid: true,
    value: true,
    passwordIncorrect: true,
    email: "waynebruton@icloud.com",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    password: "Qwerty1!",
    newPassword: "Qwerty1!",
    newPasswordRepeat: "Qwerty1!",
    checkbox: false,
    emailExists: true,
    snackbar: false,
    errorMessage: "",
    passwordResetToken: null,
    enteredToken: null,
    flex: 12,
    offset: 0
  }),
  mounted() {
    if (this.windowWidth < 768) {
      this.flex = 12;
      this.offset = 0;
    } else {
      this.flex = 6;
      this.offset = 3;
    }
  },
  methods: {
    async login() {
      let user = {
        email: this.email,
        password: this.password
      };
      let response = await DirectoryServices.login(user);
      if (response.data.error) {
        this.errorMessage = response.data.error;
        window.localStorage.clear();
        this.snackbar = true;
        this.password = "";
      } else {
        this.snackbar = false;
        window.localStorage.setItem("token", response.data.token);
        let member = {
          name: response.data.user.username,
          email: response.data.user.email,
          id: response.data.user.id,
          avatar: response.data.user.avatar,
          website: response.data.user.website,
          showEmail: response.data.user.showEmail,
          aboutMember: response.data.user.aboutMember,
          paidMember: response.data.user.paidMember,
          memberExpires: response.data.user.memberExpires,
          isAdmin: response.data.user.isAdmin
        };
        // console.log(member)
        this.$store.dispatch("setUser", member);
        if (this.$store.state.viewArticleIdBeforeLoggedIn !== null) {
          this.$router.push({
            name: "articles",
            query: { id: this.$store.state.viewArticleIdBeforeLoggedIn }
          });
        } else {
          this.$router.push({ name: "home" });
        }
      }
    },
    async resetPasswordToken() {
      let user = {
        email: this.email
      };
      try {
        let response = await DirectoryServices.resetPasswordToken(user);
        this.passwordResetToken = response.data.token;
        this.errorMessage = "An OTP has been sent to you.";
        this.snackbar = true;
        this.clearResetToken();
      } catch (e) {
        this.snackBarMessage = "Error getting articles";
        this.snack = true;
      }
    },
    clearResetToken() {
      setTimeout(() => {
        this.passwordResetToken = null;
      }, 1800000);
    },
    cancelResetPassword() {
      this.passwordResetToken = null;
    },
    async resetPassword() {
      try {
        if (
          this.newPassword === this.newPasswordRepeat &&
          this.passwordResetToken === this.enteredToken
        ) {
          let user = {
            email: this.email,
            password: this.newPassword
          };
          let response = await DirectoryServices.resetPassword(user);
          if (response.data.success) {
            this.errorMessage = "Success.";
            this.passwordResetToken = null;
            this.password = "";
            this.snackbar = true;
          } else {
            this.errorMessage = "Unsuccessful, please try again later.";
            this.snackbar = true;
          }
        } else {
          this.errorMessage = "Passwords or token does not match.";
          this.snackbar = true;
        }
      } catch (e) {
        this.snackBarMessage = "Error getting articles";
        this.snack = true;
      }
    },
    async checkEmail() {
      let email = {
        email: this.email
      };
      try {
        let response = await DirectoryServices.checkEmail(email);
        if (response.data.length === 0) {
          this.emailExists = false;
          this.errorMessage = "Email not on system, Signup?";
          this.snackbar = true;
        } else {
          this.emailExists = true;
        }
      } catch (e) {
        this.snackBarMessage = "Error checking email";
        this.snack = true;
      }
    }
  },
  watch: {}
};
</script>

<style scoped>
p {
  color: red;
  font-size: 80%;
  text-align: left;
}
</style>
