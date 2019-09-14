<template>
  <q-page class="flex flex-center" id="test">
    <h5 v-if="challenges.length === 0">
      You don't have any challenges yet. Quick start one by clicking the plus button
    </h5>
    <transition name="expand">
      <div class="title-wrapper" v-if="challenges.length > 0 && !this.oneChallengeExpanded">
        <h5>
          Weekly Overview
        </h5>
      </div>
    </transition>
    <div class="q-pa-md wrapper">
      <challenge v-for="(challenge, key) in localChallenges" :options="challenge" :onExpand="onExpand" :key="key"/>
    </div>
    <transition name="fade">
      <add-button v-if="!this.oneChallengeExpanded"/>
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
      get () {
        return this.$store.state.app.myChallenges
      }
    }
  },
  watch: {
    challenges: function (val) {
      if (val.length !== this.localChallenges.length) {
        this.localChallenges = val.map(challenge => {
          return {
            ...challenge,
            expanded: false,
            oneChallengeExpanded: false
          }
        })
      }
    }
  },
  data () {
    return {
      localChallenges: [],
      oneChallengeExpanded: false
    }
  },
  methods: {
    onExpand: function (challengeId) {
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
.expand-enter-active, .expand-leave-active {
  transition: height .5s;
}
.expand-enter, .expand-leave-to {
  height: 0
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
