<template>
  <q-page class="flex flex-center challenges-page">
    <h5 v-if="!isLoading && challenges.length === 0">
      You don't have any challenges yet. Quick start one by clicking the plus
      button
    </h5>
    <transition name="expand">
      <div
        :class="['wrapper q-pa-md top', showTooltip && 'top--big']"
        v-if="challenges.length > 0 && !this.oneChallengeExpanded"
      >
        <note v-if="showTooltip" class="text-dark" title="HOW TO USE" :onClose="onTipClose">
          <p>
            In this view you see a weekly overview for each habit. When you tab
            on a habit, it will expand and show more details, like the calendar.
          </p>
        </note>
        <transition name="expand">
          <div class="search wrapper">
            <q-input dark color="amber" :dense="true" v-model="search" label="Find habit">
              <template v-slot:prepend>
                <q-icon class="search-icon" name="fas fa-search" />
              </template>
            </q-input>
            <q-toggle v-model="isCompletedHidden" label="Hide completed" left-label color="amber" />
          </div>
        </transition>
      </div>
    </transition>
    <spinner v-if="isLoading" />
    <div v-if="!isLoading" class="challenges">
      <div class="q-pa-md wrapper" v-if="dailyChallenges.length">
        <transition name="expand">
          <div class="title-wrapper" v-if="!this.oneChallengeExpanded">
            <h5>Every day</h5>
          </div>
        </transition>

        <challenge
          v-for="(challenge, key) in dailyChallenges.filter(c => !c.isPast)"
          :options="challenge"
          :onExpand="onExpand"
          :key="key"
        />
        <completed-challenge
          v-for="(challenge, key) in dailyChallenges.filter(c => c.isPast)"
          :archivable="true"
          :options="challenge"
          :onExpand="onExpand"
          :key="key + 'completed'"
        />
      </div>
      <div class="q-pa-md wrapper" v-if="specificDaysChallenges.length">
        <transition name="expand">
          <div class="title-wrapper" v-if="!this.oneChallengeExpanded">
            <h5>Specific Days</h5>
          </div>
        </transition>

        <challenge
          v-for="(challenge, key) in specificDaysChallenges"
          :options="challenge"
          :onExpand="onExpand"
          :key="key"
        />
        <completed-challenge
          v-for="(challenge, key) in specificDaysChallenges.filter(
            c => c.isPast
          )"
          :options="challenge"
          :onExpand="onExpand"
          :key="key + 'completed'"
        />
      </div>
      <div class="q-pa-md wrapper" v-if="weeklyChallenges.length">
        <transition name="expand">
          <div class="title-wrapper" v-if="!this.oneChallengeExpanded">
            <h5>Weekly</h5>
          </div>
        </transition>
        <challenge
          v-for="(challenge, key) in weeklyChallenges"
          :options="challenge"
          :onExpand="onExpand"
          :key="key"
        />
        <completed-challenge
          v-for="(challenge, key) in weeklyChallenges.filter(c => c.isPast)"
          :options="challenge"
          :onExpand="onExpand"
          :key="key + 'completed'"
        />
      </div>
      <div class="q-pa-md wrapper" v-if="monthlyChallenges.length">
        <transition name="expand">
          <div class="title-wrapper" v-if="!this.oneChallengeExpanded">
            <h5>Monthly</h5>
          </div>
        </transition>
        <challenge
          v-for="(challenge, key) in monthlyChallenges.filter(c => !c.isPast)"
          :options="challenge"
          :onExpand="onExpand"
          :key="key"
        />
        <completed-challenge
          v-for="(challenge, key) in monthlyChallenges.filter(c => c.isPast)"
          :options="challenge"
          :onExpand="onExpand"
          :key="key + 'completed'"
        />
      </div>
    </div>
  </q-page>
</template>

<style></style>

<script>
import moment from 'moment-timezone'
import Challenge from 'components/Challenge.vue'
import CompletedChallenge from 'components/CompletedChallenge.vue'
import Spinner from 'components/Spinner.vue'
import Note from 'components/Note.vue'
import { initMessaging } from '../helpers/messaging'

moment()
  .tz('Europe/Berlin')
  .format()

export default {
  name: 'Weekly',
  components: {
    Challenge,
    CompletedChallenge,
    Spinner,
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
        return !(tipsClosed.indexOf('weekly') > -1)
      }
    },
    challenges: {
      get() {
        return this.$store.state.app.myChallenges
      }
    },
    weeklyChallenges() {
      return this.getChallengesByFrequency('per-week')
    },
    dailyChallenges() {
      return this.getChallengesByFrequency('daily')
    },
    specificDaysChallenges() {
      return this.getChallengesByFrequency('specific')
    },
    monthlyChallenges() {
      return this.getChallengesByFrequency('per-month')
    },
    filterdChallenges() {
      let filterdChallenges = this.localChallenges
      if (this.search) {
        filterdChallenges = filterdChallenges.filter(challenge => {
          const title = challenge.title.toLowerCase()
          return title.includes(this.search.toLowerCase())
        })
      }

      if (this.isCompletedHidden) {
        filterdChallenges = filterdChallenges.filter(challenge => {
          return !this.isChallengeCompleted(challenge)
        })
      }

      return filterdChallenges
    }
  },
  watch: {
    challenges: function(val) {
      this.updateLocalChallanges(val)
    }
  },
  data() {
    return {
      localChallenges: [],
      oneChallengeExpanded: false,
      isLoading: true,
      search: '',
      isCompletedHidden: false
    }
  },
  methods: {
    onTipClose() {
      this.$store.dispatch('user/closeTip', {
        userId: this.$store.state.user.currentUser.uid,
        tip: 'weekly'
      })
    },
    getChallengesByFrequency(frequency) {
      return this.filterdChallenges.filter(
        challenge => challenge.frequency === frequency
      )
    },
    updateLocalChallanges: function(val) {
      if (val.length !== this.localChallenges.length) {
        this.localChallenges = val
          .filter(
            challenge =>
              !(
                challenge.archived &&
                challenge.archived.indexOf(
                  this.$store.state.user.currentUser.uid
                ) > -1
              )
          )
          .map(challenge => {
            return {
              ...challenge,
              expanded: false,
              oneChallengeExpanded: false
            }
          })
      }
    },
    onExpand: function(challengeId) {
      this.oneChallengeExpanded = !this.oneChallengeExpanded
      this.localChallenges = this.localChallenges.map(challenge => {
        if (challenge.id === challengeId) {
          return {
            ...challenge,
            expanded: this.oneChallengeExpanded,
            oneChallengeExpanded: this.oneChallengeExpanded
          }
        }
        return {
          ...challenge,
          expanded: false,
          oneChallengeExpanded: this.oneChallengeExpanded
        }
      })
      console.log('challengeId', this.localChallenges)

      if (this.oneChallengeExpanded) {
        this.$scrollTo('body', 1000)
      }
    },
    isChallengeCompleted: function(challenge) {
      if (challenge.isPast) {
        return true
      }
      let isCompleted = false
      const currentUserId = this.$store.state.user.currentUser.uid
      const frequency = challenge.frequency
      const loggedDaysThisWeek = (challenge.loggedDays || []).filter(log => {
        return (
          log.user === currentUserId &&
          log.status === 'complete' &&
          moment(log.date, 'YYYY/MM/DD').isBetween(
            moment().day(0),
            moment().day(7)
          )
        )
      })

      switch (frequency) {
        case 'daily':
          const loggedToday = !!(challenge.loggedDays || []).filter(log => {
            return (
              log.user === currentUserId &&
              log.status === 'complete' &&
              log.date === moment().format('YYYY/MM/DD')
            )
          }).length
          isCompleted = loggedToday
          break
        case 'per-week':
          let target = challenge.perWeek
          isCompleted = target <= loggedDaysThisWeek.length
          break
        case 'specific':
          target = challenge.specificDays.length
          isCompleted = target <= loggedDaysThisWeek.length
          break
      }

      return isCompleted
    }
  },
  async created() {
    if (!this.$store.state.app.syncStatus) {
      await Promise.all([
        this.$store.dispatch('app/fetchChallenges'),
        this.$store.dispatch('user/fetchUsers')
      ])
    }
    this.updateLocalChallanges(this.challenges)
    this.isLoading = false

    const currentToken = await initMessaging()
    if (currentToken) {
      this.$store.dispatch('user/saveToken', currentToken)
    }
  }
}
</script>

<style lang="scss" scoped>
.challenges-page {
  height: auto;
}

.challenges {
  width: 100%;
  margin-bottom: 52px;
}
.add-button {
  position: fixed;
  bottom: 50px;
  right: 50px;
}

.search {
  width: 100%;
  height: 56px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  label {
    flex-grow: 1;
    margin-right: 20px;
  }
}

.top {
  height: 76px;

  &--big {
    height: 150px;
  }
}

.title-wrapper {
  height: 112px;
  overflow: hidden;

  h5 {
    color: #e1e1e1;
  }
}

.search-icon {
  font-size: 16px;
}

.wrapper {
  width: 100%;
  padding-bottom: 0;
}
.expand-enter-active,
.expand-leave-active {
  transition: height 0.5s;
}
.expand-enter,
.expand-leave-to {
  height: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
