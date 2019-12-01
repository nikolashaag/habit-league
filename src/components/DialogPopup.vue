<template>
  <q-dialog v-model="localModel">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{title}}</div>
      </q-card-section>
      <q-card-section v-if="description">
        {{description}}
      </q-card-section>
      <q-card-actions :align="align || 'right'">
        <q-btn v-if="confirm" :label="confirm.label" color="primary" @click="confirm.onClick" v-close-popup />
        <q-btn
          v-if="cancel"
          :label="cancel.label"
          color="primary"
          @click="cancel.onClick"
          v-close-popup
        />
        <slot/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style>
</style>

<script>
export default {
  name: 'DialogPopup',
  props: ['confirm', 'cancel', 'title', 'description', 'model', 'align'],
  computed: {
    localModel: {
      get() {
        return this.model
      },
      set() {}
    }
  }
}
</script>

<style scoped>
</style>
