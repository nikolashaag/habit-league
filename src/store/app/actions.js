import firebase from 'firebase'

export function fetchChallenges ({ commit, state }) {
  console.log('context', state)
  var db = firebase.firestore()
  console.log('db', db)
  db.collection('challenges').get().then((querySnapshot) => {
    console.log('querySnapshot', querySnapshot)
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`)
      console.log(doc.data())
      const challenge = doc.data()
      commit('addChallenge', {
        ...challenge,
        id: doc.id
      })
    })
  })
}
