<template>
  <q-card class="template" @click="onTemlateClick">
    <div class="row">
      <div class="icon col-xs-2 col-sm-2 col-md-2">
        <q-icon
          :name="getIconName(challenge.icon)"
          size="md"
          class="category-icon"
        ></q-icon>
      </div>
      <div class="text col-xs-8 col-sm-8 col-md-8">
        <h5>{{ challenge.title }}</h5>
        <p>{{ challenge.description }}</p>
      </div>
      <div class="add col-xs-2 col-sm-2 col-md-2">
        <q-icon name="fas fa-plus" size="md" class="category-icon"></q-icon>
      </div>
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
  margin-left: 2rem;
  margin-bottom: 1rem;
  height: 4rem;

  .row {
    height: 100%;
  }

  h5,
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
