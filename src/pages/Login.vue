<template>
  <q-page class="flex flex-center">
    <div class="login">
      <h3>Sign In</h3>
      <q-input
        color="amber"
        standout
        dark
        v-model="email"
        label="Email"
        type="text"
        :error="Boolean(emailError)"
      >
        <template v-slot:error>{{emailError}}</template>
      </q-input>
      <q-input
        color="amber"
        standout
        dark
        v-model="password"
        label="Password"
        type="password"
        :error="Boolean(passwordError)"
      >
        <template v-slot:error>{{passwordError}}</template>
      </q-input>

      <div v-if="error" class="error">
        <br />
        {{error}}
      </div>
      <q-btn color="amber" size="lg" label="Login" class="text-dark" @click="login" />
      <p class="text-white">
        or Sign In with Google
        <br />
        <q-btn
          icon-right="fab fa-google"
          color="red"
          size="lg"
          label="Login with Gmail"
          @click="socialLogin"
        />
      </p>
      <p class="text-white">
        You don't have an account ? You can
        <router-link to="/sign-up">create one</router-link>
      </p>
    </div>
  </q-page>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'login',
  data() {
    return {
      email: '',
      password: '',
      error: null,
      passwordError: null,
      emailError: null,
      prevRoute: null
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.prevRoute = from
    })
  },
  methods: {
    login() {
      this.emailError = null
      this.passwordError = null
      this.error = null

      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
          console.log('prevRoute', this.prevRoute)
          this.$router.replace('/weekly')
        })
        .catch(err => {
          if (err.message.indexOf('email') > -1) {
            this.emailError = err.message
          } else if (err.message.indexOf('password') > -1) {
            this.passwordError = err.message
          } else {
            this.error = err.message
          }
        })
    },
    socialLogin() {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          console.log('google success saveUser', result)
          console.log('prevRoute', this.prevRoute)

          this.$store.dispatch('user/saveUser', result.user)

          this.$router.replace('/weekly')
        })
        .catch(err => {
          alert('Oops. ' + err.message)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 90%;
  max-width: 370px;
}

h3 {
  text-align: center;
  color: #fff;
}
input {
  margin: 10px 0;
  width: 20%;
  padding: 15px;
}
button {
  margin-top: 20px;
  width: 100%;
  cursor: pointer;
}
p {
  margin-top: 40px;
  font-size: 13px;
}
p a {
  text-decoration: underline;
  cursor: pointer;
}

img {
  height: 24px;
}

.error {
  color: $red-8;
}
</style>
