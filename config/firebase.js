import * as firebase from 'firebase';

var config = {
  apiKey: 'AIzaSyC1_kW0RtVPqAlPnI0OhfES6HMD8vuaKOo',
  authDomain: 'testofknowledge818.firebaseapp.com',
  databaseURL: 'https://testofknowledge818.firebaseio.com',
  projectId: 'testofknowledge818',
  storageBucket: 'testofknowledge818.appspot.com',
  messagingSenderId: '403045327846',
  appId: '1:403045327846:web:c73ac16250696f514cac27',
  measurementId: 'G-F1FV6ELGKT',
};

export default !firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app();

// export const firestor = firebase.firestore();

// export const authfirebase = firebase.auth();
// export default (!firebase.apps.length
//   ? firebase.initializeApp(config).firestore()
//   : firebase.app().firestore());
