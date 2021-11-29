<template>
  <div class="generalContainer">
    <div class="displayContainer">
      <div id="score">You got {{$route.params.score}} out of {{$route.params.questions}} questions right.</div>
      <div v-for="(answer, i) in $route.params.correctAnswers" :key="i">
        <div v-if="answer">You got question {{i + 1}} right.</div>
        <div v-if="!answer">You got question {{i + 1}} wrong.</div>
      </div>
    </div>
    <div class="interactionContainer">
      <button type="button" @click="restart()">Try Again!</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
      restart: function() {
          this.$router.push({ name: "quiz"})
      }
  }
}
</script>

<style scoped>
.generalContainer {
  font-size: 200%;
  text-align: center;
  padding: 300px;
}
</style>
