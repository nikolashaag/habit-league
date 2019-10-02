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
        <span class="date">{{day.date.getDate()}} <span class="month" v-if="day.date.getDate() === 1">{{getMonthWritten(day.date.getMonth())}}</span>  </span>
        {{day.label}}
      </q-btn>
      <hr :class="`hr hr--${getChainColor(index)}`" />
    </div>
  </div>
</template>

<script>
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
    getMonthWritten(month) {
      switch (month) {
        case 1:
          return 'Jan'
        case 2:
          return 'Feb'
        case 3:
          return 'Mar'
        case 4:
          return 'Apr'
        case 5:
          return 'May'
        case 6:
          return 'Jun'
        case 7:
          return 'Jul'
        case 8:
          return 'Aug'
        case 9:
          return 'Sep'
        case 10:
          return 'Okt'
        case 11:
          return 'Nov'
        case 12:
          return 'Dec'
      }
    },
    getChainColor(index) {
      let color = 'amber'
      const dayBefore = this.week[index - 1]
      const currentDay = this.week[index]
      const nextDay = this.week[index + 1]
      const dayAfter = this.week[index + 2]

      const perWeek = this.challenge.frequency === 'per-week'

      const dayBeforeIsGreen = dayBefore && this.getColor(dayBefore) === 'green'
      const currentDayIsGreen = currentDay && this.getColor(currentDay) === 'green'
      const currentDayIsNotRed = currentDay && this.getColor(currentDay) !== 'red'
      const nextDayIsGreen = this.isDayChainable(currentDay) && nextDay && this.getColor(nextDay) === 'green'
      const dayAfterIsGreen = nextDay && this.getColor(nextDay) !== 'red' && dayAfter && this.getColor(dayAfter) === 'green'

      // Custom chain behaviour in per-week habits
      if (perWeek && dayBeforeIsGreen && nextDayIsGreen && currentDayIsNotRed) {
        return 'green'
      }
      if (perWeek && currentDayIsGreen && dayAfterIsGreen) {
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
@import "./src/css/breakpoints.scss";
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
  color: #b1b1b1;
  transform: translateY(-50%);
}

.month {
  text-transform: none;
}
</style>
