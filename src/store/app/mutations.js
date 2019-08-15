export function addChallenge (state, newChallange) {
  console.log('context', state, newChallange)
  state.challenges = [...state.challenges, newChallange]
}

export function noteDay (state, data) {
  state.challenges = state.challenges.map(challenge => {
    console.log('HIT', data, data.challengeId, challenge.id)
    if (challenge.id === data.challengeId) {
      let existingLog
      const logs = challenge.loggedDays.map(day => {
        if (day.date === data.day.date) {
          existingLog = true
          return {
            ...day,
            status: data.day.status
          }
        }
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
