<template>
  <q-page class="flex flex-center challenges-page">
    <h5
      v-if="!isLoading && challenges.length === 0"
    >You don't have any challenges yet. Quick start one by clicking the plus button</h5>
    <transition name="expand">
      <div
        :class="['wrapper q-pa-md top', showTooltip && 'top--big']"
        v-if="challenges.length > 0 && !this.oneChallengeExpanded"
      >
        <note v-if="showTooltip" title="HOW TO USE" :onClose="onTipClose">
          <p>In this view you see a weekly overview for each habit. When you tab on a habit, it will expand and show more details, like the calendar.</p>
        </note>
        <div class="title-wrapper text-center">
          <h5>Weekly Overview</h5>
        </div>
        <div class="search wrapper">
          <q-input v-model="search" label="Search for a habit" />
        </div>
      </div>
    </transition>
    <spinner v-if="isLoading" />
    <div v-if="!isLoading" class="challenges">
      <div class="q-pa-md wrapper" v-if="dailyChallenges.length">
        <transition name="expand">
          <div class="title-wrapper" v-if="!this.oneChallengeExpanded">
            <h5>Every day</h5>
          </div>
        </transition>

        <challenge
          v-for="(challenge, key) in dailyChallenges"
          :options="challenge"
          :onExpand="onExpand"
          :key="key"
        />
      </div>
      <div class="q-pa-md wrapper" v-if="specificDaysChallenges.length">
        <transition name="expand">
          <div class="title-wrapper" v-if="!this.oneChallengeExpanded">
            <h5>Specific Days</h5>
          </div>
        </transition>

        <challenge
          v-for="(challenge, key) in specificDaysChallenges"
          :options="challenge"
          :onExpand="onExpand"
          :key="key"
        />
      </div>
      <div class="q-pa-md wrapper" v-if="weeklyChallenges.length">
        <transition name="expand">
          <div class="title-wrapper" v-if="!this.oneChallengeExpanded">
            <h5>Weekly</h5>
          </div>
        </transition>
        <challenge
          v-for="(challenge, key) in weeklyChallenges"
          :options="challenge"
          :onExpand="onExpand"
          :key="key"
        />
      </div>
      <div class="q-pa-md wrapper" v-if="monthlyChallenges.length">
        <transition name="expand">
          <div class="title-wrapper" v-if="!this.oneChallengeExpanded">
            <h5>Monthly</h5>
          </div>
        </transition>
        <challenge
          v-for="(challenge, key) in monthlyChallenges"
          :options="challenge"
          :onExpand="onExpand"
          :key="key"
        />
      </div>
    </div>

    <transition name="fade"></transition>
  </q-page>
</template>

<style>
</style>

<script>
import Challenge from 'components/Challenge.vue'
import Spinner from 'components/Spinner.vue'
import Note from 'components/Note.vue'
import { initMessaging } from '../helpers/messaging'

export default {
  name: 'Weekly',
  components: {
    Challenge,
    Spinner,
    Note
  },
  computed: {
    showTooltip: {
      get() {
        const userId = this.$store.state.user.currentUser.uid
        const user = (this.$store.state.user.users || []).find(
          user => user.uid === userId
        )
        if (!user) {
          return false
        }
        const tipsClosed = (user && user.tipsClosed) || []
        return !(tipsClosed.indexOf('weekly') > -1)
      }
    },
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
    },
    filterdChallenges() {
      if (this.search) {
        return this.localChallenges.filter(challenge => {
          const title = challenge.title.toLowerCase()
          return title.includes(this.search.toLowerCase())
        })
      }
      return this.localChallenges
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
      oneChallengeExpanded: false,
      isLoading: true,
      search: ''
    }
  },
  methods: {
    onTipClose() {
      this.$store.dispatch('user/closeTip', {
        userId: this.$store.state.user.currentUser.uid,
        tip: 'weekly'
      })
    },
    getChallengesByFrequency(frequency) {
      return this.filterdChallenges.filter(
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
      console.log('challengeId', this.localChallenges)

      if (this.oneChallengeExpanded) {
        this.$scrollTo('body', 1000)
      }
    }
  },
  async created() {
    if (!this.$store.state.app.syncStatus) {
      await Promise.all([
        this.$store.dispatch('app/fetchChallenges'),
        this.$store.dispatch('user/fetchUsers')
      ])
    }
    this.updateLocalChallanges(this.challenges)
    this.isLoading = false

    const currentToken = await initMessaging()
    if (currentToken) {
      this.$store.dispatch('user/saveToken', currentToken)
    }
  }
}
</script>

<style lang="scss" scoped>
.challenges-page {
  height: auto;
}

.challenges {
  width: 100%;
  margin-bottom: 52px;
}
.add-button {
  position: fixed;
  bottom: 50px;
  right: 50px;
}
.search {
  width: 100%;
  margin-bottom: 20px;
}

.top {
  height: 188px;

  &--big {
    height: 262px;
  }
}
.title-wrapper {
  height: 112px;
  overflow: hidden;
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
