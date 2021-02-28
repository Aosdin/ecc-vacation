import Vue from 'vue'

export default {
  setUser: (state, value) => {
    Vue.set(state, 'user', value)
    console.log('===', value)
  },
  setUserList: (state, value) => (state.userList = value),
  addUserPending: (state, key) =>
      state.userPending.push(key),
  removeUserPending: (state, key) => {
    const index = state.userPending.findIndex(u => u === key)
    state.userPending.splice(index, 1)
  }
}
