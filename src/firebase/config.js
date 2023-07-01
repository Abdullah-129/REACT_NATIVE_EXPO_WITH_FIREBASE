import { initializeApp } from 'firebase/app';
// authentication
import { initializeAuth } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// firestore
import { getFirestore } from 'firebase/firestore';
// cloud storage
import { getStorage } from "firebase/storage";

import { firebaseKey } from '../config'

const firebaseConfig = {
  apiKey: "AIzaSyBXAMdX65_iK09bqDqSLWjW-yMnuCTeLf4",
  authDomain: "face-detection-d6b66.firebaseapp.com",
  databaseURL: "https://face-detection-d6b66-default-rtdb.firebaseio.com",
  projectId: "face-detection-d6b66",
  storageBucket: "face-detection-d6b66.appspot.com",
  messagingSenderId: "408494006324",
  appId: "1:408494006324:web:48bce04e2b5da2305dea61"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const firestore = getFirestore();
const storage = getStorage();

export { auth, firestore, storage };
