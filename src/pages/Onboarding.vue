<template>
  <q-page class="welcome">
    <q-carousel
      v-model="slide"
      transition-prev="slide-right"
      transition-next="slide-left"
      swipeable
      animated
      control-color="dark"
      navigation
      class="carousel"
    >
      <q-carousel-slide name="first" class="first column no-wrap flex-center">
        <img src="~assets/flamenco-waiting.png" />
        <div class="heading">
          <span>It's time to build </span><b>some habits!</b>
        </div>

        <div class="paragraph">
          <p>Are you ready?<br />We gonna help get better step by step!</p>
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="second" class="second column no-wrap flex-center">
        <div class="heading">
          <span>You can work on your habits </span>
        </div>
        <img src="~assets/flamenco-strong.png" style="width:90vw;" />

        <div class="heading">
          <b>alone...</b>
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="third" class="third column no-wrap flex-center">
        <img src="~assets/flamenco-group.png" style="width:90vw;" />

        <div class="heading">
          <span>It's time to build </span><b>some habits!</b>
        </div>
        <div class="paragraph">
          <p>Are you ready?<br />We gonna help get better step by step!</p>
        </div>
      </q-carousel-slide>
    </q-carousel>
    <q-btn
      color="dark"
      size="lg"
      label="Continue"
      class="continue-button text-white"
      @click="next"
    >
      <q-icon right size="1em" name="fas fa-arrow-right" />
    </q-btn>
  </q-page>
</template>

<style></style>

<script>
export default {
  name: 'InvitePage',
  components: {},
  computed: {},
  created() {},
  data() {
    return {
      slide: 'first'
    }
  },
  methods: {
    next: function() {
      console.log('this.slide', this.slide)
      if (this.slide === 'second') {
        this.slide = 'third'
      } else {
        this.slide = 'second'
      }
    }
  }
}
</script>

<style lang="scss">
.wrapper {
  width: 100%;
}

.welcome {
  background-color: #fee083;
  padding: 5%;
  color: #1f1f1f;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  img {
    max-height: 50vh;
  }

  .heading {
    text-align: center;
    font-size: 32px;

    b {
      font-size: 48px;
      display: inline-block;
      line-height: 42px;
    }
  }

  .paragraph {
    padding: 20px 42px 10px 42px;
    text-align: center;

    p {
      font-size: 22px;
    }
  }

  .second {
    .heading {

      b {
        font-size: 54px;
        padding-bottom: 80px;
      }
    }
  }

  .continue-button {
    width: 100%;
    // position: fixed;
    // bottom: 0;
  }

  .carousel {
    height: calc(100% - 51px);
  }
}
</style>
