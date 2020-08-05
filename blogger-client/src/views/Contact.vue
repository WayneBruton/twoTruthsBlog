<template>
  <div class="about">
    <br /><br />
    <h1>This is a contact page</h1>
    <h2>{{ test }}</h2>
  </div>
</template>

<script>
export default {
  name: "contact",
  data() {
    return {
      test: process.env.VUE_APP_TESTWORDS
    };
  },
  mounted() {}
};
</script>
