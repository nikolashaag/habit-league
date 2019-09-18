<template>
  <transition name="fade">
    <q-card-section class="leaderboard">
      Leaderboard:
      <div class="row leaderboard-row" v-for="(member, key) in members" :key="key + 'member'">
        <div class="col-xs-2 col-sm-2 col-md-1">
          <div class="number">{{key + 1}}</div>
        </div>
        <div class="col-xs-4 col-sm-4 col-md-2">
          <div class="name">{{getDisplayName(member.id)}}</div>
        </div>
        <div class="col-xs-6 col-sm-6 col-md-3">
          <div class="status">Completed days: {{member.completedDays}}</div>
        </div>
      </div>
    </q-card-section>
  </transition>
</template>

<script>
export default {
  name: 'leader-board',
  props: ['members'],
  methods: {
    getDisplayName: function(id) {
      return this.$store.state.user.users.find(user => user.uid === id)
        .displayName
    }
  }
}
</script>

<style lang="scss" scoped>
.leaderboard {
  max-height: 174px;
  transition: all 0.2s ease-in-out;
}
.leaderboard-row {
  width: calc(100% + 32px);
  height: 48px;
  line-height: 48px;
  margin-left: -16px;
}
.leaderboard-row:nth-child(1) {
  background: #ffc107;
}
.leaderboard-row:nth-child(2) {
  background: #ffb300;
}
.leaderboard-row:nth-child(3) {
  background: #ffa000;
}
.leaderboard-row:nth-child(4) {
  background: #ff8f00;
}
.leaderboard-row:nth-child(5) {
  background: #ff5a04;
}

.number {
  background: white;
  color: black;
  text-align: center;
  border-radius: 50%;
  padding: 0;
  min-height: 0;
  height: 2rem;
  width: 2rem;
  min-width: 2rem;
  min-height: 2rem;
  margin-left: 1rem;
  margin-top: 0.5rem;
  line-height: 2rem;
  margin-left: 16px;
}
</style>
