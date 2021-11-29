<template>
  <div class="generalContainer">
    <div class="displayContainer">
      <h1>Financial Accounting Quiz.</h1>
    </div>
    <div class="interactionContainer">
      <button type="button" @click="begin()">Begin Quiz!</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
      begin: function() {
          this.$router.push({ name: "quiz"})
      }
  }
}
</script>

<style scoped>
.generalContainer {
  text-align: center;
  padding: 300px;
}
</style>
