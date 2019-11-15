<template>
  <q-page class="flex flex-center">
    <div class='sign-up text-white'>
      <h3>Create a new account </h3>
      <q-input color="amber" standout dark v-model="email" label="Email" type="text" :error="Boolean(emailError)">
        <template v-slot:error>
          {{emailError}}
        </template>
      </q-input>
      <q-input color="amber" standout dark v-model="password" label="Password" type="password" :error="Boolean(passwordError)">
        <template v-slot:error>
          {{passwordError}}
        </template>
      </q-input>
      <div v-if="error" class="error">
        <br />
        {{error}}
      </div>
      <br />
      <q-btn
        color="amber"
        size="lg"
        label="Sign Up"
        class="sign-up-button text-dark"
        @click='signUp'
      />
      <p>
        or go back to
        <router-link class="text-amber" to='/login'>login</router-link>.
      </p>
    </div>
  </q-page>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'signUp',
  data () {
    return {
      email: '',
      password: '',
      error: null,
      passwordError: null,
      emailError: null
    }
  },
  methods: {
    signUp: function () {
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
    }
  }
}
</script>

 <style lang="scss" scoped>
.sign-up {
  width: 90%;
  max-width: 370px;
}
input {
  margin: 10px 0;
  width: 20%;
  padding: 15px;
}
button {
  margin-top: 10px;
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

h3 {
  text-align: center;
}
</style>
