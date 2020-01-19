<template>
  <q-page class="flex flex-center text-white">
    <note
      v-if="showTooltip"
      class="text-dark"
      title="HOW TO USE"
      :onClose="onTipClose"
    >
      <p>
        Browse what habits are other people developing. by joining a habit, you
        make it a challenge and can compete with them.
      </p>
    </note>
    <h6>Improve your habits with your friends</h6>
    <div class="q-pa-md wrapper">
      <div class="month" v-for="(month, key) in challengesByMonth" :key="key">
        <div class="title-wrapper" >
          <h5>{{month.month}}</h5>
        </div>
        <public-challenge
          v-for="(challenge, key) in month.challenges"
          :options="challenge"
          :key="key"
        />
      </div>
    </div>
  </q-page>
</template>

<style></style>

<script>
import PublicChallenge from 'components/PublicChallenge.vue'
import Note from 'components/Note.vue'
import moment from 'moment-timezone'

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
        const user = (this.$store.state.user.users || []).find(
          user => user.uid === userId
        )
        if (!user) {
          return false
        }
        const tipsClosed = (user && user.tipsClosed) || []
        return !(tipsClosed.indexOf('browse') > -1)
      }
    },
    challenges: {
      get() {
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
          return progress <= 0.6
        })
      },
      set(val) {
        // this.$store.commit('showcase/updateDrawerState', val)
      }
    },
    challengesByMonth: {
      get() {
        let sorted = []
        this.challenges.forEach(challenge => {
          const month = moment(challenge.startDate).format('MMMM')
          let alreadyAdded = false
          sorted = sorted.map(sortedMonth => {
            if (sortedMonth.month === month) {
              alreadyAdded = true
              return {
                ...sortedMonth,
                challenges: [...sortedMonth.challenges, challenge]
              }
            }
            return sortedMonth
          })
          if (!alreadyAdded) {
            sorted.push({
              month: month,
              monthNum: new Date(challenge.startDate).getMonth(),
              challenges: [challenge]
            })
          }
        })
        return sorted.sort((a, b) => a.monthNum < b.monthNum)
      }
    }
  },
  created() {
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
