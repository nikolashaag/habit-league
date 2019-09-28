<template>
  <div>
    <div class="spacing"></div>
    <div class="add-button">
      <router-link to="/create">
        <q-btn  class="pluss" size="xl" round color="amber" text-color="black"><span class="plus">+</span></q-btn>
      </router-link>
    </div>
  </div>
</template>

<style>
</style>

<script>

export default {
  name: 'AddButton'
}
</script>

<style scoped>
.add-button {
  position: fixed;
  bottom: 64px;
  right: 16px;
  z-index: 3;
}

.spacing {
  height: 150px;
  width: 100px;
}

.plus {
  font-size: 36px;
}
</style>
