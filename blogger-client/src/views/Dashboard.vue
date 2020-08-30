<template>
  <div>
    <br />
    <v-card class="mx-auto" max-width="1000" elevation="1">
      <!-- <v-layout fluid style="display:flex; flex-direction:column;"> -->

      <!-- </v-layout> -->
      <v-card-title
        ><v-spacer><h1>THIS IS THE DASHBOARD</h1></v-spacer></v-card-title
      >
      <br />
      <v-card-text>
        <v-btn text @click="getAdmin">Change Admin User</v-btn>
      </v-card-text>
      <v-card-text>
        <v-btn text @click="getFaq">Edit FAQ</v-btn>
      </v-card-text>
      <v-card-text>
        <v-btn text @click="getFreeUsage">EDIT FREE USAGE</v-btn>
      </v-card-text>
    </v-card>

    <v-row justify="center">
      <v-dialog v-model="adminDialog" persistent max-width="1000">
        <v-card>
          <v-card-title class="headline">Add Administrators</v-card-title>
          <v-list>
            <v-list-item v-for="item in users" :key="item.id">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
              <v-spacer></v-spacer>

              <v-btn
                :id="item.id"
                text
                icon
                v-if="item.isAdmin"
                @click="updateAdmin($event)"
                ><v-icon color="red">mdi-file-cancel</v-icon>Remove
                {{ item.isAdmin }}</v-btn
              >
              <v-btn
                :id="item.id"
                text
                icon
                v-if="!item.isAdmin"
                @click="updateAdmin($event)"
                ><v-icon color="green">mdi-account-reactivate</v-icon>Add
                {{ item.isAdmin }}</v-btn
              >
              <v-spacer></v-spacer>
            </v-list-item>
          </v-list>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="adminDialog = false"
              >close</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row justify="center">
      <v-dialog v-model="allowedDialog" persistent max-width="1000">
        <v-card>
          <v-card-title class="headline">Add Administrators</v-card-title>
          <v-card-text>
            <v-text-field
              type="number"
              step="10"
              v-model="allowedUsage"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="allowedDialog = false"
              >Close</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="updateAllowed"
              >Update</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row justify="center">
      <v-dialog v-model="faqDialog" persistent max-width="1000">
        <v-card>
          <v-card-title class="headline"
            >FAQ
            <!-- <small
              >Currently can only add & delete. Editing is next in line (Give me
              time). If you want to simply edit a post. Copy content then delete
              post and add new post. Then paste and edit accordingly before
              posting. Posts are sorted alphabetically.</small
            > -->
          </v-card-title>
          <v-row justify="center">
            <v-btn text icon color="green" @click="addFaqDialog = true"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
            <br /><br />
            <v-expansion-panels popout dark color="grey">
              <v-expansion-panel
                color="grey"
                dark
                :id="item.id"
                v-for="item in faqs"
                :key="item.id"
              >
                <v-expansion-panel-header color="#111d5e" dark class="header">{{
                  item.question
                }}</v-expansion-panel-header>
                <v-expansion-panel-content
                  style="background-color: white; color:black; padding-left: 15px;"
                >
                  <div style="display: flex; flex-direction: column;">
                    {{ item.answer }}
                  </div>
                  <br />
                  <v-spacer></v-spacer>
                  <div style="display: flex; justify-content: space-around;">
                    <v-btn
                      :id="item.id"
                      color="green"
                      icon
                      @click="editFaq($event)"
                      ><v-icon>mdi-plus-minus</v-icon></v-btn
                    >
                    <v-btn
                      :id="item.id"
                      color="red"
                      icon
                      @click="deleteFaq($event)"
                      ><v-icon>mdi-delete</v-icon></v-btn
                    >
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="faqDialog = false"
              >close</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row justify="center">
      <v-dialog v-model="addFaqDialog" persistent max-width="1000">
        <v-card>
          <v-card-title class="headline">Add FAQ</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="question"
              placeholder="Add Question here"
            ></v-text-field>
            <v-textarea
              v-model="answer"
              placeholder="Add answer here."
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="addFaqDialog = false"
              >Close</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="addFAQ">Post</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row justify="center">
      <v-dialog v-model="editFaqDialog" persistent max-width="1000">
        <v-card>
          <v-card-title class="headline">Edit FAQ</v-card-title>
          <v-card-text>
            <v-text-field v-model="question"></v-text-field>
            <v-textarea v-model="answer"></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="editFaqDialog = false"
              >Close</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn
              :id="editId"
              color="green darken-1"
              text
              @click="postEditFAQ($event)"
              >Post</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import DirectoryService from "../services/DirectoryServices";
// import DirectoryService from "../services/DirectoryServices"
export default {
  name: "dashboard",
  data() {
    return {
      adminDialog: false,
      allowedDialog: false,
      faqDialog: false,
      addFaqDialog: false,
      editFaqDialog: false,
      editId: 0,
      allowedUsage: 100,
      question: "",
      answer: "",
      users: [],
      faqs: []
    };
  },
  mounted() {
    // console.log(this.$route.name);
  },
  methods: {
    async getAdmin() {
      try {
        this.users = [];
        let response = await DirectoryService.getAdmin();
        response.data.forEach(el => {
          let data = {
            id: el.id,
            name: el.name,
            isAdmin: el.isAdmin
          };
          this.users.push(data);
        });
        this.users = this.users.filter(el => {
          return el.id !== this.$store.state.userId;
        });
        this.adminDialog = true;
      } catch (e) {
        this.snackBarMessage = "Error getting Admin";
        this.snack = true;
      }
    },
    async updateAdmin(event) {
      let targetID = parseInt(event.currentTarget.id);
      // console.log(targetID);
      let updateArray = this.users.filter(el => {
        return el.id === targetID;
      });
      let isAdmin = parseInt(updateArray[0].isAdmin);
      if (isAdmin === 1) {
        isAdmin = 0;
      } else {
        isAdmin = 1;
      }
      let credentials = {
        isAdmin: isAdmin,
        id: targetID
      };
      try {
        await DirectoryService.updateAdmin(credentials);
      } catch (e) {
        this.snackBarMessage = "Error Updating Admin";
        this.snack = true;
      } finally {
        this.getAdmin();
      }
    },
    async updateAllowed() {
      let credentials = {
        allowedViews: this.allowedUsage
      };
      try {
        await DirectoryService.allowedViewsNonSubscriber(credentials);
      } catch (e) {
        this.snackBarMessage = "Error getting articles";
        this.snack = true;
      } finally {
        this.allowedDialog = false;
      }
    },
    async getFreeUsage() {
      try {
        let response = await DirectoryService.getallowedViewsNonSubscriber();
        this.allowedUsage = parseInt(response.data[0].allowedViews);
        this.allowedDialog = true;
      } catch (e) {
        this.snackBarMessage = "Error getting articles";
        this.snack = true;
      }
    },
    async getFaq() {
      this.faqs = [];
      let response = await DirectoryService.getFAQ();
      this.faqs = response.data;
      // console.log(this.faqs);
      this.faqDialog = true;
    },
    async addFAQ() {
      let credentials = {
        question: this.question,
        answer: this.answer
      };
      await DirectoryService.addFAQ(credentials);
      this.getFaq();
      this.addFaqDialog = false;
    },
    editFaq(event) {
      let targetID = parseInt(event.currentTarget.id);
      // console.log(targetID);
      let filtered = this.faqs.filter(el => {
        return el.id === targetID;
      });
      // console.log(filtered)
      this.question = filtered[0].question;
      this.answer = filtered[0].answer;
      this.editId = targetID;
      this.editFaqDialog = true;
    },
    async deleteFaq(event) {
      let targetID = parseInt(event.currentTarget.id);
      // console.log(targetID);
      let credentials = {
        id: targetID
      };
      await DirectoryService.deleteFAQ(credentials);
      // this.faqs = []
      this.getFaq();
    },
    async postEditFAQ(event) {
      let targetID = parseInt(event.currentTarget.id);
      // console.log(targetID)
      let credentials = {
        id: targetID,
        question: this.question,
        answer: this.answer
      };
      await DirectoryService.editFAQ(credentials);
      this.editFaqDialog = false;
      this.getFaq();
    }
  }
};
</script>

<style scoped></style>
