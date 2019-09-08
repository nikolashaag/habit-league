import firebase from 'firebase'
import { unique } from '../../helpers/utils'

export function fetchChallenges ({ commit, state, rootState }) {
  commit('clearState')
  const db = firebase.firestore()
  db.collection('challenges').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const challenge = doc.data()
      if (challenge.members.find(member => member.id === rootState.user.currentUser.uid)) {
        commit('addMyChallengeToState', {
          ...challenge,
          id: doc.id
        })
      } else {
        commit('addChallengeToState', {
          ...challenge,
          id: doc.id
        })
      }
      commit('setSyncStatus', true)
    })
  })
}

export function addChallenge ({ commit, state }, challenge) {
  var db = firebase.firestore()
  db.collection('challenges').add(challenge)
    .then(function (docRef) {
      commit('addMyChallengeToState', {
        ...challenge,
        id: docRef.id
      })
    })
    .catch(function (error) {
      console.error('Error adding challenge: ', error)
    })
}

export function joinChallenge ({ dispatch, state, rootState }, challengeId) {
  const db = firebase.firestore()
  console.log('challengeId', state.challenges)
  const localChallengeMembers = state.challenges.find(challenge => challenge.id === challengeId).members
  db.collection('challenges').doc(challengeId).update({
    members: [
      ...localChallengeMembers,
      {
        id: rootState.user.currentUser.uid,
        completedDays: 0,
        name: rootState.user.currentUser.displayName
      }
    ]
  })
    .then(function (docRef) {
      console.log('success', docRef)
      dispatch('fetchChallenges')
    })
    .catch(function (error) {
      console.error('Error joining challenge: ', error)
    })
}

export function noteDayProgress ({ commit, state, rootState }, data) {
  commit('noteDay', data)
  const db = firebase.firestore()
  const localLoggedDays = state.myChallenges.find(challenge => challenge.id === data.challengeId).loggedDays || []
  db.collection('challenges').doc(data.challengeId).update({
    loggedDays: unique(localLoggedDays ? [
      ...localLoggedDays,
      data.day
    ] : [ data.day ], 'date')
  })
    .then(function (docRef) {
      console.log('successfully updated loggedDays', docRef)
    })
    .catch(function (error) {
      console.error('Error updating loggedDays: ', error)
    })
}
