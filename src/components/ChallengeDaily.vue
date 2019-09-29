<template>
    <q-card :class="['challenge text-white row', complete ?  'was-completed' : '']">
      <q-card-section class="col-10 main-header">
        <div class="icon-wrapper">
          <q-icon :name="getIconName(options.icon)" class="category-icon" >
          </q-icon>
        </div>
        <div class="header">
          <div class="text-h6">{{options.title}}</div>
          <div class="text-subtitle2">{{readableFrequency}}</div>
        </div>
      </q-card-section>
      <q-card-section class="col-2 flex flex-center button-wrapper">
        <q-checkbox dark v-model="complete" color="teal" class="checkbox" @input="onCheck"/>
      </q-card-section>
    </q-card>
</template>

<style>
</style>

<script>
import { ICON_MAP } from '../helpers/constants'
import { getReadableFrequency } from '../helpers/calendar'

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
    },
    readableFrequency: {
      get () {
        return getReadableFrequency(this.options.frequency, this.options.perWeek, this.options.perMonth, this.options.specificDays)
      }
    }
  },
  methods: {
    onCheck: function (e) {
      console.log('boom')
      if (e) {
        this.onComplete(this.options.id)
      }
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
  width: 100%;
  background: linear-gradient(to left, #3a404d, #181c26);
  display: flex;
  justify-content: space-between;
  transition: transform 0.2s ease-in;
  transition-delay: .5s;
}

.name {
  margin-left: 3rem;
}

.icon-wrapper {
  display: inline-block;
  width: 48px;
  font-size: 32px;
  height: 54px;
  position: relative;
  flex: 0 1 auto;
}

.icon-wrapper i {
  position: absolute; /*it can be fixed too*/
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

.button-wrapper {
  padding-bottom: 0;
}

.main-header {
  flex-wrap: nowrap;
  display: flex;
  flex-direction: row;
}

.header {
  display: inline-block;
  height: 54px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1 2 auto;
}

.was-completed {
  transform: translate3d(2000px,0,0);
}

.hidden {
  visibility: none;
}

.text-h6 {
  text-overflow: ellipsis;
  overflow: hidden;
  width: auto;
  white-space: nowrap;
}

</style>
