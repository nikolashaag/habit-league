<template>
  <div :class="`wrapper flex flex-center ${this.slide}`">
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
        <q-carousel-slide
          name="second"
          class="second column no-wrap flex-center"
        >
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
            <span>...or together with </span><b>your friends</b>
          </div>
        </q-carousel-slide>
        <q-carousel-slide
          name="fourth"
          class="third column no-wrap flex-center"
        >
          <div class="heading">
            <span
              >Let's start by creating an account so your habit data doesn't get
              lost!</span
            >
          </div>
          <img src="~assets/flamenco-success.png" style="width:90vw;" />

          <div class="heading">
            <b>Ready?</b>
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
  </div>
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
      switch (this.slide) {
        case 'second':
          this.slide = 'third'
          break
        case 'third':
          this.slide = 'fourth'
          break
        case 'fourth':
          localStorage && localStorage.setItem('onboardingComplete', true)
          this.$router.push({ path: '/sign-up' })
          break
        default:
          this.slide = 'second'
      }
    }
  }
}
</script>

<style lang="scss">
.wrapper {
  width: 100%;
  background-color: #fee083;

  // &.second {
  //   background-color: #4EB2C2;
  // }
}

.welcome {
  padding: 5% 0;
  color: #232323;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  max-width: 360px;
  width: 90%;

  .q-carousel__slide {
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 70px;
  }
  img {
    max-height: 50vh;
    max-width: 100%;
    object-fit: contain;
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
  }

  .carousel {
    height: calc(100vh - 51px);
  }
}
</style>
