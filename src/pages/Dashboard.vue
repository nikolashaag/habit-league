<template>
  <q-page class="flex">
    <div
      class="category text-white"
      v-for="(chartData, category) in challengesByCategory"
      :key="category.key"
    >
      <h6>{{getCategory(category)}}</h6>
      <div class="category__performance">
        <div class="category__chart">
          <bar-chart :data="chartData.chartData"></bar-chart>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import moment from 'moment-timezone'
import BarChart from '../components/BarChart'
import { CATEGORY_MAP } from '../helpers/constants'
moment()
  .tz('Europe/Berlin')
  .format()
export default {
  name: 'dashboard',
  components: { BarChart },
  data: function() {
    return {
      challengesByCategory: null
    }
  },
  computed: {
    challenges: {
      get() {
        return this.$store.state.app.myChallenges
      }
    }
  },
  methods: {
    getGroupedChallengesByCategory(challenges) {
      let groupedChallenges = {}

      challenges.forEach(challenge => {
        if (groupedChallenges[challenge.category]) {
          groupedChallenges[challenge.category].push(challenge)
        } else {
          groupedChallenges[challenge.category] = [challenge]
        }
      })

      return groupedChallenges
    },
    getHabitSuccessRate(habit, currentUserId) {
      let frequency = 1

      if (habit.frequency === 'daily') {
        frequency = 7
      }

      if (habit.frequency === 'per-week') {
        frequency = habit.perWeek
      }

      if (habit.frequency === 'per-month') {
        frequency = habit.perMonth
      }

      let loggedDays = (habit.loggedDays || []).filter(d => {
        return (
          d.status === 'complete' &&
          d.user === currentUserId &&
          moment(d.date, 'YYYY/MM/DD').isBetween(
            moment().day(-7),
            moment().day(0)
          )
        )
      }).length

      return Math.ceil((loggedDays / frequency) * 100)
    },
    getCategory(category) {
      return CATEGORY_MAP.find(cat => cat.value === category).label
    }
  },
  created: async function() {
    await this.$store.dispatch('app/fetchChallenges')

    this.challengesByCategory = this.getGroupedChallengesByCategory(
      this.challenges
    )
    let groupedChallenges = this.challengesByCategory

    for (let category in groupedChallenges) {
      let habits = groupedChallenges[category]
        .map(habit => {
          habit.successRate = this.getHabitSuccessRate(
            habit,
            this.$store.state.user.currentUser.uid
          )
          return habit
        })
        .filter(habit => !habit.isPast)
      const title = this.getCategory(category)
      let categoryChartData = {
        title,
        labels: habits.map(h => h.title),
        datasets: [
          {
            data: habits.map(h => h.successRate),
            backgroundColor: [
              '#0074D9',
              '#FF4136',
              '#2ECC40',
              '#FF851B',
              '#7FDBFF',
              '#B10DC9',
              '#FFDC00',
              '#001f3f',
              '#39CCCC',
              '#01FF70',
              '#85144b',
              '#F012BE',
              '#3D9970',
              '#111111',
              '#AAAAAA'
            ]
          }
        ],
        options: {
          responsive: true,
          legend: {
            display: false
          }
        }
      }
      groupedChallenges[category].chartData = categoryChartData
    }

    this.challengesByCategory = groupedChallenges
  }
}
</script>

<style lang="scss">
h6 {
  margin: 20px 5px 5px 0px;
}
.category {
  width: 100vw;
  padding: 0 20px;

  .category__performance {
    display: flex;
    justify-content: space-between;
  }
  &__chart {
    width: 100%;
  }
  &__top {
    margin-right: 20px;
    b:last-of-type {
      margin-top: 10px;
      display: inline-block;
    }
  }
}
</style>
