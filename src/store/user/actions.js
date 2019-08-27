import firebase from 'firebase'

export function saveUser ({ commit, state }, user) {
  console.log('user ---', user)
  var db = firebase.firestore()
  console.log('db', db)
  db.collection('users').add({
    displayName: user.displayName,
    uid: user.uid
  })
    .then(function (docRef) {
      console.log('Document written with ID: ', docRef)
    })
    .catch(function (error) {
      console.error('Error adding document: ', error)
    })
}

export function fetchUsers ({ commit, state }) {
  console.log('context', state)
  var db = firebase.firestore()
  console.log('db', db)
  db.collection('users').get().then((querySnapshot) => {
    console.log('querySnapshot', querySnapshot)
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`)
      const user = doc.data()
      commit('addUserToState', user)
    })
  })
}
