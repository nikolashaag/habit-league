<template>
  <q-page class="flex">
    <div
      class="category text-white"
      v-for="(chartData, category) in challengesByCategory"
      :key="category.key"
    >
      <h5>{{getCategory(category)}}</h5>
      <div class="category__chart">
        <bar-chart :data="chartData"></bar-chart>
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

      let loggedDays = (habit.loggedDays || []).filter(
        d =>
          d.status === 'complete' &&
          d.user === currentUserId &&
          moment(d.date, 'YYYY/MM/DD').isBetween(
            moment().day(0),
            moment().day(7)
          )
      ).length

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
      let habits = groupedChallenges[category].map(habit => {
        habit.successRate = this.getHabitSuccessRate(
          habit,
          this.$store.state.user.currentUser.uid
        )
        return habit
      }).filter(habit => !habit.isPast)
      const title = this.getCategory(category)
      let categoryChartData = {
        title,
        labels: habits.map(h => h.title),
        datasets: [
          {
            label: title,
            backgroundColor: 'rgba(226, 212, 2,0.7)',
            data: habits.map(h => h.successRate)
          }
        ],
        options: {
          scales: {
            xAxes: [
              {
                gridLines: {
                  color: 'rgb(94, 94, 94)'
                }
              }
            ],
            yAxes: [
              {
                gridLines: {
                  color: 'rgb(94, 94, 94)'
                }
              }
            ]
          }
        }
      }
      groupedChallenges[category] = categoryChartData
    }

    this.challengesByCategory = groupedChallenges
  }
}
</script>

<style lang="scss">
.category {
  width: 100%;
  padding: 0 20px;

  &__chart {
    padding-bottom: 50px;
  }
}
</style>
