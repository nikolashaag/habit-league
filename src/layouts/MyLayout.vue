<template>
  <q-layout :class="['background', !requiresAuth && 'not-authenticated']" view="lHh Lpr lFf">
    <q-header elevated class="header bg-dark">
      <q-toolbar class="navbar">
        <q-btn
          class="burger"
          flat
          dense
          size="lg"
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>
        <q-toolbar-title>{{title}}</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" content-class="bg-grey-9">
      <q-list dark>
        <q-item-label header>Habits</q-item-label>
        <q-item clickable @click="goToPage('daily')">
          <q-item-section avatar>
            <q-icon name="fas fa-calendar-day" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Daily view</q-item-label>
            <q-item-label caption>Complete your daily tasks</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="goToPage('/weekly')">
          <q-item-section avatar>
            <q-icon name="fas fa-calendar-alt" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Weekly view</q-item-label>
            <q-item-label caption>Keep the overview</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="goToPage('browse')">
          <q-item-section avatar>
            <q-icon name="record_voice_over" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Public Challenges</q-item-label>
            <q-item-label caption>Join other people</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="goToPage('dashboard')">
          <q-item-section avatar>
            <q-icon name="fas fa-chart-line" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
            <q-item-label caption>See your progress</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="goToPage('history')">
          <q-item-section avatar>
            <q-icon name="fas fa-history" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Archive</q-item-label>
            <q-item-label caption>Completed Challenges</q-item-label>
          </q-item-section>
        </q-item>
        <q-item-label header>Account</q-item-label>
        <q-item clickable @click="reportBug">
          <q-item-section avatar>
            <q-icon name="fas fa-bug" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Report a bug</q-item-label>
            <q-item-label caption>Something's not right yet?</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="logout">
          <q-item-section avatar>
            <q-icon name="fas fa-sign-out-alt" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Logout</q-item-label>
            <q-item-label caption>Logout from the App</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>Version</q-item-label>
            <q-item-label caption>Beta 0.0.12</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <transition :name="transitionName">
        <router-view />
      </transition>
    </q-page-container>
    <secondary-nav v-if="requiresAuth" />
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import firebase from 'firebase'
import * as Sentry from '@sentry/browser'
import SecondaryNav from 'components/SecondaryNav.vue'

export default {
  name: 'MyLayout',
  components: {
    SecondaryNav
  },
  data() {
    console.log('this', this.$route)
    return {
      leftDrawerOpen: false,
      transitionName: 'slide-left',
      title: this.$route.matched.find(record => record.meta.title).meta.title,
      requiresAuth: this.$route.matched.find(record => record.meta.title).meta
        .requiresAuth
    }
  },
  watch: {
    $route(to, from) {
      if (
        (from.path === '/daily' && to.path === '/weekly') ||
        to.path === '/dashboard' ||
        from.path === '/login' ||
        from.path === '/signup'
      ) {
        this.transitionName = 'slide-left'
      } else if (from.path === '/weekly' && to.path === '/browse') {
        this.transitionName = 'slide-left'
      } else if (from.path === '/create' && to.path === '/browse') {
        this.transitionName = 'slide-left'
      } else if (from.path === '/daily' && to.path === '/browse') {
        this.transitionName = 'slide-right'
      } else if (from.path === '/browse' && to.path === '/create') {
        this.transitionName = 'slide-right'
      } else if (from.path === '/weekly' && to.path === '/create') {
        this.transitionName = 'slide-left'
      } else {
        this.transitionName = 'slide-right'
      }
      console.log('to', to)
      this.title = to.matched.find(record => record.meta.title).meta.title
      this.requiresAuth = to.matched.find(
        record => record.meta.title
      ).meta.requiresAuth
    }
  },
  methods: {
    openURL,
    reportBug: function() {
      this.leftDrawerOpen = false

      Sentry.captureException('Bug report')
    },
    logout: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace('login')
        })
    },
    goToPage(pageName) {
      let isDesktop = this.$q.platform.is.desktop
      const isSamePage = this.$route.path === pageName

      if (!isDesktop || isSamePage) {
        this.leftDrawerOpen = false
      }

      if (!isSamePage) {
        this.$router.replace(pageName)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.background {
  background: #121212;
  &.not-authenticated {
    background: #232323 !important;
  }
}

.q-header {
  background: linear-gradient(to left, #3a404d, #181c26);
  z-index: 99;
  text-align: center;

  .burger {
    position: absolute;
  }
}

.navbar {
  min-height: 64px;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease-out;
  min-height: 804px;
  position: absolute;
  width: 100%;
  height: 100%;
}
.slide-right-enter {
  transform: translateX(-100%);
}
.slide-right-enter-to {
  transform: translateX(0);
}
.slide-right-leave {
  transform: translateX(0);
}
.slide-right-leave-to {
  transform: translateX(100%);
}
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease-out;
  min-height: 804px;
  position: absolute;
  width: 100%;
  height: 100%;
}
.slide-left-enter {
  transform: translateX(100%);
}
.slide-left-enter-to {
  transform: translateX(0);
}
.slide-left-leave {
  transform: translateX(0);
}
.slide-left-leave-to {
  transform: translateX(-100%);
}

.secondary-nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 99;
}
</style>
