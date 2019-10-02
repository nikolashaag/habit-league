<template>
  <q-page class="">
    <div class="q-pa-md wizard">
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md"
      >
        <q-stepper
          v-model="step"
          ref="stepper"
          color="primary"
          animated
          dark
          class="stepper"
          active-color="secondary"
          done-color="secondary"
        >
            <q-step
              :name="1"
              title="Habit info"
              icon="settings"
              :done="step > 1"
              class="dialog-inside"
            >
              <label for="title">
                Select how the challenge should look like. You can select one or multiple habits. Select the frequency.
              </label>
              <div class="spacing"></div>
              <q-input :rules="[val => !!val || 'Field is required']" dark standout v-model="title" label="Habit title" />
              <div class="spacing"></div>
              <q-input dark standout v-model="description" label="Description (Optional)" />
              <div class="spacing"></div>
              <div class="row">
                <label for="">
                  Choose frequency
                </label>
              </div>
              <q-btn-toggle
                v-model="frequency"
                toggle-color="primary"
                push
                :options="[
                  {label: 'Daily', value: 'daily'},
                  {label: 'Per Week', value: 'per-week'},
                  {label: 'Per Month', value: 'per-month'},
                  {label: 'Specific Days', value: 'specific'},
                ]"
              />
              <div class="spacing"></div>

              <q-option-group
                v-if="frequency === 'specific'"
                :options="days"
                dark
                label="Choose days"
                type="checkbox"
                v-model="specificDays"
              />
              <q-select dark standout v-if="frequency === 'per-week'" v-model="perWeek" :options="perWeekOptions" label="Days per Week" />
              <q-select dark standout v-if="frequency === 'per-month'" v-model="perMonth" :options="perMonthOptions" label="Days per Month" />
              <div class="row">
                <label for="">
                  Choose category
                </label>
              </div>

              <q-btn-toggle
                v-model="category"
                toggle-color="primary"
                push
                :options="[
                  {label: 'Physical Health', value: 'physical-health'},
                  {label: 'Mental Health', value: 'mental-health'},
                  {label: 'Relationships', value: 'relationships'},
                  {label: 'Career', value: 'career'},
                  {label: 'Hobbies', value: 'hobbies'}
                ]"
              />
              <div class="spacing"></div>

              <div class="row">
                <label for="">
                  Choose icon
                </label>
              </div>
              <q-select
                dark
                standout
                v-model="icon"
                :options="icons"
                label="Icon"
              >
                <template v-slot:option="scope">
                  <q-item
                    v-bind="scope.itemProps"
                    v-on="scope.itemEvents"
                  >
                    <q-item-section avatar>
                      <q-icon :name="iconMap[scope.opt.value]" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label v-html="scope.opt.label" />
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:append>
                  <q-avatar>
                    <q-icon :name="iconMap[icon.value]" />
                  </q-avatar>
                </template>
              </q-select>
            </q-step>

            <q-step
              :name="2"
              title="Make it a challenge"
              icon="create_new_folder"
              :done="step > 2"
            >
              <div class="row">
                <label>
                  Select a goal for the challenge to stay motivated. How long should it last? What will the winner get?
                </label>
              </div>
              <q-input dark standout v-model="startDate" mask="date" :rules="['date']" label="Start date" >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="startDate" @input="() => $refs.qDateProxy.hide()" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-select dark standout v-model="challengeDuration" :options="challengeDurationOptions" label="Challenge duration" />
              <div class="spacing"></div>
              <q-input v-if="challengeDuration === 'Custom'" dark standout v-model="duration" label="Custom duration (number of days)" />
              <q-input dark standout v-model="stake" label="Stake or reward (Optional)" />
              <div class="spacing"></div>

            </q-step>

            <q-step
              :name="3"
              title="Set privacy"
              icon="assignment"
              :done="step > 3"
            >
              Set the privacy of the challenge. Will it be only for you and your friends? Or make it public and let anybody in the world join in.
                <div class="q-gutter-sm">
                  <q-radio v-model="privacy" val="private" label="Private" />
                  <q-radio v-model="privacy" val="public" label="Public" />
                </div>
            </q-step>

            <!-- <q-step
              :name="4"
              title="Finish"
              icon="add_comment"
            >
              Your challenge is ready to go. Good luck
            </q-step> -->
            <template v-slot:navigation>
              <q-stepper-navigation>
                <q-btn v-if="step !== 3" @click="$refs.stepper.next()" color="amber" label="Continue" />
                <q-btn type="submit" v-if="step === 3" color="amber" label="Finish" />
                <q-btn v-if="step > 1" flat color="amber" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
              </q-stepper-navigation>
            </template>
        </q-stepper>
      </q-form>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import { ICON_MAP } from '../helpers/constants'
import { date } from 'quasar'

export default {
  name: 'Wizard',
  computed: {
    isEditMode: {
      get () {
        return this.$route.query.edit
      }
    },
    activeHabit: {
      get () {
        return this.$store.state.app.activeChallenge
      }
    }
  },
  created () {
    if (this.isEditMode) {
      for (let key in this.activeHabit) {
        if (key === 'duration') {
          this.prefillDuration(this.activeHabit[key])
        } else if (key === 'icon') {
          this[key] = this.icons.find(icon => icon.value === this.activeHabit[key])
        } else {
          this[key] = (this.activeHabit.hasOwnProperty(key) && this.activeHabit[key]) || ''
        }
      }
    }
  },
  data () {
    return {
      step: 1,
      title: '',
      iconMap: ICON_MAP,
      description: '',
      frequency: 'daily',
      specificDays: [],
      icons: [
        { label: 'Exercise', value: 'exercise' },
        { label: 'Meditate', value: 'meditate' },
        { label: 'Journal', value: 'journal' },
        { label: 'Running', value: 'run' },
        { label: 'Bike', value: 'bike' },
        { label: 'Swimming', value: 'swim' },
        { label: 'Sweets', value: 'sweets' },
        { label: 'Drink', value: 'drink' },
        { label: 'Coffee', value: 'coffee' },
        { label: 'Sports', value: 'ball' },
        { label: 'Smoking', value: 'smoking' },
        { label: 'Dog', value: 'dog' },
        { label: 'Book', value: 'book' },
        { label: 'Pray', value: 'pray' },
        { label: 'Pills', value: 'pills' },
        { label: 'Food', value: 'food' },
        { label: 'Veggetables', value: 'veggetables' },
        { label: 'Fruits', value: 'fruits' },
        { label: 'Money', value: 'money' },
        { label: 'Business', value: 'business' },
        { label: 'Music', value: 'listen' },
        { label: 'Cleaning', value: 'clean' },
        { label: 'Shower', value: 'shower' },
        { label: 'Gaming', value: 'gaming' },
        { label: 'Coding', value: 'coding' },
        { label: 'Sleep', value: 'sleep' }
      ],
      days: [
        {
          label: 'Monday',
          value: 'monday',
          color: 'teal'
        },
        {
          label: 'Tuesday',
          value: 'tuesday',
          color: 'green'
        },
        {
          label: 'Wednesday',
          value: 'wednesday',
          color: 'red'
        },
        {
          label: 'Thursday',
          value: 'thursday',
          color: 'orange'
        },
        {
          label: 'Friday',
          value: 'friday',
          color: 'blue'
        },
        {
          label: 'Saturday',
          value: 'saturday',
          color: 'teal'
        },
        {
          label: 'Sunday',
          value: 'sunday',
          color: 'green'
        }
      ],
      perWeek: null,
      perMonth: null,
      category: 'physical-health',
      icon: { label: 'Journal', value: 'journal' },
      perWeekOptions: [1, 2, 3, 4, 5, 6, 7],
      perMonthOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      challengeDurationOptions: ['1 Week', '2 Weeks', '3 Weeks', '1 Month', '3 Months', 'Custom'],
      challengeDuration: '1 Month',
      duration: '',
      startDate: date.formatDate(new Date(), 'YYYY/MM/DD'),
      stake: '',
      privacy: 'private',
      errors: []
    }
  },
  methods: {
    getDuration () {
      switch (this.challengeDuration) {
        case '1 Week':
          return 7
        case '2 Weeks':
          return 14
        case '3 Weeks':
          return 21
        case '1 Month':
          return 31
        case '3 Months':
          return 92
        case 'Custom':
          return this.duration
      }
    },
    prefillDuration (duration) {
      switch (duration) {
        case 7:
          this.challengeDuration = '1 Week'
          break
        case 14:
          this.challengeDuration = '2 Weeks'
          break
        case 21:
          this.challengeDuration = '3 Weeks'
          break
        case 31:
          this.challengeDuration = '1 Month'
          break
        case 92:
          this.challengeDuration = '3 Months'
          break
        default:
          this.challengeDuration = 'Custom'
          this.duration = duration
      }
    },
    onSubmit (e) {
      if (this.title && this.frequency && this.privacy) {
        if (this.frequency === 'specific' && this.specificDays.length === 0) {
          this.errors.push('Select at least 1 day.')
        } else if (this.frequency === 'per-week' && !this.perWeek) {
          this.errors.push('Select at least 1 day per week.')
        } else if (this.frequency === 'per-month' && !this.perMonth) {
          this.errors.push('Select at least 1 day per month.')
        } else {
          const challenge = {
            title: this.title,
            description: this.description,
            frequency: this.frequency,
            specificDays: this.specificDays,
            perWeek: this.perWeek,
            perMonth: this.perMonth,
            duration: this.getDuration(),
            startDate: this.startDate,
            stake: this.stake,
            privacy: this.privacy,
            category: this.category,
            icon: this.icon.value,
            author: this.$store.state.user.currentUser.displayName,
            members: [{
              name: this.$store.state.user.currentUser.displayName,
              id: this.$store.state.user.currentUser.uid,
              completedDays: 0
            }]
          }
          if (this.isEditMode) {
            this.$store.dispatch('app/updateChallenge', {
              challenge,
              challengeId: this.activeHabit.id
            })
          } else {
            this.$store.dispatch('app/addChallenge', challenge)
          }
          this.$router.push({ path: '/' })
          return true
        }
      }

      e.preventDefault()
    },
    onReset () {
    }
  }
}
</script>

<style>
.wizard {
  margin-bottom: 52px;
}

.add-button {
  position: absolute;
  bottom: 50px;
  right: 50px;
}

.stepper {
  background: linear-gradient(to left, #3a404d, #181c26)
}

.spacing {
  height: 16px;
  width: 100%;
}
label {
  margin-bottom: 16px;
}

.q-stepper__step-inner {
  padding: 16px !important;
}
</style>
