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

  await new Promise(resolve => {
    firebase.auth().onAuthStateChanged(() => {
      resolve()
    })
  })

  if (window.FCMPlugin) {
    window.FCMPlugin.onNotification(function(data) {
      if (data.wasTapped) {
        // Notification was received on device tray and tapped by the user.
        // TODO: Handle what should happen in this case
      } else {
        // Notification was received in foreground. Maybe the user needs to be notified.
        // TODO: Handle what should happen in this case
      }
    })
  }
}
