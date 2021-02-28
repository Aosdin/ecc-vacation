import GenericDB from './generic-db'

export default class VacationDB extends GenericDB {
  constructor() {
    super('vacation')
  }
}