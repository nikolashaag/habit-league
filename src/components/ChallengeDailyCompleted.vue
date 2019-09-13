<template>
    <q-card :class="['challenge text-white', complete ?  'was-completed' : '']">
      <q-card-section>
        <div class="icon-wrapper">
          <q-icon :name="getIconName(options.category)" class="category-icon" >
          </q-icon>
        </div>
        <div class="header">
          <div class="text-h6">{{options.title}}</div>
          <div class="text-subtitle2">by {{options.author}}</div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="checkbox-wrapper">
          <q-card-section class="justify-end row">
            <q-btn color="grey" label="Undo" @click="e => undoChallenge(e)"/>
          </q-card-section>
      </div>
      </q-card-section>
    </q-card>
</template>

<style>
</style>

<script>
import { ICON_MAP } from '../helpers/constants'
import { date } from 'quasar'

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
    undoChallenge: function () {
      this.$store.dispatch('app/noteDayProgress', {
        day: {
          date: date.formatDate(new Date(), 'YYYY/MM/DD'),
          status: 'skip',
          user: this.$store.state.user.currentUser.uid
        },
        challengeId: this.options.id
      })
    },
    getIconName: function (value) {
      return ICON_MAP[value]
    },
    getDisplayName: function (id) {
      return this.$store.state.user.users.find(user => user.uid === id).displayName
    }
  }
}
</script>

<style scoped>
.challenge {
  margin-bottom: 16px;
  opacity: 0.5;
  width: 100%;
  background: linear-gradient(to bottom, #3a404d, #181c26);
  display: flex;
  justify-content: space-between;
  transition: transform 0.2s ease-in;
}

.name {
  margin-left: 3rem;
}

.status {
  margin-left: 10rem;
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
  transform: translateY(-50%);
}

.was-completed {
  transform: translate3d(2000px,0,0);
}

.hidden {
  visibility: none;
}

</style>
