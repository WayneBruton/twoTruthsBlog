<template>
  <div class="home">
    <MainPage />
  </div>
</template>

<script>
// @ is an alias to /src
// import MainPage from "@/components/MainPage.vue";
// import Chat from "./components/Chat.vue";

export default {
  name: "home",
  components: {
    MainPage: () => import("@/components/MainPage.vue")
    // Chat,
  },
  data() {
    return {};
  }
};
</script>
