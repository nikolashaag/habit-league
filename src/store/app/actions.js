import firebase from 'firebase'
import {
  isChallengePast,
  isChallengeOlderThanAWeek
} from '../../helpers/calendar'
import { Notify } from 'quasar'

export function fetchChallenges({ commit, state, rootState }) {
  return new Promise((resolve, reject) => {
    commit('clearState')
    const db = firebase.firestore()
    db.collection('challenges')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const challenge = doc.data()
          const isPast = isChallengePast(challenge)
          const isOlderThanAWeek = isChallengeOlderThanAWeek(challenge)
          challenge.isPast = isPast

          if (
            challenge.members.find(
              member => member.id === rootState.user.currentUser.uid
            ) &&
            !isOlderThanAWeek
          ) {
            commit('addMyChallengeToState', {
              ...challenge,
              id: doc.id
            })
          } else if (
            challenge.members.find(
              member => member.id === rootState.user.currentUser.uid
            ) &&
            isOlderThanAWeek
          ) {
            commit('addToArchive', {
              ...challenge,
              id: doc.id
            })
          } else if (!isPast && challenge.privacy === 'public') {
            commit('addChallengeToState', {
              ...challenge,
              id: doc.id
            })
          }
        })
        commit('setSyncStatus', true)
        resolve()
      })
  })
}

export function addChallenge({ commit, state }, challenge) {
  var db = firebase.firestore()
  db.collection('challenges')
    .add(challenge)
    .then(function(docRef) {
      commit('addMyChallengeToState', {
        ...challenge,
        id: docRef.id
      })
    })
    .catch(function(error) {
      console.error('Error adding challenge: ', error)
    })
}

export function updateChallenge(
  { dispatch, state },
  { challenge, challengeId }
) {
  var db = firebase.firestore()
  db.collection('challenges')
    .doc(challengeId)
    .update(challenge)
    .then(function(docRef) {
      console.log('success', docRef)
      dispatch('fetchChallenges')
    })
    .catch(function(error) {
      console.error('Error joining challenge: ', error)
    })
}

export function joinChallenge({ dispatch, state, rootState }, challengeId) {
  const db = firebase.firestore()
  const localChallengeMembers = state.challenges.find(
    challenge => challenge.id === challengeId
  ).members
  db.collection('challenges')
    .doc(challengeId)
    .update({
      members: [
        ...localChallengeMembers,
        {
          id: rootState.user.currentUser.uid,
          completedDays: 0,
          name: rootState.user.currentUser.displayName
        }
      ]
    })
    .then(function(docRef) {
      console.log('success', docRef)
      dispatch('fetchChallenges')
    })
    .catch(function(error) {
      console.error('Error joining challenge: ', error)
    })
}

export function leaveChallenge({ dispatch, state, rootState }, challengeId) {
  const db = firebase.firestore()
  const localChallengeMembers = state.myChallenges.find(
    challenge => challenge.id === challengeId
  ).members
  db.collection('challenges')
    .doc(challengeId)
    .update({
      members: localChallengeMembers.filter(
        member => member.id !== rootState.user.currentUser.uid
      )
    })
    .then(function(docRef) {
      console.log('success', docRef)
      dispatch('fetchChallenges')
    })
    .catch(function(error) {
      console.error('Error leaving challenge: ', error)
    })
}

export async function noteDayProgress({ commit, state, rootState }, data) {
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
  if (
    existingLoggedDays.find(
      log => log.date === data.day.date && log.user === data.day.user
    )
  ) {
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
  docRef
    .update({
      loggedDays: existingLoggedDays
    })
    .then(function(docRef) {
      console.log('successfully updated loggedDays', docRef)
    })
    .catch(function(error) {
      console.error('Error updating loggedDays: ', error)
    })
}

export async function removeDayProgress({ commit, state, rootState }, data) {
  commit('removeDay', data)
  const db = firebase.firestore()
  var docRef = db.collection('challenges').doc(data.challengeId)
  const doc = await docRef.get()
  if (!doc.exists) {
    console.log('habit was deleted')
    return
  }
  const docData = doc.data()
  let existingLoggedDays = docData.loggedDays || []
  existingLoggedDays = existingLoggedDays.filter(
    log => !(log.date === data.day.date && log.user === data.day.user)
  )

  docRef
    .update({
      loggedDays: existingLoggedDays
    })
    .then(function(docRef) {
      console.log('successfully updated loggedDays', docRef)
    })
    .catch(function(error) {
      console.error('Error updating loggedDays: ', error)
    })
}

export async function deleteHabit({ commit, state, dispatch }, data) {
  const db = firebase.firestore()
  db.collection('challenges')
    .doc(data.challengeId)
    .delete()
    .then(function() {
      console.log('Document successfully deleted!')
      Notify.create('Habit was deleted!')
      dispatch('fetchChallenges')
    })
    .catch(function(error) {
      console.error('Error removing document: ', error)
    })
}
