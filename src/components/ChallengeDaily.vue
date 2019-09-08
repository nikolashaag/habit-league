<template>
    <q-card :class="['challenge text-white', complete ?  'was-completed' : '']">
      <q-card-section>
        <div class="icon-wrapper">
          <q-icon :name="getIconName(options.category)" class="category-icon" >
          </q-icon>
        </div>
        <div class="header">
          <div class="text-h6">{{options.title}}</div>
          <div class="text-subtitle2">by John Doe</div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="checkbox-wrapper">
          <q-checkbox dark v-model="complete" color="teal" class="checkbox" @input="onCheck"/>
        </div>
      </q-card-section>
      <q-dialog v-model="noteProgress">
        <q-card>
          <q-card-section>
            <div class="text-h6">Note day</div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn label="Complete" color="primary" @click="log('complete')" v-close-popup />
            <q-btn label="Fail" color="primary" @click="log('fail')" v-close-popup />
            <q-btn label="Skip" color="primary" @click="log('skip')" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </q-card>
</template>

<style>
</style>

<script>
import { date } from 'quasar'
import { ICON_MAP } from '../helpers/constants'

export default {
  name: 'Challenge',
  data () {
    return {
      noteProgress: false,
      complete: false
    }
  },
  props: ['options', 'onComplete'],
  computed: {
    loggedDays: {
      get () {
        return this.$store.state.app.challenges.find(challenge => challenge.id === this.options.id).loggedDays || []
      },
      set (val) {
        // this.$store.commit('showcase/updateDrawerState', val)
      }
    },
    progress: {
      get () {
        let dt1 = new Date(this.options.startDate)
        let dt2 = new Date()
        const diff = Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24))
        return this.options.duration / diff / 10
      }
    }
  },
  methods: {
    onCheck: function (e) {
      if (e) {
        this.onComplete(this.options.id)
      }
    },
    getIconName: function (value) {
      return ICON_MAP[value]
    },
    getDisplayName: function (id) {
      return this.$store.state.user.users.find(user => user.uid === id).displayName
    },
    noteProgressForDay: function (day, e) {
      this.activeDay = day
      this.noteProgress = true
      e.preventDefault()
      e.stopPropagation()
    },
    log: function (status) {
      this.$store.dispatch('app/noteDayProgress', {
        day: {
          date: date.formatDate(this.activeDay.date, 'YYYY/MM/DD'),
          status
        },
        challengeId: this.options.id
      })
    }
  }
}
</script>

<style>
.caret {
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  font-size: 3rem;
  color: white;
}
.challenge {
  width: 100%;
  background: linear-gradient(to bottom, #3a404d, #181c26);
  display: flex;
  justify-content: space-between;
  transition: transform 0.2s ease-in;
}

.leaderboard-row {
  width: calc(100% + 32px);
  height: 48px;
  line-height: 48px;
  margin-left: -16px;
}
.leaderboard-row:nth-child(1) {
  background: #fa6855;
}
.leaderboard-row:nth-child(2) {
  background: #e0574f;
}
.leaderboard-row:nth-child(3) {
  background: #d7514d;
}

.number {
  background: white;
  color: black;
  text-align: center;
  border-radius: 50%;
  padding: 0;
  min-height: 0;
  height: 2rem;
  width: 2rem;
  min-width: 2rem;
  min-height: 2rem;
  margin-left: 1rem;
  margin-top: 0.5rem;
  line-height: 2rem;
}

.name {
  margin-left: 3rem;
}

.status {
  margin-left: 10rem;
}

.week-wrapper, .leftover-wrapper {
  width: 100%;
}

.week-wrapper {
  margin-bottom: 16px;
}

.invisible-buttons {
  visibility: hidden;
}

.icon-wrapper {
  display: inline-block;
  width: 48px;
  font-size: 32px;
  height: 54px;
  position: relative;
}

.icon-wrapper i {
  position:absolute; /*it can be fixed too*/
  left:0; right:0;
  top:0; bottom:0;
  margin:auto;
}

.header {
  display: inline-block;
  height: 54px;
}

.checkbox-wrapper {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translate(-50%, -50%);
}

.was-completed {
  transform: translate3d(2000px,0,0);
}

.hidden {
  visibility: none;
}

</style>
