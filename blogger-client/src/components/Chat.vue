<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      hide-overlay
      opacity="1"
      height="800"
      width="400"
      max-width="100%"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn :color="iconColor" dark v-bind="attrs" v-on="on" icon text>
          {{ chatIconText }}
          <v-icon :color="iconColor" dark style="margin-right: 15px;">{{
            chatIcon
          }}</v-icon>
        </v-btn>
      </template>

      <v-card height="550" width="500">
        <v-card-title>
          <v-spacer></v-spacer>
          <span class="headline"
            ><h3 style="color: #111d5e;">Chat Box</h3></span
          >
          <v-spacer></v-spacer>
          <v-btn
            color="#111d5e"
            dark
            icon
            text
            @click="dialog = false"
            style="margin-right: 7px;"
          >
            <small>Hide</small>
            <v-icon small>mdi-chat-sleep</v-icon>
          </v-btn>
        </v-card-title>
        <hr />
        <v-card-text>
          <div class="scrollable" id="chatBox" ref="chatBox">
            <ul style="padding-top: 5px;">
              <li v-for="(msg, index) in messages" :key="index" id="chatBox">
                <span v-if="msg.user !== ''"
                  ><small
                    ><strong
                      >{{ msg.user }} <small>to</small> {{ msg.messageTo }}:
                    </strong></small
                  >{{ msg.message }}
                </span>
                <span v-else style="color: brown;">{{ msg.message }} </span>
              </li>
            </ul>
          </div>
          <span style="color: orange;"
            ><em>{{ typing }}</em></span
          >
          <br />
          <hr />
          <form @submit.prevent="sendMessage">
            <v-row>
              <v-col cols="10" xs="10" sm="10" md="10">
                <v-autocomplete
                  ref="recipient"
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
              <v-col cols="2" xs="2" sm="2" md="2">
                <v-btn icon @click="newUser">
                  <v-icon color="green" small>mdi-refresh</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-col cols="12" xs="12" sm="12" md="12">
              <v-text-field
                label="message"
                outlined
                filled
                v-model="message"
                class="form-control"
                @keydown="recipient($event)"
              ></v-text-field>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="12">
              <v-switch
                v-model="playSound"
                color="#111d5e"
                class="ma-2"
                :label="playSound ? 'Sound On' : 'Sound Off'"
              ></v-switch>
            </v-col>
            <div class="mobileButtons">
              <!-- <v-spacer v-if="windowWidth > 768"></v-spacer> -->
              <v-spacer></v-spacer>
              <v-btn text icon @click="exitChat">
                Exit
                <v-icon color="red">mdi-chat-remove</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn type="submit" text class="btn btn-success" icon>
                Send
                <v-icon color="green">mdi-send</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
            </div>
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
      snackBarMessage: "You have received a new 'Chat' message",
      expand: true,
      windowWidth: window.innerWidth,
      chatIcon: "mdi-chat",
      chatIconText: "Chat",
      // iconColor: "black",
      iconColor: "white",
      // iconColor: "#111d5e",
      snackbar: false,
      timeOut: 3000,
      dialog: false,
      typing: "",
      user: "",
      message: "",
      playSound: true,
      messageTo: "",
      items: ["Hazel Cox", "Joe Soap", "Wayne Bruton"],
      messages: [],
      socket: io("localhost:3000"),
      messageReceived: 0
    };
  },
  watch: {
    dialog: function() {
      if (this.dialog) {
        // console.log("WE ARE ON");
        this.chatIcon = "mdi-chat-sleep";
        this.chatIconText = "Hide";
        this.newUser();
        this.$store.dispatch("chatMessageClose");
      } else {
        // console.log("WE ARE OFF@@@");
        this.chatIcon = "mdi-chat";
        this.chatIconText = "Chat";
        // this.playSound = true;
      }
      if (this.windowWidth < 768) {
        this.iconColor = "#111d5e";
      } else {
        this.iconColor = "white";
      }
      // else {
      //   this.iconColor = "white";
      // }
    }
  },
  methods: {
    recipient(event) {
      if (this.messageTo === "") {
        this.snackBarMessage = "Recipient cannot be blank";
        this.snackbar = true;
        this.message = "";
      } else if (event.which != 13) {
        this.socket.emit("typing", {
          user: this.user,
          messageTo: this.messageTo,
          typing: true
        });
      }
    },
    sendMessage(e) {
      e.preventDefault();
      if (this.message !== "") {
        this.socket.emit("SEND_MESSAGE", {
          user: this.user,
          message: this.message,
          messageTo: this.messageTo
        });
        this.message = "";
      }
    },

    //LOGIN AS USER HERE
    newUser() {
      this.socket.emit("NEW_USER", {
        user: this.user
      });
    },
    async exitChat() {
      await this.socket.emit("EXIT", {
        user: this.user
      });
      this.messages.length = 0;
      this.dialog = false;
    }
  },
  mounted() {
    if (this.windowWidth < 768) {
      this.iconColor = "#111d5e";
    }
    this.user = this.$store.state.userName;
    this.newUser();
    this.socket.on("MESSAGE", data => {
      if (data.messageTo === this.user) {
        this.messageTo = data.user;
      } else {
        this.messageTo = data.messageTo;
      }
      this.typing = "";
      if (data.message === `User has left the chat`) {
        this.socket.on("USERS", data => {
          setTimeout(() => {
            this.$nextTick(() => {
              this.items = data
                .filter(el => {
                  return el !== this.user && el !== this.messageTo;
                })
                .sort();

              // console.log("USERS", this.items);
            });
          }, 0);
        });
        setTimeout(() => {
          this.$nextTick(() => {
            this.messageTo = "";
          });
        }, 0);
        data.message = `${data.messageTo} has left the chat`;
        data.user = "";
        data.messageTo = "";
      }
      this.messages = [...this.messages, data];
      if (!this.dialog) {
        // (this.snackBarMessage = "You have received a new 'Chat' message"),
        //   this.messageReceived++;
        // this.iconColor = "#FF0000";
        // this.snackbar = true;
        let info = {
          chatMessage: `"${data.message}" - from: ${data.user}`
        };
        this.$store.dispatch("chatMessageReceived", info);
      }
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
    this.socket.on("USERS", data => {
      this.items = data
        .filter(el => {
          return el !== this.user;
        })
        .sort();
      // console.log("USERS", this.items);
    });
    this.socket.on("display", data => {
      if (data.typing == true) {
        this.typing = `${data.user} is typing...`;
      } else {
        this.typing = "";
      }
      setTimeout(() => {
        this.typing = "";
      }, 3000);
    });
  },
  beforeDestroy() {
    this.exitChat();
  }
};
</script>

<style>
ul {
  list-style: none;
  text-align: left;
  /* background-color: rgba(260, 270, 220, 1); */
}
.v-dialog {
  position: absolute;
  /* top: 1;
  right: 0; */
}
.scrollable {
  height: 100px;
  overflow-y: scroll;
  margin-bottom: 10px;
}
.mobileButtons {
  display: flex;
  justify-content: space-between;
}
@media only screen and (max-width: 768px) {
  /* .v-dialog {
    top: 20;
    right: 0;
  } */
  /* .mobileButtons {
    flex-direction: column;
  } */
}
</style>
