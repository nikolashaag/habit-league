import firebase from 'firebase'

export function fetchChallenges ({ commit, state, rootState }) {
  if (!state.syncStatus) {
    var db = firebase.firestore()
    db.collection('challenges').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const challenge = doc.data()
        commit('addChallengeToState', {
          ...challenge,
          id: doc.id
        })
        if (challenge.members.find(member => member.id === rootState.user.currentUser.uid)) {
          commit('addMyChallengeToState', {
            ...challenge,
            id: doc.id
          })
        }
        commit('setSyncStatus', true)
      })
    })
  }
}

export function addChallenge ({ commit, state }, challenge) {
  var db = firebase.firestore()
  db.collection('challenges').add(challenge)
    .then(function (docRef) {
      commit('addChallenge', {
        ...challenge,
        id: docRef.id
      })
    })
    .catch(function (error) {
      console.error('Error adding challenge: ', error)
    })
}
