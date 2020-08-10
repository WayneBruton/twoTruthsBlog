<template>
  <div class="about temp">
    
    <v-flex
      wrap
      xs12
      md8
      sm8
      lg8
      xl8
      offset-md2 
      offset-xl2
      offset-sm2
      offset-lg2
      justify="center"
    >
      <v-col cols="12" xs="12" sm="12" md="12">
        <v-row justify="center" wrap>
          <h2>Frequently asked questions</h2>
        </v-row>
      </v-col>
    </v-flex>
    <br />
    <v-flex xs12 md8 sm8 lg8 xl8 offset-md2 offset-xl2 offset-sm2 offset-lg2>
      <v-row justify="center">
        <v-expansion-panels popout dark color="grey">
          <v-expansion-panel
            v-for="(item, i) in items"
            :key="i"
            color="grey"
            dark
         
          >
            <v-expansion-panel-header color="indigo" dark class="header">{{
              item.title
            }}</v-expansion-panel-header>
            <v-expansion-panel-content style="background-color: white; color:black;">
              {{ item.explanation }}
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
    </v-flex>
    <br /><br /><br />
  </div>
</template>

<script>
export default {
  name: "faq",
  metaInfo: {
    title: `PerfectStaff - FAQ`,
    meta: [
      {
        name: `description`,
        content: `Staff Policies, remote work, telecommute`
      }
    ]
  },
  data() {
    return {
      items: [
        {
          title: "What is this site all about",
          explanation: `Please see the about page.`
        },
        {
          title: "How do I delete a policy",
          explanation: `Navigate to the policy section on the Policies page, there is a red "trash" icon, click this and follow the prompts.`
        },
        {
          title: "How do I add / remove or edit policy document categories?",
          explanation: `Go to settings. click edit where it says "Edit Staff Types" Here you can add, edit and delete.`
        },
        {
          title: "How do I upload an Employee Document?",
          explanation: `Go to the employees page, click upload, navigate to the file you wish to upload, fill in the fields and click upload.`
        },
        {
          title: "How do I create an Employee?",
          explanation: `Go to the employees page, click add employee, fill in the fields and click add.`
        },
        {
          title: "How do I edit or delete an Employee?",
          explanation: `Go to settings. click edit where it says "Edit Employees" Here you can add, edit and delete.`
        },
        {
          title: "How do I add / remove or Edit employee document types?",
          explanation: `Go to settings. click edit where it says "Edit Document types" Here you can add, edit and delete.`
        },
        {
          title:
            "I have used up my maximum in employee numbers or disk space allowed?",
          explanation: `The system blocks what you have reached a maximum on. If employees, then you cannot add more, similarly with documents (policies or staff documents). 
          You can delete files if that is where the maximum has been reached or in the case of employees / users - delete some there too. Or you can upgrade to a package that suitsyour needs.`
        },
        // {
        //   title: "Where are my confidential documents stored?",
        //   explanation: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        //     eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
        //     ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        //     aliquip ex ea commodo consequat.`
        // },
        {
          title: "Is it safe to pay online?",
          explanation: `Yes, PerfectStaff uses Payfast as a payment gateway.`
        },
        {
          title: "Do I get a discount for an annual payment?",
          explanation: `Our prices are on the pricing page, annual payments are cheaper.`
        },
        {
          title: "Can I set up a recurring payment?",
          explanation: `Yes, when you subscribe to a package you have that option. If you have already signed up but did not choose recurring you will have to manually pay each month. Should you wish to change this then contact us via the contact page.`
        },
        {
          title: "I am an NPO or NGO, do I get a special rate?",
          explanation: `If you are a registered NGO, you can contact us in that regard.`
        }
      ],
    };
  },
  beforeMount() {
  }
};
</script>

<style scoped>
.header {
  font-size: 105%;
}
</style>

