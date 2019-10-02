<template>
  <q-page class="flex flex-center daily q-pa-md wrapper">
    <note v-if="showTooltip" title="HOW TO USE" :onClose="onTipClose">
      <p>
        To complete a habit, swipe it to the right (for
        <i>complete</i>),to the left (for
        <i>skip</i>) or tick the checkbox.
      </p>
    </note>
    <div class="title-wrapper" v-if="challenges.length > 0">
      <h5>Daily view</h5>
    </div>
    <div class="progress-wrapper row flex flex-center">
      <q-knob
        show-value
        readonly
        font-size="24px"
        v-model="progress"
        size="150px"
        :thickness="0.22"
        color="teal"
        track-color="grey-3"
        class="q-ma-md"
      >{{ progress }}%</q-knob>
    </div>
    <h5
      v-if="challenges.length === 0 && completedToday.length === 0"
    >You don't have any challenges yet. Quick start one by clicking the plus button</h5>
    <spinner v-if="isLoading" />
    <div class="wrapper" v-if="!isLoading">
      <q-list class="list" bordered separator v-if="challenges.length !== 0">
        <q-slide-item
          ref="item"
          class="item-wrapper"
          @left="native => onLeft(native, challenge)"
          @right="native => onRight(native, challenge)"
          v-for="(challenge) in challenges"
          :key="challenge.id"
        >
          <template v-slot:left>
            <q-icon name="done" />Complete for today
          </template>
          <template v-slot:right>
            <div class="row items-center">
              Skip for today
              <q-icon right name="alarm" />
            </div>
          </template>

          <q-item>
            <challenge-daily :options="challenge" :onComplete="onComplete" />
          </q-item>
        </q-slide-item>
      </q-list>

      <h5 class="completed" v-if="completedToday.length > 0">Completed:</h5>
      <challenge-daily-completed
        :options="challenge"
        :onComplete="onComplete"
        v-for="(challenge) in completedToday"
        :key="challenge.id + 'completed'"
      />
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import ChallengeDaily from 'components/ChallengeDaily.vue'
import Note from 'components/Note.vue'
import ChallengeDailyCompleted from 'components/ChallengeDailyCompleted.vue'
import { date } from 'quasar'
import Spinner from 'components/Spinner.vue'

export default {
  name: 'PageIndex',
  components: {
    ChallengeDaily,
    ChallengeDailyCompleted,
    Spinner,
    Note
  },
  data() {
    return {
      progress: 0,
      isLoading: true
    }
  },
  watch: {
    challenges: function() {
      this.updateProgress()
    }
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
        return !(tipsClosed.indexOf('daily') > -1)
      }
    },
    challenges: {
      get() {
        return (
          this.$store.state.app.myChallenges
            // Filter for not yet logged
            .filter(chal => {
              const loggedDays = chal.loggedDays || []
              return !loggedDays
                .filter(
                  day => day.user === this.$store.state.user.currentUser.uid
                )
                .find(
                  day =>
                    date.formatDate(day.date, 'YYYY/MM/DD') ===
                      date.formatDate(new Date(), 'YYYY/MM/DD')
                )
            })
            // Filter out challenges which haven't started yet
            .filter(chal => {
              const startDate = new Date(chal.startDate)
              const today = new Date()
              return (
                startDate.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0)
              )
            })
            // Filter out weekly challenges already complete
            .filter(chal => {
              if (chal.frequency === 'per-week') {
                const loggedDays = chal.loggedDays || []
                const loggedComplete = loggedDays
                  .filter(day => day.status === 'complete')
                  .filter(log => {
                    const getMonday = d => {
                      d = new Date(d)
                      const day = d.getDay()
                      const diff = d.getDate() - day + (day === 0 ? -6 : 1)
                      return new Date(d.setDate(diff))
                    }
                    return (
                      new Date(log.date).setHours(0, 0, 0, 0) >=
                      getMonday(log.date).setHours(0, 0, 0, 0)
                    )
                  })
                return loggedComplete.length < chal.perWeek
              }
              return true
            })
            // Filter out specific days
            .filter(challenge => {
              if (challenge.frequency === 'specific') {
                const todayFullName = new Date()
                  .toLocaleDateString('en-us', {
                    weekday: 'long'
                  })
                  .toLowerCase()
                return challenge.specificDays.includes(todayFullName)
              }

              return true
            })
            // Filter out per month
            .filter(challenge => {
              if (challenge.frequency === 'per-month') {
                const currentMonth = new Date().getMonth() + 1
                const completedDaysInCurrentMonth =
                  challenge.loggedDays &&
                  challenge.loggedDays.filter(
                    log =>
                      log.status === 'complete' &&
                      parseInt(log.date.slice(5, 7), 10) === currentMonth
                  ).length
                return challenge.perMonth > completedDaysInCurrentMonth
              }
              return true
            })
        )
      }
    },
    completedToday: {
      get() {
        return this.$store.state.app.myChallenges.filter(chal => {
          const loggedDays = chal.loggedDays || []
          return loggedDays
            .filter(day => day.user === this.$store.state.user.currentUser.uid)
            .find(
              day =>
                date.formatDate(day.date, 'YYYY/MM/DD') ===
                  date.formatDate(new Date(), 'YYYY/MM/DD')
            )
        })
      }
    }
  },
  methods: {
    onTipClose() {
      this.$store.dispatch('user/closeTip', {
        userId: this.$store.state.user.currentUser.uid,
        tip: 'daily'
      })
    },
    updateProgress() {
      const faktor =
        (parseInt(this.completedToday.length, 10) +
          parseInt(this.challenges.length, 10)) /
        100
      this.progress = Math.round(this.completedToday.length / faktor) || 0
    },
    onLeft({ reset }, challenge) {
      this.$q.notify('Congrats! You completed your daily habit')
      this.finalize(reset, challenge.id, 'complete')
    },
    onRight({ reset }, challenge) {
      this.$q.notify("Skipped for today! Don't forget about it tomorrow")
      this.finalize(reset, challenge.id, 'skip')
    },
    finalize(reset, challengeId, status) {
      this.timer = setTimeout(() => {
        this.log(status, challengeId)
      }, 1000)
    },
    onComplete(challengeId) {
      this.secondTimer = setTimeout(() => {
        this.log('complete', challengeId)
      }, 1000)
    },
    log: function(status, challengeId) {
      this.$store.dispatch('app/noteDayProgress', {
        day: {
          date: date.formatDate(new Date(), 'YYYY/MM/DD'),
          status,
          user: this.$store.state.user.currentUser.uid
        },
        challengeId
      })
      this.updateProgress()
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer)
    clearTimeout(this.secondTimer)
  },
  async created() {
    if (!this.$store.state.app.syncStatus) {
      await Promise.all([
        this.$store.dispatch('app/fetchChallenges'),
        this.$store.dispatch('user/fetchUsers')
      ])
    }
    // Set progress with timeout so that it animates
    setTimeout(this.updateProgress, 500)
    this.isLoading = false
  }
}
</script>

<style lang="scss" scoped>
.daily {
margin-bottom: 52px;
}

.hidden {
  display: none;
}

.progress-wrapper {
  margin-bottom: 16px;
  width: 100%;
}

.wrapper {
  width: 100%;
}

.completed {
  text-align: center;
  margin-top: 48px;
  margin-bottom: 16px;
}

.item-wrapper {
  margin-bottom: 16px;
  /* Override quasar selectors */
  border: none !important;
}

.item-wrapper .q-item {
  padding: 0;
}

.list {
  border: none;
}

.was-completed {
  transform: translate3d(2000px, 0, 0);
}

.title-wrapper {
  width: 100%;
  text-align: center;
  h5 {
    margin-bottom: 16px;
  }
}

</style>
