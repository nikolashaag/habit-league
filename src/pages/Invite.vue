<template>
  <q-page class="text-white">
    <h5 class="text-center" v-if="challenge">
      You have been invited to this challenge. Press "Join" to add this to your habits.
    </h5>
    <h5 class="text-center" v-if="!challenge && !isInMyChallenges">
      Sorry, the challenge has expired or has been deleted. :(
    </h5>
    <h5 class="text-center" v-if="isInMyChallenges">
      You already joined the Challenge
    </h5>
    <div class="q-pa-md wrapper" v-if="challenge">
      <public-challenge :options="challenge" :key="key" :redirect="true" />
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
        console.log('this.$route.query.challengeId', this.$route.query.challengeId)
        return this.$route.query.challengeId
      }
    },
    challenge: {
      get () {
        console.log()
        return this.$store.state.app.challenges.find(chal => chal.id === this.challengeId)
      }
    },
    isInMyChallenges: {
      get () {
        console.log()
        return this.$store.state.app.myChallenges.find(chal => chal.id === this.challengeId)
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
