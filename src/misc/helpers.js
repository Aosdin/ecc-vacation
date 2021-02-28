import UsersDB from '@/firebase/users-db'

/**
 * Create new user from firebase auth user infos
 */
// eslint-disable-next-line
export const createNewUserFromFirebaseAuthUser = async firebaseAuthUser => {
  const providerData = firebaseAuthUser.providerData[0]
  const { displayName, photoURL, email } = providerData
  const userDb = new UsersDB()
  const user = {
    displayName,
    photoURL,
    email,
    authority: 1,
    vPoint: 15,
    nickName: '',
    birthday: '',
    memberYn: 'N',
    delYn: 'N'
  }

  return userDb.create(user, firebaseAuthUser.uid)
}
