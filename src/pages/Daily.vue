<template>
  <q-page class="flex flex-center">
    <div v-if="challenges.length === 0">
      You don't have any challenges yet. Quick start one by clicking the plus button
    </div>
    <div class="q-pa-md wrapper">
      <challenge-daily v-for="(challenge, key) in challenges" :options="challenge" :key="key"/>
    </div>
    <!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg"> -->
    <div class="add-button">
      <router-link to="/create">
        <q-btn  size="xl" round color="amber" glossy text-color="black" icon="plus_one" />
      </router-link>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import ChallengeDaily from 'components/ChallengeDaily.vue'
export default {
  name: 'PageIndex',
  components: {
    ChallengeDaily
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
    this.$store.dispatch('app/fetchChallenges')
    this.$store.dispatch('user/fetchUsers')
  }
}
</script>

<style>
.add-button {
  position: absolute;
  bottom: 50px;
  right: 50px;
}

.wrapper {
  width: 100%;
}
</style>