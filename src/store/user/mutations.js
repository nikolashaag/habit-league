
export function setUser (state, data) {
  state.currentUser = data
}

export function addUserToState (state, data) {
  state.users = [
    ...state.users,
    data
  ]
}
