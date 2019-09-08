<template>
  <q-page class="flex flex-center">
    <div>
      Browse public challenges and join other people in their habits.
    </div>
    <div class="q-pa-md wrapper">
      <public-challenge v-for="(challenge, key) in challenges" :options="challenge" :key="key"/>
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
.add-button {
  position: fixed;
  bottom: 50px;
  right: 50px;
}

.wrapper {
  width: 100%;
}
</style>
