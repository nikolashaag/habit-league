<template>
  <transition name="expand">
    <q-card
      :class="['challenge', 'text-white', options.expanded && 'expanded']"
      @click="() => onExpand(options.id)"
      v-if="!(!options.expanded && options.oneChallengeExpanded)"
    >
      <q-card-section class="menus">
        <q-btn
          color="white"
          size="lg"
          round
          flat
          :icon="options.expanded === true ? 'expand_less' : 'expand_more'"
        ></q-btn>
        <q-btn
          color="white"
          size="lg"
          @click="e => e.stopPropagation()"
          round
          flat
          icon="more_vert"
        >
          <q-menu cover auto-close>
            <q-list>
              <q-item clickable @click="() => deleteChallenge = !deleteChallenge">
                <q-item-section>Delete Habit</q-item-section>
              </q-item>
              <q-item clickable @click="editHabit">
                <q-item-section>Edit Habit</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-card-section>

      <q-card-section class="content">
        <div class="icon-wrapper">
          <q-icon :name="getIconName(options.icon)" class="category-icon"></q-icon>
        </div>
        <div class="header">
          <div class="text-h6">{{options.title}}</div>
          <div class="text-subtitle2">{{readableFrequency}}</div>
        </div>
      </q-card-section>
      <q-card-section class="countdown flex flex-center" v-if="isInFuture">
        <h5>{{countdown}}</h5>
      </q-card-section>
      <leader-board
        :members="sortedMembers"
        v-if="options.expanded === true && options.members.length > 1"
      ></leader-board>

      <q-card-actions class="weeks">
        <transition name="fade">
          <week
            v-if="isCurrentWeek(firstWeek) || options.expanded === true"
            :challenge="options"
            :loggedDays="loggedDays"
            :week="firstWeek"
            @noteProgressForDay="(day,e) => noteProgressForDay(day,e)"
          ></week>
        </transition>

        <div class="leftover-wrapper">
          <div
            v-for="(week, key) in leftOverWeeks"
            :key="key + 'leftOverWeeks' + options.title"
            class="row week-wrapper justify-between"
          >
            <transition name="fade">
              <week
                v-if="isCurrentWeek(week) || options.expanded === true"
                :challenge="options"
                :loggedDays="loggedDays"
                :week="week"
                @noteProgressForDay="(day,e) => noteProgressForDay(day,e)"
              ></week>
            </transition>
          </div>
        </div>
        <transition name="fade">
          <week
            v-if="isCurrentWeek(lastWeek) || options.expanded === true"
            :challenge="options"
            :loggedDays="loggedDays"
            :week="lastWeek"
            @noteProgressForDay="(day,e) => noteProgressForDay(day,e)"
          ></week>
        </transition>
      </q-card-actions>
      <q-linear-progress
        rounded
        stripe
        class="progress"
        style="height: 10px"
        color="warning"
        :value="progress"
      />
      <q-dialog v-model="noteProgress">
        <q-card>
          <q-card-section>
            <div class="text-h6">Note day</div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn label="Complete" color="primary" @click="log('complete')" v-close-popup />
            <q-btn label="Fail" color="primary" @click="log('fail')" v-close-popup />
            <q-btn label="Skip" color="primary" @click="log('skip')" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="deleteChallenge">
        <q-card>
          <q-card-section>
            <div class="text-h6">Are you sure you want to delete this Habit?</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="Delete" color="primary" @click="removeChallenge" v-close-popup />
            <q-btn
              label="Cancel"
              color="primary"
              @click="e => deleteChallenge = !deleteChallenge"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </transition>
</template>

<style>
</style>

<script>
import { date } from 'quasar'
import { ICON_MAP } from '../helpers/constants'
import { sort } from '../helpers/utils'
import week from './Week'
import LeaderBoard from './Leaderboard'

import {
  getFirstWeek,
  getLastWeek,
  getAllOtherWeeks,
  getReadableFrequency
} from '../helpers/calendar'

export default {
  name: 'Challenge',
  data() {
    return {
      noteProgress: false,
      expanded: false,
      deleteChallenge: false,
      countdown: '',
      countdownInterval: null,
      firstWeek: null,
      lastWeek: null,
      leftOverWeeks: null
    }
  },
  components: {
    week,
    LeaderBoard
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
    sortedMembers: {
      get() {
        return this.sortMembers(this.options.members)
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
    }
  },
  methods: {
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
    getloggedDaysForUser: function(uid) {
      const loggedDays =
        this.$store.state.app.myChallenges.find(
          challenge => challenge.id === this.options.id
        ).loggedDays || []
      return loggedDays.filter(day => day.user === uid)
    },
    sortMembers: function(members) {
      return sort(
        members.map(member => {
          return {
            ...member,
            completedDays: this.getloggedDaysForUser(member.id).length
          }
        }),
        'completedDays'
      )
    },
    getIconName: function(value) {
      return ICON_MAP[value]
    },
    calculateDays: function() {
      let startDate = new Date(this.options.startDate)
      this.endDate = new Date()
      this.endDate.setDate(startDate.getDate() + Number(this.options.duration))

      this.firstWeek = getFirstWeek({ startDate })
      this.lastWeek = getLastWeek({ endDate: this.endDate })
      this.leftOverWeeks = getAllOtherWeeks({
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
    log: function(status) {
      this.$store.dispatch('app/noteDayProgress', {
        day: {
          date: date.formatDate(this.activeDay.date, 'YYYY/MM/DD'),
          status,
          user: this.$store.state.user.currentUser.uid
        },
        challengeId: this.options.id
      })
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
.menus {
  position: absolute;
  right: 0;
  top: 0;
  padding: 0;
  font-size: 3rem;
  color: white;
  z-index: 2;
}
.challenge {
  margin-bottom: 16px;
  background: linear-gradient(to left, #3a404d, #181c26);
  transition: min-height 0.5s ease;
  min-height: 192px;
}

.challenge.expanded {
  min-height: calc(100vh - 82px);
  transition: min-height 0.5s ease-in-out;
  width: 100%;
}

.expand-enter-active,
.expand-leave-active {
  transition: min-height 0.5s ease-in-out;
}
.expand-enter,
.expand-leave-to {
  min-height: 0;
}

.leftover-wrapper {
  margin-bottom: 46px;
}

.leftover-wrapper,
.week-wrapper {
  max-height: 174px;
  transition: all 0.2s ease-in-out;
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
  margin-bottom: 16px;
}

.weeks {
  padding-left: 16px;
  padding-right: 16px;
}

.number {
  background: white;
  color: black;
  text-align: center;
  border-radius: 50%;
  padding: 0;
  min-height: 0;
  height: 2rem;
  width: 2rem;
  min-width: 2rem;
  min-height: 2rem;
  margin-left: 1rem;
  margin-top: 0.5rem;
  line-height: 2rem;
}

.week-wrapper,
.leftover-wrapper {
  width: 100%;
}

.week-wrapper {
  margin-bottom: 16px;
}

.invisible-buttons {
  visibility: hidden;
}

.icon-wrapper {
  display: inline-block;
  width: 48px;
  font-size: 32px;
  height: 54px;
  position: relative;
}

.icon-wrapper i {
  position: absolute; /*it can be fixed too*/
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}

.header {
  display: inline-block;
  height: 54px;
}

.progress {
  position: absolute;
  bottom: 0;
}
</style>
