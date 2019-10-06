import firebase from 'firebase'
import { Notify } from 'quasar'

export const initMessaging = async () => {
  console.log('initMessaging')
  const messaging = firebase.messaging()
  const permission = await Notification.requestPermission()
  let currentToken = null
  if (permission === 'granted') {
    currentToken = await messaging.getToken()
    console.log('currentToken', currentToken)
  } else {
    console.log('Unable to get permission to notify.')
  }
  // Callback fired if Instance ID token is updated.
  messaging.onTokenRefresh(() => {
    messaging
      .getToken()
      .then(refreshedToken => {
        console.log('refreshedToken', refreshedToken)
      })
      .catch(err => {
        console.log('Unable to retrieve refreshed token ', err)
      })
  })
  messaging.onMessage(message => {
    console.log('Notification recieved -------', message)
    Notify.create(message.notification.body)
  })

  return currentToken
}
