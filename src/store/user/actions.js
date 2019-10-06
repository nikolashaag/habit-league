import firebase from 'firebase'

export async function saveUser({ commit, state }, user) {
  console.log('user ---', user)
  var db = firebase.firestore()
  const existingUsers = await db.collection('users').get()
  const match = existingUsers.docs.find(doc => doc.data().uid === user.uid)
  if (!match) {
    db.collection('users')
      .add({
        displayName: user.displayName,
        uid: user.uid
      })
      .then(function(docRef) {
        console.log('Document written with ID: ', docRef)
      })
      .catch(function(error) {
        console.error('Error adding document: ', error)
      })
  }
}

export function fetchUsers({ commit, state }) {
  return new Promise((resolve, reject) => {
    var db = firebase.firestore()
    db.collection('users')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const user = doc.data()
          commit('addUserToState', user)
        })
        resolve()
      })
  })
}

export async function closeTip({ commit, state, rootState }, data) {
  commit('closeTip', data)
  const db = firebase.firestore()
  db.collection('users')
    .where('uid', '==', data.userId)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        if (!doc.exists) {
          console.log('user not available')
          return
        }
        const docData = doc.data()
        let existingClosedTips = docData.tipsClosed || []
        existingClosedTips = [...existingClosedTips, data.tip]
        console.log('doc id', doc)
        db.collection('users')
          .doc(doc.id)
          .update({
            tipsClosed: existingClosedTips
          })
          .then(function(docRef) {
            console.log('successfully updated closed tips', docRef)
          })
          .catch(function(error) {
            console.error('Error updating closed tips: ', error)
          })
      })
    })
    .catch(function(error) {
      console.log('coudnt find user: ', error)
    })
}

export async function saveToken({ commit, state, rootState }, token) {
  const db = firebase.firestore()
  db.collection('users')
    .where('uid', '==', rootState.user.currentUser.uid)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        if (!doc.exists) {
          console.log('user not available')
          return
        }
        db.collection('users')
          .doc(doc.id)
          .update({
            notificationsToken: token
          })
          .then(function(docRef) {
            console.log('successfully updated message token', docRef)
          })
          .catch(function(error) {
            console.error('Error updating message token: ', error)
          })
      })
    })
    .catch(function(error) {
      console.log('coudnt find user: ', error)
    })
}
