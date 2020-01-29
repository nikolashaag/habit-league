<template>
  <q-card
    :class="[
      'challenge',
      'bg-dark',
      'text-white',
      options.expanded && 'expanded'
    ]"
    @click="() => onExpand(options.id)"
    v-if="!(!options.expanded && options.oneChallengeExpanded)"
  >
    <q-card-section class="menus">
      <div class="icon-wrapper">
        <icon :icon="options.icon" />
      </div>
      <div class="header">
        <div class="text-title">{{ options.title }}</div>
        <div class="text-subtitle">
          {{ readableFrequency }}
          <reminder
            :is-visible="isReminderVisible"
            @close="isReminderVisible = false"
            :challenge="options"
          ></reminder>
        </div>
      </div>
      <q-btn
        color="white"
        round
        flat
        :icon="options.expanded === true ? 'expand_less' : 'expand_more'"
        class="caret"
      ></q-btn>
      <q-btn
        color="white"
        @click="e => e.stopPropagation()"
        round
        flat
        icon="more_vert"
        class="falafel"
      >
        <q-menu cover auto-close>
          <q-list>
            <q-item
              v-if="iAmAuthor"
              clickable
              @click="() => (deleteChallenge = !deleteChallenge)"
            >
              <q-item-section>Delete Habit</q-item-section>
            </q-item>
            <q-item v-if="iAmAuthor" clickable @click="editHabit">
              <q-item-section>Edit Habit</q-item-section>
            </q-item>
            <q-item
              v-if="!iAmAuthor"
              clickable
              @click="() => (leaveChallenge = !leaveChallenge)"
            >
              <q-item-section>Leave Habit</q-item-section>
            </q-item>
            <q-item clickable @click="copyUrl">
              <q-item-section>Invite link</q-item-section>
            </q-item>
            <q-item
              clickable
              v-if="!reminder"
              @click="isReminderVisible = true"
            >
              <q-item-section>Set a reminder</q-item-section>
            </q-item>
            <q-item clickable v-if="reminder" @click="deleteReminder">
              <q-item-section>Delete Reminder</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-card-section>

    <q-card-section class="content">
      <div v-if="options.expanded && options.description">
        Description: <i v-if="options.expanded">{{ options.description }}</i>
      </div>
    </q-card-section>
    <q-card-section class="countdown flex flex-center" v-if="isInFuture">
      <h6>{{ countdown }}</h6>
    </q-card-section>
    <leader-board
      :members="sortedMembers"
      v-if="options.expanded === true"
    ></leader-board>

    <div class="weeks">
      <div
        v-if="options.expanded && weeks.length > 5"
        class="justify-center pagination-wrapper"
      >
        <q-btn
          @click="onPaginationClick"
          color="amber"
          size="md"
          class="text-dark"
        >
          <div class="row items-center no-wrap">
            <div class="text-center">
              {{ expandedPagination ? 'Show less' : 'Show more' }}
            </div>
            <q-icon
              right
              size="xs"
              :name="
                expandedPagination ? 'fas fa-chevron-down' : 'fas fa-chevron-up'
              "
            />
          </div>
        </q-btn>
      </div>
      <div :class="`leftover-wrapper rows-${weeks.length}`">
        <div
          v-for="(week, key) in weeks"
          :key="key + 'weeks' + options.title"
          class="row justify-between"
        >
          <transition name="fade">
            <week
              v-if="shouldShowWeek(week, weeks.length, key)"
              :challenge="{ ...options, endDate }"
              :loggedDays="loggedDays"
              :week="week"
              @noteProgressForDay="(day, e) => noteProgressForDay(day, e)"
            ></week>
          </transition>
        </div>
      </div>
    </div>
    <q-linear-progress
      rounded
      stripe
      class="progress"
      style="height: 10px"
      color="warning"
      :value="progress"
    />
    <dialog-popup
      @close="closeDialog"
      title="Note day"
      :model="noteProgress"
      align="center"
    >
      <q-btn
        label="Complete"
        color="green"
        @click="log('complete')"
        v-close-popup
      />
      <q-btn
        label="Skip"
        color="amber"
        class="text-dark"
        @click="log('skip')"
        v-close-popup
      />
      <q-btn label="Fail" color="red" @click="log('fail')" v-close-popup />
    </dialog-popup>
    <dialog-popup
      title="Are you sure you want to delete this Habit?"
      :model="deleteChallenge"
      :confirm="{ label: 'Delete', onClick: removeChallenge }"
      :cancel="{ label: 'Cancel', onClick: onDelete.bind(this) }"
    />
    <dialog-popup
      title="Are you sure you want to leave the Challenge?"
      :model="leaveChallenge"
      :confirm="{ label: 'Leave', onClick: leaveChallengeAction }"
      :cancel="{
        label: 'Cancel',
        onClick: e => (leaveChallenge = !leaveChallenge)
      }"
    />
  </q-card>
</template>

<script>
import { date } from 'quasar'
import { sort } from '../helpers/utils'
import week from './Week'
import LeaderBoard from './Leaderboard'
import Icon from './Icon'
import DialogPopup from './DialogPopup.vue'
import Reminder from './Reminder/Index.vue'
import {
  getReadableFrequency,
  getScore,
  getWeeks,
  getBestStreak
} from '../helpers/calendar'

export default {
  name: 'Challenge',
  data() {
    return {
      noteProgress: false,
      expanded: false,
      deleteChallenge: false,
      leaveChallenge: false,
      countdown: '',
      countdownInterval: null,
      weeks: null,
      expandedPagination: false,
      isReminderVisible: false
    }
  },
  components: {
    week,
    LeaderBoard,
    DialogPopup,
    Reminder,
    Icon
  },
  props: ['options', 'onExpand'],
  computed: {
    loggedDays: {
      get() {
        const loggedDays =
          this.$store.state.app.myChallenges.find(
            challenge => challenge.id === this.options.id
          ).loggedDays || []
        return loggedDays.filter(
          day => day.user === this.$store.state.user.currentUser.uid
        )
      }
    },
    readableFrequency: {
      get() {
        return getReadableFrequency(
          this.options.frequency,
          this.options.perWeek,
          this.options.perMonth,
          this.options.specificDays
        )
      }
    },
    isInFuture: {
      get() {
        const startDate = new Date(this.options.startDate)
        const today = new Date()
        return startDate.setHours(0, 0, 0, 0) > today.setHours(0, 0, 0, 0)
      }
    },
    iAmAuthor: {
      get() {
        return (
          this.options.author === this.$store.state.user.currentUser.displayName
        )
      }
    },
    sortedMembers: {
      get() {
        try {
          return this.sortMembers(this.options.members || [])
        } catch {
          return []
        }
      }
    },
    progress: {
      get() {
        let dt1 = new Date(this.options.startDate)
        let dt2 = new Date()
        let diff = Math.floor(
          (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
            Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
            (1000 * 60 * 60 * 24)
        )
        // If diff is 0, set to 1 (In case the challenge started today)
        diff = diff || 1
        return diff / (this.options.duration / 100) / 100
      }
    },
    currentUser: {
      get() {
        return this.sortedMembers.find(
          member => member.id === this.$store.state.user.currentUser.uid
        )
      }
    },
    reminder() {
      let currentUser = this.$store.state.user.currentUser.uid
      let currentReminder =
        this.options.reminders &&
        this.options.reminders.find(reminder => reminder.userID === currentUser)
      return currentReminder
    },
    shouldShowWeek() {
      return (week, habitLength, index) => {
        if (habitLength < 6) {
          return this.isCurrentWeek(week) || this.options.expanded === true
        }
        const isLastFive = habitLength - index < 6
        return (
          this.isCurrentWeek(week) ||
          (this.options.expanded === true &&
            (isLastFive || this.expandedPagination === true))
        )
      }
    }
  },
  methods: {
    closeDialog: function() {
      this.noteProgress = false
    },
    deleteReminder: function() {
      this.$store.dispatch('app/deleteHabitReminder', {
        challenge: this.options
      })
    },
    onPaginationClick: function(e) {
      this.expandedPagination = !this.expandedPagination
      e.preventDefault()
      e.stopPropagation()
    },
    copyUrl: function() {
      if (typeof navigator.share === 'function') {
        navigator
          .share({
            title: 'Hey, I dare you!',
            text: `Let's Improve our habits, starting with [${this.options.title} ${this.readableFrequency}]`,
            url:
              window.location.origin +
              '/#/invite?challengeId=' +
              this.options.id
          })
          .then(() =>
            console.log(
              'Successful share! 🎉',
              window.location.origin +
                '/#/invite?challengeId=' +
                this.options.id
            )
          )
          .catch(err => console.error(err))
      }
    },
    createCountdown: function() {
      // Set the date we're counting down to
      const countDownDate = new Date(this.options.startDate).getTime()

      // Update the count down every 1 second
      this.countdownInterval = setInterval(() => {
        // Get today's date and time
        const now = new Date().getTime()
        // Find the distance between now and the count down date
        const distance = countDownDate - now
        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        )
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)
        // Output the result in an element with id="demo"
        this.countdown =
          'Starting in: ' +
          days +
          'd ' +
          hours +
          'h ' +
          minutes +
          'm ' +
          seconds +
          's '
        // If the count down is over, write some text
        if (distance < 0) {
          clearInterval(this.countdownInterval)
          this.countdown = 'Challenge starting'
        }
      }, 1000)
    },
    editHabit: function() {
      this.$store.commit('app/setActiveChallenge', this.options)
      this.$router.replace('/create?edit=true')
    },
    getCompletedDaysForUser: function(uid) {
      const challengeId = this.options.id

      const currentChallenge = this.$store.state.app.myChallenges.find(
        challenge => challenge.id === challengeId
      )
      const loggedDays = (currentChallenge && currentChallenge.loggedDays) || []

      return (
        loggedDays.filter(day => day.user === uid && day.status === 'complete')
          .length || 0
      )
    },
    onDelete() {
      console.log('onDelete')
      this.deleteChallenge = !this.deleteChallenge
    },
    sortMembers: function(users) {
      const sorted = sort(
        users.map(user => {
          return {
            ...user,
            completedDays: this.getCompletedDaysForUser(user.id),
            score: getScore(
              this.options,
              this.getCompletedDaysForUser(user.id),
              this.endDate
            ),
            bestStreak: getBestStreak(
              this.options,
              this.getLoggedDaysPerUser(user.id)
            )
          }
        }),
        'completedDays'
      )
      let withPosition = []
      for (let i = 0; i < sorted.length; i++) {
        const position =
          withPosition[i - 1] &&
          withPosition[i - 1].completedDays === sorted[i].completedDays
            ? withPosition[i - 1].position
            : !withPosition[i - 1]
              ? 1
              : withPosition[i - 1].position + 1
        withPosition.push({
          position,
          ...sorted[i]
        })
      }
      return withPosition
    },
    getLoggedDaysPerUser: function(uid) {
      const challengeId = this.options.id

      const currentChallenge = this.$store.state.app.myChallenges.find(
        challenge => challenge.id === challengeId
      )
      const loggedDays = (currentChallenge && currentChallenge.loggedDays) || []

      return (
        loggedDays.filter(
          day => day.user === uid && day.status === 'complete'
        ) || []
      )
    },
    calculateDays: function() {
      let startDate = new Date(this.options.startDate)
      this.endDate = new Date(this.options.startDate)
      const diffDays =
        Number(this.options.duration) === 0
          ? 0
          : Number(this.options.duration) - 1
      this.endDate.setDate(startDate.getDate() + diffDays)
      this.weeks = getWeeks({
        duration: this.options.duration,
        startDate,
        endDate: this.endDate
      })
    },
    isCurrentWeek: function(week) {
      const today = new Date()
      const startOfWeek = week[0].date
      const endOfWeek = date.addToDate(week[0].date, { days: 7 })
      return (
        week.length > 0 &&
        date.isBetweenDates(today, startOfWeek, endOfWeek, {
          inclusiveFrom: true,
          inclusiveTo: true
        })
      )
    },
    getColor: function(day) {
      const log = this.loggedDays.find(loggedDay => {
        return new Date(loggedDay.date).getTime() === day.date.getTime()
      })
      if (!log) {
        return 'amber'
      }
      switch (log.status) {
        case 'complete':
          return 'green'
        case 'fail':
          return 'red'
        default:
          return 'amber'
      }
    },
    noteProgressForDay: function(day, e) {
      this.activeDay = day
      this.noteProgress = true
      e.preventDefault()
      e.stopPropagation()
    },
    removeChallenge: function() {
      this.$store.dispatch('app/deleteHabit', {
        challengeId: this.options.id
      })
    },
    leaveChallengeAction: function() {
      this.$store.dispatch('app/leaveChallenge', this.options.id)
    },
    log: function(status) {
      this.$store.dispatch('app/noteDayProgress', {
        day: {
          date: date.formatDate(this.activeDay.date, 'YYYY/MM/DD'),
          status,
          user: this.$store.state.user.currentUser.uid
        },
        challengeId: this.options.id
      })
      this.noteProgress = false
    }
  },
  created: function() {
    this.calculateDays()
    if (this.isInFuture) {
      this.createCountdown()
    }
  },
  beforeDestroy: function() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval)
    }
  }
}
</script>

<style scoped lang="scss">
@import './src/css/breakpoints.scss';

.menus {
  // position: absolute;
  // right: 0;
  // top: -8px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  padding: 0;
  font-size: 3rem;
  color: white;
  z-index: 2;
  height: 64px;

  @include sm {
    top: 0;
  }
}
.challenge {
  position: relative;
  margin-bottom: 16px;
  // transition: min-height 0.5s ease;
}

.challenge.expanded {
  // min-height: calc(100vh - 161px);
  // transition: min-height 0.5s ease-in-out;
  width: 100%;
  // overflow: scroll;

  .content {
    padding-bottom: 16px;
    margin-bottom: 16px;
  }
}

.expand-enter-active,
.expand-leave-active {
  transition: min-height 0.5s ease-in-out;
}
.expand-enter,
.expand-leave-to {
  min-height: 0;
}

.leftover-wrapper,
.week-wrapper {
  max-height: 174px;
  transition: all 0.2s ease-in-out;
}

.rows-1 {
  max-height: 74px;
}

.rows-2 {
  max-height: 148px;
}

.rows-3 {
  max-height: 222px;
}

.rows-4 {
  max-height: 296px;
}

.rows-5 {
  max-height: 370px;
}

.rows-6 {
  max-height: 444px;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease-in-out;
  transition-delay: 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
  transition-delay: 0s;
}

.content {
  padding-bottom: 0;
  margin-bottom: 16px;
}

.weeks {
  padding: 0px 16px 8px 16px;

  @include iphone5 {
    padding-left: 8px;
    padding-right: 8px;
  }
}

.challenge.expanded {
  .weeks {
    position: relative;
    min-height: calc(100vh - 161px);
    overflow: scroll;
  }
}

.week-wrapper,
.leftover-wrapper {
  width: 100%;
}

.week-wrapper {
  margin-bottom: 16px;
  @include iphone5 {
    flex-wrap: nowrap;
  }
}

.invisible-buttons {
  visibility: hidden;
}

.icon-wrapper {
  display: inline-block;
  width: 64px;
  font-size: 32px;
  height: 54px;
  min-width: 64px;
  position: relative;
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;

  @include sm {
    left: 0;
  }
}

.header {
  display: inline-block;
  vertical-align: top;
  flex: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  align-self: center;

  .text-title {
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.5rem;
    letter-spacing: 0.0125em;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    @include sm {
      font-size: 1.25rem;
      line-height: 2rem;
    }
  }

  .text-subtitle {
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.375rem;
    letter-spacing: 0.00714em;

    @include sm {
      font-size: 1rem;
    }
  }
}

.progress {
  position: absolute;
  bottom: 0;
}

.falafel,
.caret {
  font-size: 16px;
  min-width: 32px;
  width: 32px;
  height: 32px;
  min-height: 32px;
  align-self: center;

  @include sm {
    font-size: 20px;
    min-width: 48px;
    width: 48px;
    height: 48px;
    min-height: 48px;
  }
}

.countdown h6 {
  margin-top: 24px;
  margin-bottom: 24px;
}

.pagination-wrapper {
  width: 100%;
  display: flex;
  height: 36px;
  margin-bottom: 1rem;
}
</style>
