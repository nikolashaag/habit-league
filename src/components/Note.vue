<template>
  <div class="doc-note doc-note--warning">
    <p class="doc-note__title">{{title}}</p>
    <slot/>
    <q-btn @click="onClose" class="doc-note__close" flat dense round icon="close" />
  </div>
</template>

<style>
</style>

<script>
export default {
  name: 'Note',
  props: ['text', 'onClose', 'title']

}
</script>

<style lang="scss" scoped>
.doc-note {
  background-color: #eee;
  border-radius: 4px;
  margin: 16px 0;
  padding: 16px 24px;
  font-size: 1em;
  border-width: 0 5px 0;
  border-style: solid;
  border-color: #9e9e9e;
  letter-spacing: 0.5px;
  position: relative;

  &__title {
    font-weight: 500;
  }

  &--warning {
    background-color: #f9e09b;
    border-color: #f2c037;
  }
  p {
    margin-bottom: 0;
  }
  &__close {
    position: absolute;
    right: 6px;
    top: 6px;
  }
}
</style>
