<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      hide-overlay
      opacity="1"
      height="800"
      width="400"
      persistent
      max-width="100%"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on" icon text>
          <v-icon>mdi-chat</v-icon> Chat
        </v-btn>
      </template>

      <v-card height="650" width="500">
        <v-card-title>
          <v-spacer></v-spacer>
          <span class="headline"><h3>Chat Box</h3></span>
          <v-spacer></v-spacer>
        </v-card-title>
        <hr />
        <v-card-text>
          <div class="scrollable" id="chatBox" ref="chatBox">
            <ul style="padding-top: 5px;">
              <li v-for="(msg, index) in messages" :key="index" id="chatBox">
                <span
                  ><strong
                    >{{ msg.user }} <small>to</small> {{ msg.messageTo }}:
                  </strong></span
                >{{ msg.message }}
              </li>
            </ul>
          </div>
          <br />
          <hr />
          <form @submit.prevent="sendMessage">
            <v-col cols="12" xs="12" sm="12" md="12">
              <v-text-field
                label="User:"
                v-model="user"
                class="form-control"
              ></v-text-field>
            </v-col>
            <!-- <v-col cols="12" xs="12" sm="12" md="12">
              <v-text-field
                label="To:"
                v-model="messageTo"
                class="form-control"
              ></v-text-field>
            </v-col> -->
            <v-col cols="12" xs="12" sm="12" md="12">
              <v-autocomplete
                v-model="messageTo"
                :items="items"
                hide-no-data
                hide-selected
                item-text="Message To"
                label="Message To"
                placeholder="Start typing to get recipient"
                prepend-icon="mdi-database-search"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="12">
              <v-text-field
                label="message"
                outlined
                filled
                v-model="message"
                class="form-control"
              ></v-text-field>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="12">
              <v-switch
                v-model="playSound"
                class="ma-2"
                :label="playSound ? 'Sound On' : 'Sound Off'"
              ></v-switch>
            </v-col>
            <div style="display: flex; justify-content: space-between;">
              <v-spacer></v-spacer>
              <v-btn text icon @click="exitChat">
                Exit Chat
                <v-icon color="orange">mdi-chat-remove</v-icon>
              </v-btn>
              <v-spacer></v-spacer>

              <!-- <v-spacer></v-spacer> -->
              <v-btn type="submit" text class="btn btn-success" icon>
                Send
                <v-icon color="green">mdi-send</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
            </div>
            <!-- </v-col> -->
            <!-- <button class="btn btn-success">Send</button> -->
          </form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :timeout="timeOut" bottom top>
      {{ snackBarMessage }}
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-row>
</template>

<script>
import io from "socket.io-client";
export default {
  name: "chat",
  data() {
    return {
      snackBarMessage: "You have received a new message",
      snackbar: false,
      timeOut: 3000,
      dialog: false,
      user: "",
      message: "",
      playSound: false,
      messageTo: ["Wayne Bruton"],
      items: ["Hazel Cox", "Joe Soap", "Wayne Bruton"],
      messages: [],
      socket: io("localhost:3000"),
    };
  },
  watch: {
    dialog: function() {
      if (this.dialog) {
        console.log("WE ARE ON");
        this.newUser();
      } else {
        console.log("WE ARE OFF@@@");
        // this.playSound = true;
      }
    },
  },
  methods: {
    sendMessage(e) {
      e.preventDefault();

      this.socket.emit("SEND_MESSAGE", {
        user: this.user,
        message: this.message,
        messageTo: this.messageTo,
      });
      this.message = "";
    },

    //LOGIN AS USER HERE
    newUser() {
      this.socket.emit("NEW_USER", {
        user: this.user,
      });
    },
    async exitChat() {
      await this.socket.emit("EXIT", {
        user: this.user,
      });
      this.messages.length = 0;
      this.dialog = false;
    },
  },
  mounted() {
    this.user = this.$store.state.userName;
    if (this.user === "Wayne Bruton") {
      this.messageTo = "Hazel Cox";
    } else {
      this.messageTo = "Wayne Bruton";
    }
    this.newUser();
    this.socket.on("MESSAGE", (data) => {
      //   console.log("THIS IS THE DATA", data);
      if (data.message === `User has left the chat`) {
        data.message = `${data.messageTo} has left the chat`;
        data.user = "";
        data.messageTo = "";
      }
      this.messages = [...this.messages, data];
      if (!this.dialog) {
        this.snackbar = true;
      }
      //   console.log("THESE ARE MESSAGES", this.messages);
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight;
        });
      }, 0);

      var audio = new Audio(require("../assets/clearly.mp3"));
      if (this.playSound) {
        audio.play();
      }
    });
  },
  beforeDestroy() {
    this.exitChat();
  },
};
</script>

<style>
ul {
  list-style: none;
  text-align: left;
  /* background-color: red; */
}
.v-dialog {
  position: absolute;

  top: 1;
  right: 0;
}
.scrollable {
  height: 100px;
  overflow-y: scroll;
  margin-bottom: 10px;
}
@media only screen and (max-width: 768px) {
  .v-dialog {
    margin-left: 10px;
    padding-left: 5px;
  }
}
</style>
