<template>
  <q-page class="">
    <div class="q-pa-md">
        <q-stepper
          v-model="step"
          vertical
          color="primary"
          animated
        >
          <q-form
            @submit="onSubmit"
            @reset="onReset"
            class="q-gutter-md"
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
              <q-input outlined v-model="title" label="Habit title" />
              <q-input outlined v-model="description" label="Description (Optional)" />
              <div class="row">
                frequency

              </div>
              <q-btn-toggle
                v-model="frequency"
                toggle-color="primary"
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
                label="Choose days"
                type="checkbox"
                v-model="specificDays"
              />
              <q-select v-if="frequency === 'per-week'" outlined v-model="perWeek" :options="perWeekOptions" label="Days per Week" />
              <q-select v-if="frequency === 'per-month'" outlined v-model="perMonth" :options="perMonthOptions" label="Days per Month" />

              <q-stepper-navigation>
                <q-btn @click="step = 2" color="primary" label="Continue" />
              </q-stepper-navigation>
            </q-step>

            <q-step
              :name="2"
              title="Select a goal for the challange"
              icon="create_new_folder"
              :done="step > 2"
            >
              Select a goal for the challenge to stay motivated. How long should it last? What will the winner get?
              <q-input filled v-model="startDate" mask="date" :rules="['date']">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="startDate" @input="() => $refs.qDateProxy.hide()" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input outlined v-model="duration" label="Challenge duration" />
              <q-input outlined v-model="stake" label="Stake (Optional)" />

              <q-stepper-navigation>
                <q-btn @click="step = 3" color="primary" label="Continue" />
                <q-btn flat @click="step = 1" color="primary" label="Back" class="q-ml-sm" />
              </q-stepper-navigation>
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

              <q-stepper-navigation>
                <q-btn @click="step = 4" color="primary" label="Continue" />
                <q-btn flat @click="step = 2" color="primary" label="Back" class="q-ml-sm" />
              </q-stepper-navigation>
            </q-step>

            <q-step
              :name="4"
              title="Finish"
              icon="add_comment"
            >
              Your challenge is ready to go. Good luck

              <q-stepper-navigation>
                <!-- <router-link to="/"> -->
                  <q-btn type="submit" color="primary" label="Finish" />
                <!-- </router-link> -->
                <q-btn flat @click="step = 3" color="primary" label="Back" class="q-ml-sm" />
              </q-stepper-navigation>
            </q-step>
            </q-form>
        </q-stepper>
      </div>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'Wizard',
  data () {
    return {
      step: 1,
      title: '',
      description: '',
      frequency: null,
      specificDays: [],
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
            privacy: this.privacy
          }
          console.log('app/addChallenge', challenge)
          this.$store.commit('app/addChallenge', challenge)
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
  }
}
</script>

<style>
.add-button {
  position: absolute;
  bottom: 50px;
  right: 50px;
}
</style>
