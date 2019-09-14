<template>
    <q-card class="challenge text-white" @click="() => expanded = !expanded">
      <q-card-section class="menus">
        <q-btn color="white" size="lg" round flat :icon="expanded === true ? 'expand_less' : 'expand_more'">
        </q-btn>
        <!-- <q-icon :name="expanded === true ? 'expand_less' : 'expand_more'" class="caret">
        </q-icon> -->
        <q-btn color="white" size="lg" @click="e => e.stopPropagation()" round flat icon="more_vert">
          <q-menu cover auto-close>
            <q-list>
              <q-item clickable @click="() => deleteChallenge = !deleteChallenge">
                <q-item-section>Delete Habit</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>Edit Habit</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-card-section>

      <q-card-section class="content">
        <div class="icon-wrapper">
          <q-icon :name="getIconName(options.icon)" class="category-icon">
          </q-icon>
        </div>
        <div class="header">
          <div class="text-h6">{{options.title}}</div>
          <div class="text-subtitle2">by {{options.author}}</div>
        </div>
      </q-card-section>

      <q-card-section v-if="expanded === true && options.members.length > 1">
         Leaderboard:
         <div class="row leaderboard-row" v-for="(member, key) in sortedMembers" :key="key + 'member'">
           <div class="number">{{key + 1}}</div>
           <div class="name">{{getDisplayName(member.id)}}</div>
           <div class="status">Completed days: {{member.completedDays}}</div>
         </div>
      </q-card-section>

      <!-- <q-separator dark /> -->

      <q-card-actions class="weeks">
        <div class="row week-wrapper justify-between" v-if="isCurrentWeek(firstWeek) || expanded === true">
          <q-btn :title="day.date" :disabled="day.isInFuture || day.isBeforeHabitStart" v-for="(day, key) in firstWeek" :key="key + 'first' + options.title" size="m" round :color="getColor(day)" text-color="black" @click="e => noteProgressForDay(day, e)">{{day.label}}</q-btn>
        </div>
        <div class="leftover-wrapper">
          <div v-for="(week, key) in leftOverWeeks" :key="key + 'leftOverWeeks' + options.title" class="row week-wrapper justify-between" >
            <div class="row leftover-wrapper justify-between" v-if="isCurrentWeek(week) || expanded === true">
              <q-btn :title="day.date" :disabled="day.isInFuture" v-for="(day, i) in week" :key="i + 'other' + key" size="m" round :color="getColor(day)" text-color="black" @click="e => noteProgressForDay(day, e)">{{day.label}}</q-btn>
            </div>
          </div>
        </div>
        <div class="row week-wrapper justify-between" v-if="isCurrentWeek(lastWeek) || expanded === true">
          <q-btn :title="day.date" :disabled="day.isInFuture || day.isAfterHabitEnds" v-for="(day, key) in lastWeek" :key="key + 'last' + options.title" size="m" round :color="getColor(day)" text-color="black" @click="e => noteProgressForDay(day, e)">{{day.label}}</q-btn>
        </div>

      </q-card-actions>
      <q-linear-progress rounded stripe style="height: 10px" color="warning" :value="progress" />
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
            <q-btn label="Cancel" color="primary" @click="e => deleteChallenge = !deleteChallenge" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </q-card>
</template>

<style>
</style>

<script>
import { date } from 'quasar'
import { ICON_MAP } from '../helpers/constants'
import { sort } from '../helpers/utils'
import { getFirstWeek, getLastWeek, getAllOtherWeeks } from '../helpers/calendar'

export default {
  name: 'Challenge',
  data () {
    return {
      noteProgress: false,
      expanded: false,
      deleteChallenge: false
    }
  },
  props: ['options'],
  computed: {
    loggedDays: {
      get () {
        const loggedDays = this.$store.state.app.myChallenges.find(challenge => challenge.id === this.options.id).loggedDays || []
        return loggedDays.filter(day => day.user === this.$store.state.user.currentUser.uid)
      }
    },
    sortedMembers: {
      get () {
        return this.sortMembers(this.options.members)
      }
    },
    progress: {
      get () {
        let dt1 = new Date(this.options.startDate)
        let dt2 = new Date()
        let diff = Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24))
        // If diff is 0, set to 1 (In case the challenge started today)
        diff = diff || 1
        return (diff / (this.options.duration / 100)) / 100
      }
    }
  },
  methods: {
    getloggedDaysForUser: function (uid) {
      const loggedDays = this.$store.state.app.myChallenges.find(challenge => challenge.id === this.options.id).loggedDays || []
      return loggedDays.filter(day => day.user === uid)
    },
    sortMembers: function (members) {
      return sort(members.map(member => {
        return {
          ...member,
          completedDays: this.getloggedDaysForUser(member.id).length
        }
      }), 'completedDays')
    },
    getIconName: function (value) {
      return ICON_MAP[value]
    },
    getDisplayName: function (id) {
      return this.$store.state.user.users.find(user => user.uid === id).displayName
    },
    calculateDays: function () {
      let startDate = new Date(this.options.startDate)
      this.endDate = new Date(this.options.startDate)
      this.endDate.setDate(startDate.getDate() + Number(this.options.duration))

      this.firstWeek = getFirstWeek({ startDate })
      this.lastWeek = getLastWeek({ endDate: this.endDate })
      this.leftOverWeeks = getAllOtherWeeks({
        duration: this.options.duration,
        startDate,
        endDate: this.endDate
      })
    },
    isCurrentWeek: function (week) {
      const today = new Date()
      const startOfWeek = week[0].date
      const endOfWeek = date.addToDate(week[0].date, { days: 7 })
      return week.length > 0 && date.isBetweenDates(today, startOfWeek, endOfWeek, { inclusiveFrom: true, inclusiveTo: true })
    },
    getColor: function (day) {
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
    noteProgressForDay: function (day, e) {
      this.activeDay = day
      this.noteProgress = true
      e.preventDefault()
      e.stopPropagation()
    },
    removeChallenge: function () {
      this.$store.dispatch('app/deleteHabit', {
        challengeId: this.options.id
      })
    },
    log: function (status) {
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
  created: function () {
    this.calculateDays()
  }
}
</script>

<style scoped>
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
}

.content {
  margin-bottom: 16px;
}

.weeks {
  padding-left: 16px;
  padding-right: 16px;
}

.leaderboard-row {
  width: calc(100% + 32px);
  height: 48px;
  line-height: 48px;
  margin-left: -16px;
}
.leaderboard-row:nth-child(1) {
  background: #ffc107;
}
.leaderboard-row:nth-child(2) {
  background: #FFB300;
}
.leaderboard-row:nth-child(3) {
  background: #FFA000;
}
.leaderboard-row:nth-child(4) {
  background: #FF8F00;
}
.leaderboard-row:nth-child(5) {
  background: #FF5A04;
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

.name {
  margin-left: 3rem;
}

.status {
  margin-left: 10rem;
}

.week-wrapper, .leftover-wrapper {
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
  position:absolute; /*it can be fixed too*/
  left:0; right:0;
  top:0; bottom:0;
  margin:auto;
}

.header {
  display: inline-block;
  height: 54px;
}
</style>
