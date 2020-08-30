<template>
  <div>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        hide-overlay
        persistent
        opacity="1"
        width="700"
        max-width="100%"
      >
        <v-card max-width="700">
          <div style="display: flex; justify-content: center;" elevation="1">
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
              ><u><h3 style="color: #111d5e;">Subscribe</h3></u></span
            >
            <v-spacer></v-spacer>
          </v-card-title>
          <br />
          <v-card-subtitle
            ><h3>
              You have seen all your allocated free articles for the month.
            </h3></v-card-subtitle
          >
          <v-card-subtitle
            ><h3>Subscribe to continue reading..</h3></v-card-subtitle
          >
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
            <!-- <v-row> -->
            <!-- <v-col cols="6" xs="12" sm="12" md="6">
                <v-text-field v-model="name" width="6"></v-text-field> -->
            <!-- <v-text-field v-model="name_last" width="6"></v-text-field> -->
            <!-- </v-col> -->
            <!-- <v-col cols="6" xs="12" sm="12" md="6">
                <v-text-field v-model="email_address" width="6"></v-text-field>
                <v-text-field v-model="cell_number" width="6"></v-text-field>
              </v-col> -->
            <!-- </v-row> -->
            <!-- <v-col cols="6" xs="12" sm="12" md="6">
            </v-col> -->
            <v-col cols="12" xs="12" sm="12" md="12">
              <v-checkbox
                @change="checkURL"
                v-model="checked"
                label="I agree to the terms & conditions"
              ></v-checkbox>
            </v-col>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn width="210" height="55" @click="close">
              <v-icon color="red" style=" margin-right: 15px;"
                >mdi-close-circle</v-icon
              >

              Later
            </v-btn>
            <v-spacer v-if="checked"></v-spacer>
            <!-- onsubmit="return click_e366542f9a021795321c47a3a1d1d2f0( this );" -->
            <form
              v-if="checked"
              action="https://www.payfast.co.za/eng/process"
              name="form_e366542f9a021795321c47a3a1d1d2f0"
              method="post"
            >
              <input type="hidden" name="cmd" value="_paynow" />
              <input type="hidden" name="receiver" value="10469596" />
              <input type="hidden" name="item_name" :value="item_name" />
              <input type="hidden" name="amount" :value="amount" />
              <input
                type="hidden"
                name="item_description"
                :value="item_description"
              />
              <input type="hidden" name="return_url" :value="return_url" />
              <input type="hidden" name="cancel_url" :value="cancel_url" />
              <input type="hidden" name="cycles" value="0" />
              <input type="hidden" name="frequency" value="3" />
              <input
                type="hidden"
                name="m_payment_id"
                value="pay_now_10469596"
              />
              <input type="hidden" name="subscription_type" value="1" />
              <input type="hidden" name="recurring_amount" :value="amount" />

              <table>
                <tr>
                  <td colspan="2" align="center">
                    <input
                      type="image"
                      src="https://www.payfast.co.za/images/buttons/light-large-subscribe.png"
                      width="210"
                      height="59"
                      alt="Subscribe Now"
                      title="Subscribe Now with PayFast"
                    />
                  </td>
                </tr>
              </table>
            </form>
            <v-spacer></v-spacer>
          </v-card-actions>
          <br />
        </v-card>
      </v-dialog>
    </v-row>
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
  data() {
    return {
      dialog: true,
      src: require("../assets/Logo.png"),
      checked: false,
      snackbar: false,
      snackBarMessage: "",
      timeOut: 2000,

      return_url: process.env.VUE_APP_RETURN_URL,
      cancel_url: process.env.VUE_APP_CANCEL_URL,
      notify_url: process.env.VUE_APP_NOTIFY_URL,

      // name_first: "",
      // name: "",
      // email_address: "",
      // cell_number: "",
      // m_payment_id: "01AZ", //UNIQUIE ID I CHOOSE
      amount: "100.00",
      item_name: "Vellum Subscription",
      item_description: "A test product"
    };
  },
  mounted() {
    // this.billing_date = moment(new Date()).format("YYYY-MM-DD");
    // console.log(this.billing_date);
    // let credentials = {
    //   id: this.$store.state.userId,
    // };
    // let response = await DirectoryService.memberDetails(credentials);
    // console.log(response.data[0])
    // // let name = response.data[0].name.split(" ");
    // this.name = response.data[0].name;
    // // this.name_last = name[1];
    // this.email_address = response.data[0].email;
    // this.cell_number = `0${response.data[0].mobile.substring(3)}`;
  },
  methods: {
    async checkURL() {
      if (this.checked) {
        let today = moment(new Date()).format("YYYY-MM-DD");
        let credentials = {
          variable1: today,
          variable2: this.$store.state.userId
        };
        try {
          let response = await DirectoryService.getPaidURL(credentials);
          // console.log(response.data.url);
          this.return_url = `${process.env.VUE_APP_RETURN_URL}?ref=${response.data.url}`;
          // console.log(this.return_url);
        } catch (error) {
          this.checked = !this.checked;
        }
      }
    },
    // processSignature() {
    //   if (this.checked) {
    //     if (
    //       this.name_first === "" ||
    //       this.name_last === "" ||
    //       this.email_address === "" ||
    //       this.cell_number === ""
    //     ) {
    //       this.snackBarMessage = "All fields must be completed";
    //       this.snackbar = true;
    //       this.checked = !this.checked;
    //     }
    //   }
    // },
    close() {
      this.dialog = false;
      this.$store.dispatch("resetSubscribe");
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
