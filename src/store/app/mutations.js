export function addChallengeToState (state, newChallange) {
  console.log('context', state, newChallange)
  state.challenges = [...state.challenges, newChallange]
}
export function addMyChallengeToState (state, newChallange) {
  console.log('context', state, newChallange)
  state.myChallenges = [...state.myChallenges, newChallange]
}

export function setSyncStatus (state, status) {
  console.log('setSyncStatus', status)
  state.syncStatus = status
}

export function noteDay (state, data) {
  state.challenges = state.challenges.map(challenge => {
    if (challenge.id === data.challengeId) {
      challenge.loggedDays = challenge.loggedDays || []
      let existingLog
      const logs = challenge.loggedDays.map(day => {
        if (day.date === data.day.date) {
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
        loggedDays: existingLog ? logs : [
          ...challenge.loggedDays,
          data.day
        ]
      }
    }
    return challenge
  })
}
