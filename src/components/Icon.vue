<template>
  <div>
    <div v-if="emojiToggle">{{getIconName(icon)}}</div>
    <q-icon
      v-if="!emojiToggle"
      :name="getIconName(icon)"
      size="sm"
      class="category-icon"
    ></q-icon>
  </div>
</template>

<style>
</style>

<script>
import { EMOJI_MAP, ICON_MAP } from '../helpers/constants'

export default {
  name: 'Icon',
  data() {
    return {
      noteProgress: false,
      // easily revert back to icons if we get annoyed by emojis
      emojiToggle: true,
      complete: true
    }
  },
  props: ['icon'],
  methods: {
    getIconName: function(value) {
      return this.emojiToggle ? EMOJI_MAP[value] : ICON_MAP[value]
    }
  }
}
</script>
