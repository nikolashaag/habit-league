<template>
  <q-page class="">
    <div class="q-pa-md">
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
          class="bg-grey-10"
          active-color="secondary"
          done-color="secondary"
        >
            <q-step
              :name="1"
              title="Select habits for challange"
              icon="settings"
              :done="step > 1"
            >
              <label for="title">
                Select how the challange should look like. You can select one or multiple habits. Select the frequency.
              </label>
              <div class="spacing"></div>
              <q-input dark standout counter v-model="title" label="Habit title" />
              <q-input dark standout counter v-model="description" label="Description (Optional)" />
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
                  {label: 'Specific Days', value: 'specific'},
                  {label: 'Per Week', value: 'per-week'},
                  {label: 'Per Month', value: 'per-month'}
                ]"
              />
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
                :options="icons"
              >

                <template v-for="(value, key) in icons" v-slot:[value.slot] >
                  <div class="row items-center no-wrap" :key="key">
                    <q-icon right :name="iconMap[value.slot]" />
                  </div>
                </template>
              </q-btn-toggle>
            </q-step>

            <q-step
              :name="2"
              title="Select a goal for the challange"
              icon="create_new_folder"
              :done="step > 2"
            >
              <div class="row">
                <label>
                  Select a goal for the challenge to stay motivated. How long should it last? What will the winner get?
                </label>
              </div>
              <q-input dark standout counter v-model="startDate" mask="date" :rules="['date']" label="Start date" >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="startDate" @input="() => $refs.qDateProxy.hide()" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input dark standout counter v-model="duration" label="Challenge duration" />
              <q-input dark standout counter v-model="stake" label="Stake (Optional)" />
            </q-step>

            <q-step
              :name="3"
              title="Set privacy"
              icon="assignment"
              :done="step > 3"
            >
              Set the privacy of the challenge. Will it be only for you and your friends? Or make it public and let anybody in the world join in.
                <div class="q-gutter-sm">
                  <q-radio v-model="privacy" val="public" label="Public" />
                  <q-radio v-model="privacy" val="private" label="Private" />
                </div>
            </q-step>

            <q-step
              :name="4"
              title="Finish"
              icon="add_comment"
            >
              Your challenge is ready to go. Good luck
            </q-step>
            <template v-slot:navigation>
              <q-stepper-navigation>
                <q-btn v-if="step !== 4" @click="$refs.stepper.next()" color="primary" label="Continue" />
                <q-btn type="submit" v-if="step === 4" color="primary" label="Finish" />
                <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
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

export default {
  name: 'Wizard',
  data () {
    return {
      step: 1,
      title: '',
      iconMap: ICON_MAP,
      description: '',
      frequency: null,
      specificDays: [],
      icons: [
        { label: 'Exercise', value: 'exercise', slot: 'exercise' },
        { label: 'Meditate', value: 'meditate', slot: 'meditate' },
        { label: 'Journal', value: 'journal', slot: 'journal' },
        { label: 'Run', value: 'run', slot: 'run' },
        { label: 'Bike', value: 'bike', slot: 'bike' },
        { label: 'Swim', value: 'swim', slot: 'swim' }
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
      category: '',
      perWeekOptions: [1, 2, 3, 4, 5, 6, 7],
      perMonthOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      duration: '',
      startDate: '2019/08/01',
      stake: '',
      privacy: 'public',
      errors: []
    }
  },
  methods: {
    onSubmit (e) {
      console.log('onsubmit', e)
      if (this.title && this.frequency && this.privacy) {
        if (this.frequency === 'specific' && this.specificDays.length === 0) {
          console.log('specificDays', this.specificDays)
          this.errors.push('Select at least 1 day.')
        } else if (this.frequency === 'per-week' && !this.perWeek) {
          console.log('specificDays', this.specificDays)
          this.errors.push('Select at least 1 day per week.')
        } else if (this.frequency === 'per-month' && !this.perMonth) {
          console.log('specificDays', this.specificDays)
          this.errors.push('Select at least 1 day per month.')
        } else {
          const challenge = {
            title: this.title,
            description: this.description,
            frequency: this.frequency,
            specificDays: this.specificDays,
            perWeek: this.perWeek,
            perMonth: this.perMonth,
            duration: this.duration,
            startDate: this.startDate,
            stake: this.stake,
            privacy: this.privacy,
            category: this.category
          }
          console.log('app/addChallenge', challenge)
          this.$store.dispatch('app/addChallenge', challenge)
          this.$router.push({ path: '/' })
          return true
        }
      }

      // this.errors = [];
      // if (!this.name) {
      //   this.errors.push('Name required.');
      // }
      // if (!this.age) {
      //   this.errors.push('Age required.');
      // }

      // this.$router.push({ path: '/' })
      console.log('errors', this.errors)
      e.preventDefault()
    },
    onReset () {
    }
  },
  created () {
    console.log('this.icons', this.icons)
    console.log('this.icons', this.iconMap)
  }
}
</script>

<style>
.add-button {
  position: absolute;
  bottom: 50px;
  right: 50px;
}

.spacing {
  height: 16px;
  width: 100%;
}
label {
  margin-bottom: 16px;
}
</style>
