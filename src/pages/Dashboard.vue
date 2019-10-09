<template>
  <q-page class="flex">
    <div class="category" v-for="(chartData, category) in challengesByCategory" :key="category.key">
      <h5>{{category}}</h5>
      <div class="category__chart">
        <bar-chart :data="chartData"></bar-chart>
      </div>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import moment from 'moment'
import BarChart from '../components/BarChart'

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

      let loggedDays = habit.loggedDays.filter(
        d =>
          d.status === 'complete' &&
          d.user === currentUserId &&
          moment(d.date).isBetween(moment().day(0), moment().day(7))
      ).length

      return Math.ceil((loggedDays / frequency) * 100)
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
      })

      let categoryChartData = {
        labels: habits.map(h => h.title),
        datasets: [
          {
            label: category,
            backgroundColor: 'rgba(255,0,0, 0.9)',
            borderColor: 'rgba(255,0,0, 0.1)',
            data: habits.map(h => h.successRate)
          }
        ]
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
