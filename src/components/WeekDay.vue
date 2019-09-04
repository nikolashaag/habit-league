<template>
  <div class="weekday">
    <div v-if="line" class="chain"></div>
    <q-btn class="weekday-button" :disabled="day.isInFuture" size="m" round :color="color" text-color="black" @click="e => noteProgressForDay(day, e)">{{day.label}}</q-btn>
  </div>
</template>

<style>
</style>

<script>

export default {
  name: 'Challenge',
  data () {
    return {
      noteProgress: false,
      expanded: false
    }
  },
  props: ['day', 'color', 'noteProgressForDay', 'line']
}
</script>

<style>
.weekday {
  position: relative;
  /* width: 14.2%; */
  /* text-align: right; */
}

.weekday .chain {
  height: 5px;
  width: 200px;
  background-color: green;
  position: absolute;
  top: 50%;
  right: 42px;
}

.weekday-button {
  z-index: 1;
}

</style>
