var firebase = require('firebase');
firebase.initializeApp({
  apiKey: "AIzaSyAqtKx_JN8tF0ApX0mepSStOx71cxVfmYA",
  authDomain: "pollbot-dev.firebaseapp.com",
  databaseURL: "https://pollbot-dev.firebaseio.com",
  storageBucket: "pollbot-dev.appspot.com",
  messagingSenderId: "193801942276"
});

class FireApiService {
  constructor() {}

  getUserToken(uid) {
    return new Promise((resolve, reject) => {
      firebase.database().ref().child(`/users/${uid}`).on('value', (snapshot) => {
        resolve(snapshot.val().token);
      });
    });
  }

  getPollList(uid) {
    return new Promise((resolve, reject) => {
      firebase.database().ref().child(`/polls/${uid}`).on('value', (snapshot) => {
        resolve(snapshot.val());
      });
    });
  }

  getPollInfo(uid, key) {
    return new Promise((resolve, reject) => {
      firebase.database().ref().child(`/polls/${uid}/${key}`).on('value', (snapshot) => {
        resolve(snapshot.val());
      });
    })
  }

  createNewPoll(data, uid) {
    return new Promise((resolve, reject) => {
      firebase.database().ref().child(`/polls/${uid}`).push(data).then((response) => {
        resolve(response);
      }, (error) => {
        reject(error);
      });
    });
  }

  updatePoll(data, uid, key) {
    return new Promise((resolve, reject) => {
      firebase.database().ref().child(`/polls/${uid}/${key}`).set(data).then((response) => {
        resolve(response);
      }, (error) => {
        reject(error);
      });
    });
  }

  login(token) {
    return firebase.auth().signInWithCustomToken(token);
  }

  getAnswers(pollId) {
    return new Promise((resolve, reject) => {
      firebase.database().ref().child(`/answers/${pollId}`).on('value', (snapshot) => {
        resolve(snapshot.val());
      });
    })
  }

  static fireApiFactory() {
    return new FireApiService();
  }
}

FireApiService.fireApiFactory.$inject = [];

export default FireApiService;
