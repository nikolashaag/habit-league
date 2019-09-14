<template>
  <q-page class="flex flex-center">
    <h5 v-if="challenges.length === 0">
      You don't have any challenges yet. Quick start one by clicking the plus button
    </h5>
    <h5 v-if="challenges.length > 0">
      Weekly Overview
    </h5>
    <div class="q-pa-md wrapper">
      <challenge v-for="(challenge, key) in challenges" :options="challenge" :key="key"/>
    </div>
    <add-button />
  </q-page>
</template>

<style>
</style>

<script>
import Challenge from 'components/Challenge.vue'
import AddButton from 'components/AddButton.vue'

export default {
  name: 'PageIndex',
  components: {
    Challenge,
    AddButton
  },
  computed: {
    challenges: {
      get () {
        return this.$store.state.app.myChallenges
      }
    }
  },
  created () {
    if (!this.$store.state.app.syncStatus) {
      this.$store.dispatch('app/fetchChallenges')
      this.$store.dispatch('user/fetchUsers')
    }
  }
}
</script>

<style>
.add-button {
  position: fixed;
  bottom: 50px;
  right: 50px;
}

.wrapper {
  width: 100%;
}
</style>
