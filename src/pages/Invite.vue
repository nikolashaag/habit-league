<template>
  <q-page>
    <h5 class="text-center" v-if="challenge">
      You have been invited to this challenge. Press "Join" to add this to your habits.
    </h5>
    <h5 class="text-center" v-if="!challenge">
      Sorry, the challenge has expired or has been deleted. :(
    </h5>
    <div class="q-pa-md wrapper" v-if="challenge">
      <public-challenge :options="challenge" :key="key"/>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import PublicChallenge from 'components/PublicChallenge.vue'
export default {
  name: 'InvitePage',
  components: {
    PublicChallenge
  },
  computed: {
    challengeId: {
      get () {
        return this.$route.query.challengeId
      }
    },
    challenge: {
      get () {
        return this.$store.state.app.challenges.find(chal => chal.id === this.challengeId)
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
