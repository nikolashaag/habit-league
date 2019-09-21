import firebase from 'firebase'

export async function saveUser ({ commit, state }, user) {
  console.log('user ---', user)
  var db = firebase.firestore()
  const existingUsers = await db.collection('users').get()
  const match = existingUsers.docs.find(doc => doc.data().uid === user.uid)
  if (!match) {
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
}

export function fetchUsers ({ commit, state }) {
  return new Promise((resolve, reject) => {
    var db = firebase.firestore()
    db.collection('users').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const user = doc.data()
        commit('addUserToState', user)
      })
      resolve()
    })
  })
}
