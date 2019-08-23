<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          Habit Win
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>Essential Links</q-item-label>
        <q-item clickable @click="daliy">
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Daily view</q-item-label>
            <q-item-label caption>Complete your daily tasks</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="myHabits">
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>My Habits / Challenges</q-item-label>
            <q-item-label caption>Keep track of your habits</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="browse">
          <q-item-section avatar>
            <q-icon name="record_voice_over" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Browse Challenges</q-item-label>
            <q-item-label caption>forum.quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="history">
          <q-item-section avatar>
            <q-icon name="rss_feed" />
          </q-item-section>
          <q-item-section>
            <q-item-label>History</q-item-label>
            <q-item-label caption>See your completed challenges</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="logout">
          <q-item-section avatar>
            <q-icon name="public" />
          </q-item-section>
          <q-item-section >
            <q-item-label>Logout</q-item-label>
            <q-item-label caption>Logout from the App</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import firebase from 'firebase'

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL,
    logout: function () {
      firebase.auth().signOut().then(() => {
        this.$router.replace('login')
      })
    },
    browse: function () {
      this.$router.replace('browse')
    },
    myHabits: function () {
      this.$router.replace('/')
    },
    history: function () {
      this.$router.replace('history')
    },
    daily: function () {
      this.$router.replace('daily')
    }
  }
}
</script>

<style>

.q-header {
  background: linear-gradient(to bottom, #3a404d, #181c26);
}
</style>
