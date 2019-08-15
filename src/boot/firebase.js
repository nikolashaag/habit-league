import firebase from 'firebase'

export default async ({ app, router, store, Vue }) => {
  const config = {
    apiKey: 'AIzaSyBE9hrVOCokIuIKJoysBtDgKm_twzmGR-U',
    authDomain: 'habit-win-19dc4.firebaseapp.com',
    databaseURL: 'https://habit-win-19dc4.firebaseio.com',
    projectId: 'habit-win-19dc4',
    storageBucket: 'habit-win-19dc4.appspot.com',
    messagingSenderId: '861508815624',
    appId: '1:861508815624:web:8f8767b9ef673296'
  }

  firebase.initializeApp(config)
  await new Promise((resolve) => {
    firebase.auth().onAuthStateChanged(() => {
      resolve()
    })
  })
}
