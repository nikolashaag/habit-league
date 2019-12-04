<template>
  <div class="inline-block text-black" v-if="isVisible || isSet">
    <div class="q-gutter-sm">
      <q-badge color="white">
        <span class="text-black" @click="showTimePicker()">@ {{eventHour}}</span>
      </q-badge>
    </div>

    <div class="q-gutter-sm row items-start">
      <q-dialog v-model="isTimePickerVisible">
        <q-time v-model="startDate" mask="YYYY-MM-DD HH:mm" color="amber" @input="saveReminder"></q-time>
      </q-dialog>
    </div>
  </div>
</template>
<script>
import { date } from 'quasar'

export default {
  name: 'reminder',
  props: ['challenge', 'isVisible'],
  data: function() {
    return {
      startDate: null,
      isSet: false,
      isTimePickerVisible: false
    }
  },
  watch: {
    challenge: {
      handler: function() {
        let currentUser = this.$store.state.user.currentUser.uid
        let currentReminder =
          this.challenge.reminders &&
          this.challenge.reminders.find(
            reminder => reminder.userID === currentUser
          )
        this.startDate =
          (currentReminder && currentReminder.startDate) ||
          date.formatDate(new Date(), 'YYYY-MM-DD HH:mm')
        this.repeatOn = (currentReminder && currentReminder.repeatOn) || []

        this.isSet = currentReminder && currentReminder.startDate
      },
      immediate: true
    },
    isVisible: function() {
      if (this.isVisible) {
        this.showTimePicker()
      }
    }
  },
  computed: {
    eventDate: function() {
      return this.startDate && this.startDate.split(' ')[0]
    },
    eventHour: function() {
      return this.startDate && this.startDate.split(' ')[1]
    }
  },
  methods: {
    showTimePicker: function() {
      this.isTimePickerVisible = true
    },
    saveReminder: function() {
      this.isTimePickerVisible = false
      let repeatOn = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday'
      ]

      if (this.challenge.frequency === 'specific') {
        repeatOn = this.challenge.specificDays
      }

      console.log('saving', this.startDate)

      this.$store.dispatch('app/setHabitReminder', {
        challenge: this.challenge,
        startDate: date.formatDate(this.startDate, 'YYYY-MM-DD HH:mm'),
        repeatOn: repeatOn
      })
      this.isSet = true
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
