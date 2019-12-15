<template>
  <transition name="fade">
    <q-card-section :class="`leaderboard rows-${activeMembers.length}`">
      <div class="row leaderboard-heading">
        <div class="col-xs-2 col-sm-2 col-md-1">
          <div class="">Order</div>
        </div>
        <div class="col-xs-4 col-sm-4 col-md-2">
          <div class="">{{ activeMembers.length === 1 ? '' : 'Name' }}</div>
        </div>
        <div class="col-xs-2 col-sm-2 col-md-2">
          <div class="">Score</div>
        </div>
        <div class="col-xs-2 col-sm-2 col-md-2">
          <div class="">Days</div>
        </div>
        <div class="col-xs-2 col-sm-2 col-md-2">
          <div class="">Streak</div>
        </div>
      </div>
      <div
        class="row leaderboard-row"
        v-for="(member, key) in activeMembers"
        :key="key + 'member'"
      >
        <div class="col-xs-2 col-sm-2 col-md-1">
          <div class="number">{{ activeMembers.length === 1 ? '#' : member.position }}</div>
        </div>
        <div class="col-xs-4 col-sm-4 col-md-2">
          <div class="name">{{ activeMembers.length === 1 ? 'Your stats' : getDisplayName(member.id) }}</div>
        </div>
        <div class="col-xs-2 col-sm-2 col-md-2">
          <div class="status">{{ member.score }} %</div>
        </div>
        <div class="col-xs-2 col-sm-2 col-md-2">
          <div class="status">{{ member.completedDays }}</div>
        </div>
        <div class="col-xs-2 col-sm-2 col-md-2">
          <div class="status">{{ member.bestStreak }}</div>
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
  },
  computed: {
    activeMembers: function() {
      console.log('members', this.members)
      if (this.members.length === 1) {
        return this.members
      }
      return this.members.filter(member => member.completedDays)
    }
  }
}
</script>

<style lang="scss" scoped>
@import './src/css/breakpoints.scss';

.leaderboard {
  max-height: 174px;
  transition: all 0.2s ease-in-out;
  padding-bottom: 0;
  margin-bottom: 2rem;
  color: #1f1f1f;
}
.leaderboard-row {
  width: calc(100% + 32px);
  height: 48px;
  line-height: 48px;
  margin-left: -16px;

  .name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 5px;
  }
}
.rows-2 {
  max-height: (48 * 2)+20px;
}
.rows-3 {
  max-height: (48 * 3)+20px;
}
.rows-4 {
  max-height: (48 * 4)+20px;
}
.rows-5 {
  max-height: (48 * 5)+20px;
}
.rows-6 {
  max-height: (48 * 6)+20px;
}
.leaderboard-row:nth-child(1) {
  background: #ffee00;
}
.leaderboard-row:nth-child(2) {
  background: #ffe600;
}
.leaderboard-row:nth-child(3) {
  background: #f1e102;
}
.leaderboard-row:nth-child(4) {
  background: #ffd207;
}
.leaderboard-row:nth-child(5) {
  background: #ffc107;
}
.leaderboard-row:nth-child(6) {
  background: #ffb300;
}
.leaderboard-row:nth-child(7) {
  background: #ffa000;
}
.leaderboard-row:nth-child(8) {
  background: #ff8f00;
}
.leaderboard-row:nth-child(9) {
  background: #ff5a04;
}
.leaderboard-row:nth-child(10) {
  background: #e40000;
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

  @include iphone5 {
    margin-left: 8px;
  }
}

.status {
  text-align: center;
}

.leaderboard-heading {
  color: #e4e4e4;
  text-align: center;
  width: calc(100% + 32px);
  margin-left: -16px;
}
</style>
