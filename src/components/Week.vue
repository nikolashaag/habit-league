<template>
  <div class="row week-wrapper justify-between">
    <div
      class="day"
      v-for="(day, index) in week"
      :key="index + 'last' + challenge.title"
      :style="`order: ${2 * (index + 1) - 1}`"
    >
      <q-btn
        class="day-button"
        :title="day.date"
        :disabled="
          day.isAfterHabitEnds || day.isInFuture || day.isBeforeHabitStart
        "
        round
        :color="getColor(day)"
        text-color="black"
        @click="$emit('noteProgressForDay', day, $event)"
      >
        <span v-if="!isLastDay(day.date)" class="date">
          {{ day.date.getDate() }}
          <span class="month" v-if="day.date.getDate() === 1">
            {{
            getMonthWrittenLocal(day.date.getMonth())
            }}
          </span>
        </span>
        <span v-if="isLastDay(day.date)" class="date">End</span>
        {{ day.label }}
      </q-btn>
      <!-- <hr :class="`hr hr--${getChainColor(index)}`" /> -->
    </div>
    <div
      :class="`hr hr--${getChainColor(index)}`"
      v-for="(day, index) in week.slice(0, 6)"
      :key="index + 'line' + challenge.title"
      :style="`order: ${2 * (index + 1)}`"
    ></div>
  </div>
</template>

<script>
import { getMonthWritten } from '../helpers/calendar'
import { date } from 'quasar'
import moment from 'moment-timezone'

moment()
  .tz('Europe/Berlin')
  .format()

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
      switch (log && log.status) {
        case 'complete':
          return 'green'
        case 'fail':
          return 'red'
        default:
          const isToday =
            moment().format('YYYY/MM/DD') ===
            moment(day.date).format('YYYY/MM/DD')
          if (isToday) {
            return 'white'
          }
      }
      return 'amber'
    },
    isLastDay: function(day) {
      return date.isSameDate(day, this.challenge.endDate, 'day')
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
  flex-grow: 0;
  flex-shrink: 0;
  align-items: center;
  position: relative;
  z-index: 1;
}

.day-button {
  font-size: 12px;
  @include sm {
    font-size: 14px;
  }
}

.hr {
  margin: 0;
  border: 0px;
  height: 40px;
  margin-left: -10px;
  margin-right: -10px;
  position: relative;
  flex-grow: 1;
  &--green {
    background-color: green;

    &:before {
      width: calc(100% + 2px);
      height: 20px;
      border-radius: 50%;
      background-color: #232323;
      display: inline-block;
      vertical-align: middle;
      /* margin-right: 10px; */
      content: '';
      top: -9px;
      position: absolute;
      left: -1px;
    }

    &:after {
      width: 100%;
      height: 20px;
      border-radius: 50%;
      background-color: #232323;
      display: inline-block;
      vertical-align: middle;
      /* margin-right: 10px; */
      content: '';
      bottom: -9px;
      position: absolute;
      left: 0;
    }
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
  text-transform: none;
}

.month {
  text-transform: none;
}
/deep/ {
  .bg-amber-borderd {
    border: 1px solid yellow;
    background: balck;
    color: yellow !important;
  }
}
</style>
