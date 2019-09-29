<template>
  <q-tabs
    inline-label
    switch-indicator
    indicator-color="green"
    class="bg-amber shadow-2 secondary-nav"
  >
    <q-route-tab
      icon="fas fa-calendar-day"
      to="/daily"
      exact
    />
    <q-route-tab
      icon="fas fa-calendar-alt"
      to="/"
      exact
    />
    <q-route-tab
      icon="record_voice_over"
      to="/browse"
      exact
    />
    <q-route-tab
      icon="fas fa-plus"
      to="/create"
      exact
    />
  </q-tabs>
</template>

<style>
</style>

<script>

export default {
  name: 'SecondaryNav'
}
</script>

<style scoped>
.secondary-nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 99;
}
</style>
