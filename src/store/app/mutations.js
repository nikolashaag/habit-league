export function addChallengeToState(state, newChallange) {
  state.challenges = [...state.challenges, newChallange]
}
export function addMyChallengeToState(state, newChallange) {
  state.myChallenges = [...state.myChallenges, newChallange]
}
export function addToArchive(state, newChallange) {
  state.archive = [...state.archive, newChallange]
}

export function setSyncStatus(state, status) {
  state.syncStatus = status
}

export function clearState(state, status) {
  state.challenges = []
  state.myChallenges = []
}

export function setActiveChallenge(state, challenge) {
  state.activeChallenge = challenge
}

export function noteDay(state, data) {
  state.myChallenges = state.myChallenges.map(challenge => {
    if (challenge.id === data.challengeId) {
      challenge.loggedDays = challenge.loggedDays || []
      let existingLog
      const logs = challenge.loggedDays.map(day => {
        if (day.date === data.day.date && day.user === data.day.user) {
          existingLog = true
          return {
            ...day,
            status: data.day.status
          }
        }
        return day
      })
      return {
        ...challenge,
        loggedDays: existingLog ? logs : [...challenge.loggedDays, data.day]
      }
    }
    return challenge
  })
}

export function toggleIsCompleted(state) {
  state.isCompletedHidden = !state.isCompletedHidden
}
export function removeDay(state, data) {
  state.myChallenges = state.myChallenges.map(challenge => {
    if (challenge.id === data.challengeId) {
      challenge.loggedDays = challenge.loggedDays || []
      const logs = challenge.loggedDays.filter(
        log => !(log.date === data.day.date && log.user === data.day.user)
      )

      return {
        ...challenge,
        loggedDays: logs
      }
    }
    return challenge
  })
}

export function updateChallenge(state, updatedChallenge) {
  state.myChallenges = state.myChallenges.map(challenge => {
    if (challenge.id === updatedChallenge.id) {
      return updatedChallenge
    }
    return challenge
  })
}
