<template>
  <q-page class="flex flex-center text-white">
    <note v-if="showTooltip" title="HOW TO USE" :onClose="onTipClose">
      <p>
        Browse what habits are other people developing. by joining a habit, you make it a challenge and can compete with them.
      </p>
    </note>
    <h5>
      Public challenges
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
import Note from 'components/Note.vue'

export default {
  name: 'Browse',
  components: {
    PublicChallenge,
    Note
  },
  computed: {
    showTooltip: {
      get() {
        const userId = this.$store.state.user.currentUser.uid
        const user = (this.$store.state.user.users || []).find(user => user.uid === userId)
        if (!user) {
          return false
        }
        const tipsClosed = (user && user.tipsClosed) || []
        return !(tipsClosed.indexOf('browse') > -1)
      }
    },
    challenges: {
      get () {
        return (this.$store.state.app.challenges || []).filter(challenge => {
          let dt1 = new Date(challenge.startDate)
          let dt2 = new Date()
          let diff = Math.floor(
            (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
              Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
              (1000 * 60 * 60 * 24)
          )
          // If diff is 0, set to 1 (In case the challenge started today)
          diff = diff || 1
          const progress = diff / (challenge.duration / 100) / 100
          return progress <= 0.3
        })
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
  },
  methods: {
    onTipClose() {
      this.$store.dispatch('user/closeTip', {
        userId: this.$store.state.user.currentUser.uid,
        tip: 'browse'
      })
    }
  }
}
</script>

<style scoped>
.wrapper {
  width: 100%;
  margin-bottom: 32px;
}
</style>
