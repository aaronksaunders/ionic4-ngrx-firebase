import * as firebase from "firebase";
//require('firebase/firestore')

firebase.initializeApp({
  apiKey: "AIzaSyBQNkFYPCV9mYd_Nn6kRbAWCvl3iunpI0k",
  authDomain: "newtestproject-6cac7.firebaseapp.com",
  databaseURL: "https://newtestproject-6cac7.firebaseio.com",
  projectId: "newtestproject-6cac7",
  storageBucket: "newtestproject-6cac7.appspot.com",
  messagingSenderId: "203269510371"
});

const firestore = firebase.firestore();
const settings = {
  /* your settings... */
  timestampsInSnapshots: true
};
firestore.settings(settings);

const db = firebase.firestore();
const tasks = db.collection("tasks");

// Getting Real time feeds
// tasks.onSnapshot(querySnapshot => {
//   const myTasks = []
//   querySnapshot.forEach(doc => {
//     myTasks.push({
//       id: doc.id,
//       ...doc.data()
//     })
//   })
//   store.commit('watchTasks', myTasks)
// })

export default {
  authCheck: () => {
    return new Promise(resolve => {
      firebase.auth().onAuthStateChanged(_currentUser => {
        if (_currentUser) {
          console.log(
            "User " +
              _currentUser.uid +
              " is logged in with " +
              _currentUser.email
          );
          resolve();
        } else {
          console.log("User is logged out");
          resolve();
        }
      });
    });
  },

  auth: ({ email, password }) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(function(error) {
        return { error };
      });
  },

  createUser: ({ email, password }) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(function(error) {
        return { error };
      });
  },

  checkAuth: async () => {
    return new Promise(resolve => {
      firebase.auth().onAuthStateChanged(_currentUser => {
        if (_currentUser) {
          console.log(
            "User " +
              _currentUser.uid +
              " is logged in with " +
              _currentUser.email
          );
          resolve(firebase.auth().currentUser);
        } else {
          console.log("User is logged out");
          resolve(firebase.auth().currentUser);
        }
      });
    });
  },

  fetchTasks: () => {
    return tasks.get();
  },

  addTask: entry => {
    return tasks.add(entry);
  },

  updateTask: entry => {
    let inputData = {
      ...entry,
      updated: new Date()
    };
    delete inputData["id"];
    return tasks.doc(entry.id).update(inputData);
  },

  removeTask: id => {
    return tasks.doc(id).delete();
  },

  addObject: (_type, _data) => {
    return db.collection(_type).add({ ..._data });
  },

  fetchObjects: _type => {
    return db.collection(_type).get();
  }
};