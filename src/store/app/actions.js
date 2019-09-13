import firebase from 'firebase'
import { isChallengePast } from '../../helpers/calendar'

export function fetchChallenges ({ commit, state, rootState }) {
  commit('clearState')
  const db = firebase.firestore()
  db.collection('challenges').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const challenge = doc.data()
      const isPast = isChallengePast(challenge)

      if (challenge.members.find(member => member.id === rootState.user.currentUser.uid) && !isPast) {
        commit('addMyChallengeToState', {
          ...challenge,
          id: doc.id
        })
      } else if (!isPast) {
        commit('addChallengeToState', {
          ...challenge,
          id: doc.id
        })
      }
    })
    commit('setSyncStatus', true)
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

export async function noteDayProgress ({ commit, state, rootState }, data) {
  commit('noteDay', data)
  const db = firebase.firestore()
  var docRef = db.collection('challenges').doc(data.challengeId)
  const doc = await docRef.get()
  if (!doc.exists) {
    console.log('habit was deleted')
    return
  }
  const docData = doc.data()
  let existingLoggedDays = docData.loggedDays || []
  if (existingLoggedDays.find(log => log.date === data.day.date && log.user === data.day.user)) {
    existingLoggedDays = existingLoggedDays.map(log => {
      if (log.date === data.day.date && log.user === data.day.user) {
        return {
          ...log,
          status: data.day.status
        }
      }
      return log
    })
  } else {
    existingLoggedDays.push(data.day)
  }
  docRef.update({
    loggedDays: existingLoggedDays
  })
    .then(function (docRef) {
      console.log('successfully updated loggedDays', docRef)
    })
    .catch(function (error) {
      console.error('Error updating loggedDays: ', error)
    })
}
