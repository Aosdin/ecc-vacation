import firebase from 'firebase/app'
import 'firebase/auth'

// The configuration below is not sensitive data. You can serenely add your config here
const config = {
  apiKey: 'AIzaSyC6SwRj1qbZ-k6dD4SLIAsDrSgLjvpOoYo',
  authDomain: 'ecc-vacation.firebaseapp.com',
  databaseURL: 'https://bento-starter.firebaseio.com',
  projectId: 'ecc-vacation',
  storageBucket: 'ecc-vacation.appspot.com',
  messagingSenderId: '623301727887'
}

firebase.initializeApp(config)