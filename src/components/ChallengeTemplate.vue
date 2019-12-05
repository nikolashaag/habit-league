<template>
  <q-card class="template" @click="onTemlateClick">
    <div class="row">
      <div class="icon col-xs-2 col-sm-2 col-md-2">
        <q-icon
          :name="getIconName(challenge.icon)"
          size="sm"
          class="category-icon"
        ></q-icon>
      </div>
      <div class="text col-xs-10 col-sm-10 col-md-10">
        <h6>{{ challenge.title }}</h6>
        <p>{{ challenge.description }}</p>
      </div>
      <!-- <div class="add col-xs-2 col-sm-2 col-md-2">
        <q-icon name="fas fa-plus" size="sm" class="category-icon"></q-icon>
      </div> -->
    </div>
  </q-card>
</template>

<script>
import { ICON_MAP } from '../helpers/constants'

export default {
  name: 'ChallengeTemplate',
  components: {},
  props: ['challenge', 'onTemlateClick'],
  methods: {
    getIconName: function(value) {
      return ICON_MAP[value]
    }
  }
}
</script>

<style lang="scss" scoped>
.template {
  background-color: rgba(255, 255, 255, 0.07);
  margin-left: 1rem;
  margin-bottom: 1rem;

  .row {
    height: 100%;
  }

  h6,
  p {
    margin: 0;
  }

  .icon,
  .add {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
