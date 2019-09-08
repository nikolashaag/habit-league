<template>
    <q-card class="challenge text-white" @click="() => expanded = !expanded">
      <q-icon :name="expanded === true ? 'expand_less' : 'expand_more'" class="caret">
      </q-icon>
      <q-card-section>
        <div class="icon-wrapper">
          <q-icon :name="getIconName(options.category)" class="category-icon">
          </q-icon>
        </div>
        <div class="header">
          <div class="text-h6">{{options.title}}</div>
          <div class="text-subtitle2">by John Doe</div>
        </div>
      </q-card-section>

      <q-card-section v-if="expanded !== true">
         Current Leader: John
      </q-card-section>
      <q-card-section v-if="expanded === true">
         Leaderboard:
         <div class="row leaderboard-row" v-for="(member, key) in options.members" :key="key + 'member'">
           <div class="number">{{key + 1}}</div>
           <div class="name">{{getDisplayName(member.id)}}</div>
           <div class="status">Completed days: {{member.completedDays}}</div>
         </div>
      </q-card-section>

      <!-- <q-separator dark /> -->

      <q-card-actions>
        <div class="row week-wrapper justify-between" v-if="isCurrentWeek(firstWeek) || expanded === true">
          <q-btn class="invisible-buttons" v-for="(day, key) in 7 - firstWeek.length" :key="key + 'first'" size="m" round color="amber" text-color="black">{{day.label}}</q-btn>
          <q-btn :disabled="day.isInFuture" v-for="(day, key) in firstWeek" :key="key + 'first' + options.title" size="m" round :color="getColor(day)" text-color="black" @click="e => noteProgressForDay(day, e)">{{day.label}}</q-btn>
        </div>
        <div class="leftover-wrapper">
          <div v-for="(week, key) in leftOverWeeks" :key="key + 'leftOverWeeks' + options.title" class="row week-wrapper justify-between" >
            <div class="row leftover-wrapper justify-between" v-if="isCurrentWeek(week) || expanded === true">
              <q-btn :disabled="day.isInFuture" v-for="(day, i) in week" :key="i + 'other' + key" size="m" round :color="getColor(day)" text-color="black" @click="e => noteProgressForDay(day, e)">{{day.label}}</q-btn>
            </div>
          </div>
        </div>
        <div class="row week-wrapper justify-between" v-if="isCurrentWeek(lastWeek) || expanded === true">
          <q-btn :disabled="day.isInFuture" v-for="(day, key) in lastWeek" :key="key + 'last' + options.title" size="m" round :color="getColor(day)" text-color="black" @click="e => noteProgressForDay(day, e)">{{day.label}}</q-btn>
          <q-btn class="invisible-buttons" v-for="(day, key) in 7 - lastWeek.length" :key="key + 'invisible-last'" size="m" round color="amber" text-color="black">{{day.label}}</q-btn>
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

    </q-card>
</template>

<style>
</style>

<script>
import { date } from 'quasar'
import { ICON_MAP } from '../helpers/constants'

export default {
  name: 'Challenge',
  data () {
    return {
      noteProgress: false,
      expanded: false,
      days: [
        {
          label: 'M'
        },
        {
          label: 'T'
        },
        {
          label: 'W'
        },
        {
          label: 'T'
        },
        {
          label: 'F'
        },
        {
          label: 'S'
        },
        {
          label: 'S'
        }
      ]
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
    getIconName: function (value) {
      return ICON_MAP[value]
    },
    getDisplayName: function (id) {
      return this.$store.state.user.users.find(user => user.uid === id).displayName
    },
    calculateDays: function () {
      let startDate = new Date(this.options.startDate)
      this.endDate = new Date(this.options.startDate)
      const split = startDate.getDay() - 1
      // Add dates to first Week
      this.firstWeek = this.days
        .slice(split > -1 ? split : 6)
        .map((day, index) => {
          let newDate = new Date(startDate)
          newDate.setDate(newDate.getDate() + index)
          return {
            label: day.label,
            date: newDate,
            isInFuture: newDate > new Date()
          }
        })

      this.endDate.setDate(startDate.getDate() + Number(this.options.duration))
      const lastWeekSplit = this.endDate.getDay() - 1
      this.lastWeek = this.days.slice(0, lastWeekSplit > -1 ? lastWeekSplit : 6)

      // Add dates to last Week
      this.lastWeek = this.lastWeek.map((day, index) => {
        let newDate = new Date(this.endDate)
        newDate.setDate(this.endDate.getDate() - (this.lastWeek.length - index))
        return {
          label: day.label,
          date: newDate,
          isInFuture: newDate > new Date()
        }
      })
      // Calculate all other weeks
      const leftOverDays = this.options.duration - (7 - split) - (lastWeekSplit)
      const prototype = [...new Array(leftOverDays / 7)]
      this.leftOverWeeks = prototype.map((week, weekIndex) => {
        return this.days.map((day, index) => {
          let startDate = new Date(this.options.startDate)
          let newDate = new Date(this.options.startDate)
          newDate.setDate(startDate.getDate() + (7 - split + index) + (weekIndex * 7))
          return {
            label: day.label,
            date: newDate,
            isInFuture: newDate > new Date()
          }
        })
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

<style>
.caret {
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  font-size: 3rem;
  color: white;
}
.challenge {
  margin-bottom: 16px;
  background: linear-gradient(to bottom, #3a404d, #181c26);
}

.leaderboard-row {
  width: calc(100% + 32px);
  height: 48px;
  line-height: 48px;
  margin-left: -16px;
}
.leaderboard-row:nth-child(1) {
  background: #fa6855;
}
.leaderboard-row:nth-child(2) {
  background: #e0574f;
}
.leaderboard-row:nth-child(3) {
  background: #d7514d;
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
