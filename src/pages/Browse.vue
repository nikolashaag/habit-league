<template>
  <q-page class="flex flex-center">
    <h5>
      Browse public challenges and join other people in their habits.
    </h5>
    <div class="q-pa-md wrapper">
      <public-challenge v-for="(challenge, key) in challenges" :options="challenge" :key="key"/>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import PublicChallenge from 'components/PublicChallenge.vue'
export default {
  name: 'PageIndex',
  components: {
    PublicChallenge
  },
  computed: {
    challenges: {
      get () {
        return this.$store.state.app.challenges
      },
      set (val) {
        // this.$store.commit('showcase/updateDrawerState', val)
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
.wrapper {
  width: 100%;
}
</style>
