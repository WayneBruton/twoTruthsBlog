<template>
  <div class="about">
    <br /><br />
    <h1>This is an FAQ page</h1>
    <h2>{{ test }}</h2>
  </div>
</template>

<script>
export default {
  name: "faq",
  data() {
    return {
      test: process.env.VUE_APP_TESTWORDS
    };
  },
  mounted() {}
};
</script>
