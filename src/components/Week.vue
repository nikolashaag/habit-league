<template>
  <div class="row week-wrapper justify-between">
    <div class="day" v-for="(day, index) in week" :key="index + 'last' + challenge.title">
      <q-btn
        class="day-button"
        :title="day.date"
        :disabled="day.isAfterHabitEnds || day.isInFuture || day.isBeforeHabitStart"
        round
        :color="getColor(day)"
        text-color="black"
        @click="$emit('noteProgressForDay', day,$event)"
      >
        <span class="date">
          {{day.date.getDate()}}
          <span
            class="month"
            v-if="day.date.getDate() === 1"
          >{{getMonthWrittenLocal(day.date.getMonth())}}</span>
        </span>
        {{day.label}}
      </q-btn>
      <hr :class="`hr hr--${getChainColor(index)}`" />
    </div>
  </div>
</template>

<script>
import { getMonthWritten } from '../helpers/calendar'

export default {
  name: 'week',
  data() {
    return {}
  },
  props: ['challenge', 'week', 'loggedDays'],
  methods: {
    isDayChainable(day) {
      if (day && (day.isInFuture || day.isBeforeHabitStart)) {
        return false
      }

      return true
    },
    getMonthWrittenLocal(month) {
      return getMonthWritten(month)
    },
    getChainColor(index) {
      let color = 'amber'
      const dayBefore = this.week[index - 1]
      const currentDay = this.week[index]
      const nextDay = this.week[index + 1]
      const dayAfter = this.week[index + 2]
      const dayIsInFuture = this.week[index].date.isInFuture
      const isSunday = index === 6
      const perWeek = this.challenge.frequency === 'per-week'
      const factorPerWeek = this.challenge.perWeek || 0
      const specificDaysFactor = this.challenge.specificDays.length

      const weekHasFactorCompletions =
        this.week.filter(day => {
          return this.getColor(day) === 'green'
        }).length >= factorPerWeek

      const specificDaysFactorCompletions =
        this.week.filter(day => {
          return this.getColor(day) === 'green'
        }).length >= specificDaysFactor

      const dayBeforeIsGreen = dayBefore && this.getColor(dayBefore) === 'green'
      const currentDayIsGreen =
        currentDay && this.getColor(currentDay) === 'green'
      const currentDayIsNotRed =
        currentDay && this.getColor(currentDay) !== 'red'
      const nextDayIsGreen =
        this.isDayChainable(currentDay) &&
        nextDay &&
        this.getColor(nextDay) === 'green'
      const dayAfterIsGreen =
        nextDay &&
        this.getColor(nextDay) !== 'red' &&
        dayAfter &&
        this.getColor(dayAfter) === 'green'

      // Custom chain behaviour in per-week habits
      if (perWeek && weekHasFactorCompletions && !dayIsInFuture && !isSunday) {
        return 'green'
      }
      if (
        specificDaysFactor &&
        specificDaysFactorCompletions &&
        !dayIsInFuture &&
        !isSunday
      ) {
        return 'green'
      }
      if (
        perWeek &&
        factorPerWeek < 4 &&
        dayBeforeIsGreen &&
        nextDayIsGreen &&
        currentDayIsNotRed
      ) {
        return 'green'
      }
      if (
        perWeek &&
        factorPerWeek < 4 &&
        currentDayIsGreen &&
        dayAfterIsGreen
      ) {
        return 'green'
      }
      if (nextDayIsGreen && currentDayIsGreen) {
        return 'green'
      }
      return color
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import './src/css/breakpoints.scss';
.week-wrapper {
  margin-top: 16px;
}

.day {
  display: flex;
  flex-grow: 1;
  align-items: center;
  position: relative;
}

.day-button {
  font-size: 12px;
  @include sm {
    font-size: 14px;
  }
}

.hr {
  width: 100%;
  margin: 0;
  border: 0px;
  &--green {
    border: 2px solid green;
  }
  &--red {
    border: 2px solid red;
  }
}

.date {
  position: absolute;
  top: -10px;
  color: #e4e4e4;
  transform: translateY(-50%);
}

.month {
  text-transform: none;
}
</style>
