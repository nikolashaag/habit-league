<template>
  <q-page class="flex flex-center">
    <div class="sign-up text-white">
      <img src="~assets/flamenco-sign-up.png" />
      <q-btn
        icon-right="fab fa-google"
        color="red"
        size="lg"
        label="Sign in with Gmail"
        class="google-signup"
        @click="socialLogin"
      />
      <p>
        or create an account using your email address
      </p>
      <q-input
        color="amber"
        standout
        dark
        v-model="email"
        label="Email"
        type="text"
        :error="Boolean(emailError)"
      >
        <template v-slot:error>
          {{ emailError }}
        </template>
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
        <template v-slot:error>
          {{ passwordError }}
        </template>
      </q-input>
      <div v-if="error" class="error">
        <br />
        {{ error }}
      </div>
      <q-btn
        color="amber"
        size="lg"
        label="Sign Up"
        class="sign-up-button text-dark"
        @click="signUp"
      />
      <p class="login-link">
        Already have an account? Then you can use the
        <router-link class="text-amber" to="/login"> login</router-link>.
      </p>
    </div>
  </q-page>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'signUp',
  data() {
    return {
      email: '',
      password: '',
      error: null,
      passwordError: null,
      emailError: null
    }
  },
  methods: {
    signUp: function() {
      this.emailError = null
      this.passwordError = null
      this.error = null

      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            console.log('user', user)
            this.$store.dispatch('user/saveUser', user.user)

            this.$store.commit('user/setUser', {
              ...user.additionalUserInfo.profile,
              uid: user.user.uid
            })
            this.$router.replace('/weekly')
          },
          err => {
            if (err.message.indexOf('email') > -1) {
              this.emailError = err.message
            } else if (err.message.toLowerCase().indexOf('password') > -1) {
              this.passwordError = err.message
            } else {
              this.error = err.message
            }
          }
        )
    },
    socialLogin() {
      const provider = new firebase.auth.GoogleAuthProvider()
      provider.addScope('https://www.googleapis.com/auth/calendar')
      firebase
        .auth()
        // .signInWithPopup(provider)
        // For android signInWithPopup is not possible
        .signInWithRedirect(provider)
        .then(function() {
          return firebase.auth().getRedirectResult()
        })
        .then(result => {
          console.log('google success saveUser', result)
          console.log('prevRoute', this.prevRoute)
          const googleToken = result.credential.accessToken
          console.log('user', { ...result.user, googleToken })
          this.$store.dispatch('user/saveUser', { ...result.user, googleToken })

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
.sign-up {
  width: 90%;
  max-width: 360px;
  padding-top: 16px;

  img {
    height: 200px;
    width: 100%;
    object-fit: contain;
  }
}
input {
  margin: 10px 0;
  width: 20%;
  padding: 15px;
}
button {
  cursor: pointer;
  width: 100%;
  margin-bottom: 40px;
}
span {
  display: block;
  margin-top: 20px;
  font-size: 11px;
}

.error {
  color: $red-8;
}

h4 {
  text-align: center;
  margin: 0 0 32px 0;
}

.google-signup {
  margin-top: 10px;
}

.login-link {
  margin-bottom: 16px;
}
</style>
