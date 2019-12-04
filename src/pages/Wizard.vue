<template>
  <q-page class>
    <div class="q-pa-md wizard">
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-stepper
          v-model="step"
          ref="stepper"
          color="primary"
          vertical
          animated
          dark
          class="bg-dark stepper-custom"
          active-color="secondary"
          done-color="secondary"
        >
          <q-step
            :name="1"
            title="Select a habit"
            icon="settings"
            :done="step > 1"
            class="dialog-inside"
          >
            <q-card
              class="template-category physical-health"
              v-if="!expandedCategory || expandedCategory === 'physical-health'"
              @click="() => expandCategory('physical-health')"
            >
              <div class="title">Physical health</div>
            </q-card>
            <div
              class="templates"
              v-if="expandedCategory === 'physical-health'"
            >
              <challenge-template
                :onTemlateClick="() => templateClick(value)"
                v-for="(value, key) in getTemplates('physical-health')"
                :challenge="value"
                :key="key"
              />
              <challenge-template
                :onTemlateClick="customClick"
                :challenge="{
                  title: 'Custom habit',
                  description: 'Define your own habit',
                  icon: 'question'
                }"
              />
            </div>
            <q-card
              class="template-category mental-health"
              v-if="!expandedCategory || expandedCategory === 'mental-health'"
              @click="() => expandCategory('mental-health')"
            >
              <div class="title">Mental health</div>
            </q-card>
            <div
              class="templates"
              v-if="expandedCategory === 'mental-health'"
            >
              <challenge-template
                :onTemlateClick="() => templateClick(value)"
                v-for="(value, key) in getTemplates('mental-health')"
                :challenge="value"
                :key="key"
              />
              <challenge-template
                :onTemlateClick="customClick"
                :challenge="{
                  title: 'Custom habit',
                  description: 'Define your own habit',
                  icon: 'question'
                }"
              />
            </div>
            <q-card
              class="template-category relationships"
              v-if="!expandedCategory || expandedCategory === 'relationships'"
              @click="() => expandCategory('relationships')"
            >
              <div class="title">Relationships</div>
            </q-card>
            <div
              class="templates"
              v-if="expandedCategory === 'relationships'"
            >
              <challenge-template
                :onTemlateClick="() => templateClick(value)"
                v-for="(value, key) in getTemplates('relationships')"
                :challenge="value"
                :key="key"
              />
              <challenge-template
                :onTemlateClick="customClick"
                :challenge="{
                  title: 'Custom habit',
                  description: 'Define your own habit',
                  icon: 'question'
                }"
              />
            </div>
            <q-card
              class="template-category career"
              v-if="!expandedCategory || expandedCategory === 'career'"
              @click="() => expandCategory('career')"
            >
              <div class="title">Career</div>
            </q-card>
            <div
              class="templates"
              v-if="expandedCategory === 'career'"
            >
              <challenge-template
                :onTemlateClick="() => templateClick(value)"
                v-for="(value, key) in getTemplates('career')"
                :challenge="value"
                :key="key"
              />
              <challenge-template
                :onTemlateClick="customClick"
                :challenge="{
                  title: 'Custom habit',
                  description: 'Define your own habit',
                  icon: 'question'
                }"
              />
            </div>
            <q-card
              class="template-category hobbies"
              v-if="!expandedCategory || expandedCategory === 'hobbies'"
              @click="() => expandCategory('hobbies')"
            >
              <div class="title">Hobbies</div>
            </q-card>
            <div
              class="templates"
              v-if="expandedCategory === 'hobbies'"
            >
              <challenge-template
                :onTemlateClick="() => templateClick(value)"
                v-for="(value, key) in getTemplates('hobbies')"
                :challenge="value"
                :key="key"
              />
              <challenge-template
                :onTemlateClick="customClick"
                :challenge="{
                  title: 'Custom habit',
                  description: 'Define your own habit',
                  icon: 'question'
                }"
              />
            </div>
          </q-step>
          <q-step
            :name="2"
            title="Habit settings"
            icon="settings"
            :done="step > 2"
            class="dialog-inside"
          >
            <label for="title"
              >Select how the challenge should look like.How ofte do you want to
              do this habit? Select the frequency.</label
            >
            <div class="spacing"></div>
            <div class="row">
              <label for>Title</label>
            </div>
            <q-input
              :rules="[val => !!val || 'Field is required']"
              dark
              standout
              v-model="title"
              label="Habit Name"
            />
            <div class="row">
              <label for>Description (optional)</label>
            </div>
            <q-input
              dark
              standout
              v-model="description"
              label="Remember your 'why?'"
            />
            <div class="spacing"></div>
            <div class="row">
              <label for>Choose frequency</label>
            </div>
            <q-select
              dark
              standout
              v-model="frequency"
              :options="frequencyValues"
              label="Frequency"
            />

            <div class="spacing"></div>

            <q-option-group
              v-if="frequency.value === 'specific'"
              :options="days"
              dark
              label="Choose days"
              type="checkbox"
              v-model="specificDays"
            />
            <q-select
              dark
              standout
              v-if="frequency.value === 'per-week'"
              v-model="perWeek"
              :options="perWeekOptions"
              label="Days per Week"
            />
            <q-select
              dark
              standout
              v-if="frequency.value === 'per-month'"
              v-model="perMonth"
              :options="perMonthOptions"
              label="Days per Month"
            />
            <div class="row">
              <label for>Category</label>
            </div>
            <q-select
              dark
              standout
              v-model="category"
              :options="categoryValues"
              label="Category"
            />
            <div class="spacing"></div>

            <div class="row">
              <label for>Icon</label>
            </div>
            <q-select
              dark
              standout
              v-model="icon"
              :options="icons"
              label="Icon"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
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
            :name="3"
            title="Make it a challenge"
            icon="create_new_folder"
            :done="step > 3"
          >
            <div class="row">
              <label
                >Select a goal for the challenge to stay motivated. How long
                should it last? What will the winner get?</label
              >
            </div>
            <q-input
              dark
              standout
              v-model="startDate"
              mask="date"
              :rules="['date']"
              label="Start date"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="startDate"
                      @input="() => $refs.qDateProxy.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-select
              dark
              standout
              v-model="challengeDuration"
              :options="challengeDurationOptions"
              label="Challenge duration"
            />
            <div class="spacing"></div>
            <q-input
              v-if="challengeDuration === 'Custom'"
              dark
              standout
              v-model="duration"
              label="Custom duration (number of days)"
            />
            <q-input
              dark
              standout
              v-model="stake"
              label="Stake or reward (Optional)"
            />
            <div class="spacing"></div>
          </q-step>

          <q-step
            :name="4"
            title="Set privacy"
            icon="assignment"
            :done="step > 4"
          >
            Set the privacy of the challenge. Will it be only for you and your
            friends? Or make it public and let anybody in the world join in.
            <div class="q-gutter-sm">
              <q-radio v-model="privacy" val="private" label="Private" />
              <q-radio v-model="privacy" val="public" label="Public" />
            </div>
          </q-step>

          <template v-slot:navigation>
            <q-stepper-navigation>
              <q-btn
                v-if="step !== 4"
                @click="$refs.stepper.next()"
                color="amber"
                label="Continue"
                class="text-dark"
              />
              <q-btn
                @click="onSubmit"
                v-if="step === 4"
                color="amber"
                class="text-dark"
                label="Finish"
              />
              <q-btn
                v-if="step > 1"
                flat
                color="amber"
                @click="$refs.stepper.previous()"
                label="Back"
                class="q-ml-sm float-right"
              />
            </q-stepper-navigation>
          </template>
        </q-stepper>
      </q-form>
    </div>
  </q-page>
</template>

<style></style>

<script>
import { ICON_MAP, CATEGORY_MAP } from '../helpers/constants'
import { HABIT_TEMPLATES } from '../helpers/templates'
import { date } from 'quasar'
import ChallengeTemplate from 'components/ChallengeTemplate.vue'

export default {
  name: 'Wizard',
  components: {
    ChallengeTemplate
  },
  computed: {
    isEditMode: {
      get() {
        return this.$route.query.edit
      }
    },
    getTemplates() {
      return category => HABIT_TEMPLATES[category]
    },
    activeHabit: {
      get() {
        return this.$store.state.app.activeChallenge
      }
    }
  },
  created() {
    if (this.isEditMode) {
      this.prefillChallenge()
    }
  },
  mounted() {
    if (this.isEditMode) {
      this.$refs.stepper.next()
    }
  },
  data() {
    return {
      step: 1,
      expandedCategory: null,
      title: '',
      iconMap: ICON_MAP,
      description: '',
      frequency: { label: 'Daily', value: 'daily' },
      frequencyValues: [
        { label: 'Daily', value: 'daily' },
        { label: 'Per Week', value: 'per-week' },
        { label: 'Per Month', value: 'per-month' },
        { label: 'Specific Days', value: 'specific' }
      ],
      specificDays: [],
      icons: [
        { label: 'Exercise', value: 'exercise' },
        { label: 'Instrument', value: 'guitar' },
        { label: 'Paint', value: 'paint' },
        { label: 'Write', value: 'writing' },
        { label: 'Meditate', value: 'meditate' },
        { label: 'Journal', value: 'journal' },
        { label: 'Running', value: 'run' },
        { label: 'Bike', value: 'bike' },
        { label: 'Swimming', value: 'swim' },
        { label: 'Sweets', value: 'sweets' },
        { label: 'Drink', value: 'drink' },
        { label: 'Water', value: 'water' },
        { label: 'Coffee', value: 'coffee' },
        { label: 'Sports', value: 'ball' },
        { label: 'Smoking', value: 'smoking' },
        { label: 'Dog', value: 'dog' },
        { label: 'Book', value: 'book' },
        { label: 'Pray', value: 'pray' },
        { label: 'Pills', value: 'pills' },
        { label: 'Food', value: 'food' },
        { label: 'Friends', value: 'friends' },
        { label: 'Veggetables', value: 'veggetables' },
        { label: 'Fruits', value: 'fruits' },
        { label: 'Money', value: 'money' },
        { label: 'Business', value: 'business' },
        { label: 'Music', value: 'listen' },
        { label: 'Cleaning', value: 'clean' },
        { label: 'Shower', value: 'shower' },
        { label: 'Gaming', value: 'gaming' },
        { label: 'Coding', value: 'coding' },
        { label: 'Phone', value: 'phone' },
        { label: 'Smartphone', value: 'smartphone' },
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
      category: { label: 'Physical Health', value: 'physical-health' },
      categoryValues: CATEGORY_MAP,
      icon: { label: 'Journal', value: 'journal' },
      perWeekOptions: [1, 2, 3, 4, 5, 6, 7],
      perMonthOptions: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20
      ],
      challengeDurationOptions: [
        '1 Week',
        '2 Weeks',
        '3 Weeks',
        '1 Month',
        '3 Months',
        'Custom'
      ],
      challengeDuration: '1 Month',
      duration: '',
      startDate: date.formatDate(new Date(), 'YYYY/MM/DD'),
      stake: '',
      privacy: 'private',
      errors: []
    }
  },
  methods: {
    prefillChallenge(challenge) {
      const challengeToFill = challenge || this.activeHabit
      for (let key in challengeToFill) {
        if (key === 'duration') {
          this.prefillDuration(challengeToFill[key])
        } else if (key === 'icon') {
          this[key] = this.icons.find(
            icon => icon.value === challengeToFill[key]
          )
        } else if (key === 'frequency') {
          this[key] = this.frequencyValues.find(
            icon => icon.value === challengeToFill[key]
          )
        } else if (key === 'category') {
          this[key] = this.categoryValues.find(
            icon => icon.value === challengeToFill[key]
          )
        } else {
          this[key] =
            (challengeToFill.hasOwnProperty(key) && challengeToFill[key]) ||
            ''
        }
      }
    },
    expandCategory(category) {
      if (this.expandedCategory) {
        this.expandedCategory = null
      } else {
        this.expandedCategory = category
      }
    },
    getDuration() {
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
    prefillDuration(duration) {
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
    templateClick(challenge) {
      for (let key in challenge) {
        this[key] = challenge[key]
      }
      this.prefillChallenge(challenge)
      this.$refs.stepper.goTo(4)
    },
    customClick(challenge) {
      this.$refs.stepper.next()
    },
    onSubmit(e) {
      if (this.title && this.frequency && this.privacy) {
        if (
          this.frequency.value === 'specific' &&
          this.specificDays.length === 0
        ) {
          this.errors.push('Select at least 1 day.')
        } else if (this.frequency.value === 'per-week' && !this.perWeek) {
          this.errors.push('Select at least 1 day per week.')
        } else if (this.frequency.value === 'per-month' && !this.perMonth) {
          this.errors.push('Select at least 1 day per month.')
        } else {
          console.log('no validation problem')

          const challenge = {
            title: this.title,
            description: this.description,
            frequency: this.frequency.value,
            specificDays: this.specificDays,
            perWeek: this.perWeek,
            perMonth: this.perMonth,
            duration: this.getDuration(),
            startDate: this.startDate,
            stake: this.stake,
            privacy: this.privacy,
            category: this.category.value,
            icon: this.icon.value,
            author: this.$store.state.user.currentUser.displayName,
            members: [
              {
                name: this.$store.state.user.currentUser.displayName,
                id: this.$store.state.user.currentUser.uid,
                completedDays: 0
              }
            ]
          }

          // TODO: throw toast when succesfully added challenge
          if (this.isEditMode) {
            console.log('edit')

            this.$store.dispatch('app/updateChallenge', {
              challenge,
              challengeId: this.activeHabit.id
            })
          } else {
            console.log('no edit')

            this.$store.dispatch('app/addChallenge', challenge)
          }
          this.$router.push({ path: '/weekly' })
          return true
        }
      }

      e.preventDefault()
    },
    onReset() {}
  }
}
</script>

<style lang="scss">
.wizard {
  padding-bottom: 52px;

  .stepper-custom {
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.12);
    border: none;
  }
}

.add-button {
  position: absolute;
  bottom: 50px;
  right: 50px;
}

.stepper {
  background: linear-gradient(to left, #3a404d, #181c26);
}

.spacing {
  height: 16px;
  width: 100%;
}
label {
  margin-bottom: 16px;
}

// .q-stepper__step-inner {
//   padding: 16px !important;
// }

.q-stepper__tab {
  justify-content: flex-start !important;
}

.template-category {
  height: 100px;
  width: 100%;
  background-size: auto 142%;
  background-color: rgba(255, 255, 255, 0.07);
  background-repeat: no-repeat;
  background-origin: 0;
  background-position: 105% 35%;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;

  .title {
    margin-left: -120px;
    margin-left: -100px;
    font-size: 24px;
  }

  &.physical-health {
    background-image: url('~assets/marginalia-downloading.png');
  }
  &.mental-health {
    background-image: url('~assets/marginalia-come-back-later.png');
  }
  &.relationships {
    background-image: url('~assets/marginalia-sign-in.png');
  }
  &.career {
    background-image: url('~assets/marginalia-logged-out.png');
  }
  &.hobbies {
    background-image: url('~assets/marginalia-searching.png');
  }
}

.templates {
}
</style>
