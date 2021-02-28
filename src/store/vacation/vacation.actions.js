import VacationDB from '@/firebase/vacation-db'

export default {
  createVacation: async ({ rootState }, vacation) => {
    const vacationDb = new VacationDB(rootState.authentication.user.id)

    await vacationDb.create(vacation)
  },

  getVacation: async ({ rootState, commit }, constraints) => {
    const vacationDb = new VacationDB(rootState.authentication.user.id)
    const vacations = await vacationDb.readAll(constraints)
    commit('setVacationList', vacations)
  },

  putVacation: async ({ rootState }, payload) => {
    console.log(rootState.authentication.user.id)
    console.log(payload.id)
    const vacationDb = new VacationDB(rootState.authentication.user.id)
    await vacationDb.update(payload)
  }
}
