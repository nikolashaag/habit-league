/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */
importScripts('https://www.gstatic.com/firebasejs/6.3.5/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/6.3.5/firebase-messaging.js')

if (workbox) {
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      fetch(event.request).catch(function() {
        return caches.match(event.request)
      })
    )
  })
}

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
const messaging = firebase.messaging()
