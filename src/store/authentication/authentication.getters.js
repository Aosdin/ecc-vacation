import { isNil } from 'lodash'

export default {
  isUserLoggedIn: state => !isNil(state.user),
  isUserPending: state => key =>
    state.userPending.includes(key)
}
