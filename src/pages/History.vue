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
        <note v-if="showTooltip" class="text-dark" title="HOW TO USE" :onClose="onTipClose">
          <p>Here you can see all completed Challenges, check your scores. You can also restart old challenges.</p>
        </note>
      </div>
    </transition>
    <spinner v-if="isLoading" />
    <div v-if="!isLoading" class="challenges">
      <div class="q-pa-md wrapper" v-if="allChallenges.length">
        <completed-challenge
          v-for="(challenge, key) in allChallenges"
          :options="challenge"
          :onExpand="onExpand"
          :key="key + 'completed'"
        />
      </div>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import moment from 'moment-timezone'
import CompletedChallenge from 'components/CompletedChallenge.vue'
import Spinner from 'components/Spinner.vue'
import Note from 'components/Note.vue'
import { initMessaging } from '../helpers/messaging'

moment()
  .tz('Europe/Berlin')
  .format()

export default {
  name: 'Weekly',
  components: {
    CompletedChallenge,
    Spinner,
    Note
  },
  computed: {
    archive: {
      get() {
        return this.$store.state.app.archive
      }
    },
    allChallenges: {
      get() {
        return [...this.localChallenges, ...this.localArchive]
      }
    },
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
        return !(tipsClosed.indexOf('history') > -1)
      }
    },
    challenges: {
      get() {
        return this.$store.state.app.myChallenges
      }
    }
  },
  watch: {
    challenges: function(val) {
      this.updateLocalChallanges(val)
    },
    archive: function(val) {
      this.updateLocalArchive(val)
    }
  },
  data() {
    return {
      localChallenges: [],
      localArchive: [],
      oneChallengeExpanded: false,
      isLoading: true,
      search: ''
    }
  },
  methods: {
    toggleIsCompletedHidden() {
      this.$store.commit('app/toggleIsCompleted')
    },
    onTipClose() {
      this.$store.dispatch('user/closeTip', {
        userId: this.$store.state.user.currentUser.uid,
        tip: 'history'
      })
    },
    updateLocalChallanges: function(val) {
      if (val.length !== this.localChallenges.length) {
        this.localChallenges = val
          .filter(c => c.isPast)
          .map(challenge => {
            return {
              ...challenge,
              expanded: false,
              oneChallengeExpanded: false
            }
          })
      }
    },
    updateLocalArchive: function(val) {
      if (val.length !== this.localArchive.length) {
        this.localArchive = val.map(challenge => {
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
      this.localArchive = this.localArchive.map(challenge => {
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
    this.updateLocalArchive(this.archive)
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
  height: 56px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  label {
    flex-grow: 1;
    margin-right: 20px;
  }
}

.top {
  height: 76px;

  &--big {
    height: 150px;
  }
}

.title-wrapper {
  height: 112px;
  overflow: hidden;

  h5 {
    color: #e1e1e1;
  }
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
