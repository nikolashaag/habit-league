<template>
  <q-layout class="background bg-dark" view="lHh Lpr lFf">
    <q-page-container>
      <transition name="slide-left">
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MyLayout',
  components: {
  },
  data() {
    return {
    }
  },
  watch: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.background {
}

</style>
