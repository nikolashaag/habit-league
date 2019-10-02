export function setUser(state, data) {
  state.currentUser = data
}

export function addUserToState(state, data) {
  state.users = [...state.users, data]
}

export function closeTip(state, data) {
  state.users = state.users.map(user => {
    if (user.uid === data.userId) {
      const existingTips = user.tipsClosed || []
      return {
        ...user,
        tipsClosed: [...existingTips, data.tip]
      }
    }
    return user
  })
}
