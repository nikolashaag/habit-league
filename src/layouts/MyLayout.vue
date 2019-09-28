<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="navbar">
        <q-btn flat dense size="lg" round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>Habit Win</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered content-class="bg-grey-2">
      <q-list>
        <q-item-label header>Menu</q-item-label>
        <q-item clickable @click="goToPage('daily')">
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Daily view</q-item-label>
            <q-item-label caption>Complete your daily tasks</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="goToPage('/')">
          <q-item-section avatar>
            <q-icon name="school" />
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
            <q-item-label>Browse Challenges</q-item-label>
            <q-item-label caption>Join other people</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="logout">
          <q-item-section avatar>
            <q-icon name="public" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Logout</q-item-label>
            <q-item-label caption>Logout from the App</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <transition :name="transitionName">
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import firebase from 'firebase'

export default {
  name: 'MyLayout',
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      transitionName: 'slide-left'
    }
  },
  watch: {
    '$route' (to, from) {
      if ((from.path === '/daily' && to.path === '/') || to.path === '/browse' || from.path === '/login' || from.path === '/signup') {
        this.transitionName = 'slide-left'
      } else {
        this.transitionName = 'slide-right'
      }
    }
  },
  methods: {
    openURL,
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

      if (!isDesktop) {
        this.leftDrawerOpen = false
      }

      this.$router.replace(pageName)
    }
  }
}
</script>

<style scoped>
.q-header {
  background: linear-gradient(to left, #3a404d, #181c26);
}

.navbar {
  min-height: 64px;
}

.slide-right-enter-active, .slide-right-leave-active {
  transition: left .5s ease-out;
  min-height: 804px;
  position: absolute;
  width: 100%;
  height: 100%;
}
.slide-right-enter {
  left: -100%;
}
.slide-right-enter-to {
  left: 0;
}
.slide-right-leave {
  left: 0;
}
.slide-right-leave-to {
  left: 100%;
}
.slide-left-enter-active, .slide-left-leave-active {
  transition: left .5s ease-out;
  min-height: 804px;
  position: absolute;
  width: 100%;
  height: 100%;
}
.slide-left-enter {
  left: 100%;
}
.slide-left-enter-to {
  left: 0;
}
.slide-left-leave {
  left: 0;
}
.slide-left-leave-to {
  left: -100%;
}
</style>
