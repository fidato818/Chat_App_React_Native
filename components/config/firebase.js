import * as firebase from 'firebase';

 
var config = {
  apiKey: 'AIzaSyAKWjcz-LEED_-LcTSd3ZCkemGwIfcMC8A',
  authDomain: 'react-rnchatapp.firebaseapp.com',
  databaseURL: 'https://react-rnchatapp.firebaseio.com',
  projectId: 'react-rnchatapp',
  storageBucket: 'react-rnchatapp.appspot.com',
  messagingSenderId: '512109718841',
  appId: '1:512109718841:web:976a6a2ee180a417',
};
 
 
export default (!firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app());

// export const firestor = firebase.firestore();

// export const authfirebase = firebase.auth();
// export default (!firebase.apps.length
//   ? firebase.initializeApp(config).firestore()
//   : firebase.app().firestore());