import router from '@/router'
import { isNil } from 'lodash'
import { createNewUserFromFirebaseAuthUser } from '@/misc/helpers'
import UsersDB from '@/firebase/users-db'

export default {
  /**
   * Callback fired when user login
   */
  login: async ({ commit }, firebaseAuthUser) => {
    const userFromFirebase = await new UsersDB().read(firebaseAuthUser.uid)

    const user = isNil(userFromFirebase)
      ? await createNewUserFromFirebaseAuthUser(firebaseAuthUser)
      : userFromFirebase

    commit('setUser', user)
    // dispatch('products/getUserProducts', null, { root: true })
  },

  /**
   * Callback fired when user logout
   */
  logout: ({ commit }) => {
    commit('setUser', null)
    // commit('products/setProducts', null, { root: true })

    const currentRouter = router.app.$route
    if (!(currentRouter.meta && currentRouter.meta.authNotRequired)) {
      router.push('/login')
    }
  },

  getUser: async ({ rootState, commit }, constraints) => {
    const usersDb = new UsersDB(rootState.authentication.user.id)
    const users = await usersDb.readAll(constraints)
    commit('setUserList', users)
  },

  getUserInfo: async ({ rootState, commit }) => {
    const user = await new UsersDB().read(rootState.authentication.user.id)
    console.log(user)
    commit('setUser', user)
  },

  putUser: async ({ rootState, commit }, payload) => {
    commit('addUserPending', 'userUpdate')
    const usersDb = new UsersDB(rootState.authentication.user.id)
    await usersDb.update(payload)
    // commit('setUser', users)
    commit('removeUserPending', 'userUpdate')
  }

}
