<template>
  <q-page class="flex flex-center" id="test">
    <h5
      v-if="challenges.length === 0"
    >You don't have any challenges yet. Quick start one by clicking the plus button</h5>
    <transition name="expand">
      <div class="title-wrapper" v-if="challenges.length > 0 && !this.oneChallengeExpanded">
        <h5>Weekly Overview</h5>
      </div>
    </transition>
    <div class="q-pa-md wrapper" v-if="dailyChallenges.length">
      <h5>Today</h5>
      <challenge
        v-for="(challenge, key) in dailyChallenges"
        :options="challenge"
        :onExpand="onExpand"
        :key="key"
      />
    </div>
    <div class="q-pa-md wrapper" v-if="specificDaysChallenges.length">
      <h5>Specific Days</h5>
      <challenge
        v-for="(challenge, key) in specificDaysChallenges"
        :options="challenge"
        :onExpand="onExpand"
        :key="key"
      />
    </div>
    <div class="q-pa-md wrapper" v-if="weeklyChallenges.length">
      <h5>Weekly</h5>
      <challenge
        v-for="(challenge, key) in weeklyChallenges"
        :options="challenge"
        :onExpand="onExpand"
        :key="key"
      />
    </div>

    <div class="q-pa-md wrapper" v-if="monthlyChallenges.length">
      <h5>Monthly</h5>
      <challenge
        v-for="(challenge, key) in monthlyChallenges"
        :options="challenge"
        :onExpand="onExpand"
        :key="key"
      />
    </div>

    <transition name="fade">
      <add-button v-if="!this.oneChallengeExpanded" />
    </transition>
  </q-page>
</template>

<style>
</style>

<script>
import Challenge from 'components/Challenge.vue'
import AddButton from 'components/AddButton.vue'

export default {
  name: 'PageIndex',
  components: {
    Challenge,
    AddButton
  },
  computed: {
    challenges: {
      get() {
        return this.$store.state.app.myChallenges
      }
    },
    weeklyChallenges() {
      return this.getChallengesByFrequency('per-week')
    },
    dailyChallenges() {
      return this.getChallengesByFrequency('daily')
    },
    specificDaysChallenges() {
      return this.getChallengesByFrequency('specific')
    },
    monthlyChallenges() {
      return this.getChallengesByFrequency('per-month')
    }
  },
  watch: {
    challenges: function(val) {
      this.updateLocalChallanges(val)
    }
  },
  data() {
    return {
      localChallenges: [],
      oneChallengeExpanded: false
    }
  },
  methods: {
    getChallengesByFrequency(frequency) {
      return this.challenges.filter(
        challenge => challenge.frequency === frequency
      )
    },
    updateLocalChallanges: function(val) {
      if (val.length !== this.localChallenges.length) {
        this.localChallenges = val.map(challenge => {
          return {
            ...challenge,
            expanded: false,
            oneChallengeExpanded: false
          }
        })
      }
    },
    onExpand: function(challengeId) {
      this.oneChallengeExpanded = !this.oneChallengeExpanded
      this.localChallenges = this.localChallenges.map(challenge => {
        if (challenge.id === challengeId) {
          return {
            ...challenge,
            expanded: this.oneChallengeExpanded,
            oneChallengeExpanded: this.oneChallengeExpanded
          }
        }
        return {
          ...challenge,
          expanded: false,
          oneChallengeExpanded: this.oneChallengeExpanded
        }
      })
      if (this.oneChallengeExpanded) {
        this.$scrollTo('body', 1000)
      }
    }
  },
  created() {
    if (!this.$store.state.app.syncStatus) {
      this.$store.dispatch('app/fetchChallenges')
      this.$store.dispatch('user/fetchUsers')
    }
    this.updateLocalChallanges(this.challenges)
  }
}
</script>

<style>
.add-button {
  position: fixed;
  bottom: 50px;
  right: 50px;
}
.title-wrapper {
  height: 112px;
}

.wrapper {
  width: 100%;
  padding-bottom: 0;
}
.expand-enter-active,
.expand-leave-active {
  transition: height 0.5s;
}
.expand-enter,
.expand-leave-to {
  height: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
