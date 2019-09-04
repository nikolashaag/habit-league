<template>
  <q-page class="flex flex-center">
    <div v-if="challenges.length === 0">
      You don't have any challenges yet. Quick start one by clicking the plus button
    </div>
    <div class="add-button">
      <router-link to="/create">
        <q-btn  size="xl" round color="amber" glossy text-color="black" icon="plus_one" />
      </router-link>
    </div>
    <div class="q-pa-md wrapper" v-if="challenges.length !== 0">
      <div class="title">
        To complete a habit, swipe it to the left or to the right or tick the checkbox.
      </div>

    <q-list class="list" bordered separator>

      <q-slide-item class="item-wrapper" @left="native => onLeft(native, challenge)" @right="native => onRight(native, challenge)" v-for="(challenge, key) in challenges" :key="key">
        <template v-slot:left>
          <q-icon name="done" /> Complete for today
        </template>
        <template v-slot:right>
          <div class="row items-center">
            Skip for today <q-icon right name="alarm" />
          </div>
        </template>

        <q-item>
          <challenge-daily :options="challenge"/>
        </q-item>
      </q-slide-item>
    </q-list>
  </div>
  </q-page>
</template>

<style>
</style>

<script>
import ChallengeDaily from 'components/ChallengeDaily.vue'
import { date } from 'quasar'

export default {
  name: 'PageIndex',
  components: {
    ChallengeDaily
  },
  computed: {
    challenges: {
      get () {
        return this.$store.state.app.myChallenges
          .filter(chal => {
            const loggedDays = chal.loggedDays || []
            return !loggedDays.find(day => date.formatDate(day.date, 'YYYY/MM/DD') === date.formatDate(new Date(), 'YYYY/MM/DD'))
          })
      }
    }
  },
  methods: {
    onLeft ({ reset }, challenge) {
      this.$q.notify('Congrats! You completed your daily habit')
      this.finalize(reset, challenge.id, 'complete')
    },
    onRight ({ reset }, challenge) {
      this.$q.notify("Skipped for today! Don't forget about it tomorrow")
      this.finalize(reset, challenge.id, 'skip')
    },

    finalize (reset, challengeId, status) {
      this.timer = setTimeout(() => {
        this.log(status, challengeId)
        reset()
      }, 1000)
    },
    log: function (status, challengeId) {
      this.$store.dispatch('app/noteDayProgress', {
        day: {
          date: date.formatDate(new Date(), 'YYYY/MM/DD'),
          status
        },
        challengeId
      })
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  },
  created () {
    if (!this.$store.state.app.syncStatus) {
      this.$store.dispatch('app/fetchChallenges')
      this.$store.dispatch('user/fetchUsers')
    }
  }
}
</script>

<style>
.add-button {
  position: fixed;
  z-index: 1;
  bottom: 50px;
  right: 50px;
}

.wrapper {
  width: 100%;
}

.title {
  text-align: center;
}

.item-wrapper {
  margin-bottom: 16px;
  /* Override quasar selectors */
  border: none !important;
}

.list {
  border: none;
}
</style>
