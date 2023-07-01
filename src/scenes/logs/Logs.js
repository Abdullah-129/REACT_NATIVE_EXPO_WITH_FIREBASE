import React, { useEffect, useState, useContext, useLayoutEffect } from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconButton from '../../components/IconButton';
import ScreenTemplate from '../../components/ScreenTemplate';
import Button from '../../components/Button';
import { colors, fontSize } from '../../theme';
import { UserDataContext } from '../../context/UserDataContext';
import { ColorSchemeContext } from '../../context/ColorSchemeContext';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onValue, ref } from 'firebase/database';
import Icon from 'react-native-vector-icons/FontAwesome';


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

export default function Logs() {
  const navigation = useNavigation();
  const [token, setToken] = useState('');
  const [knownFaces, setKnownFaces] = useState([]);
  const [unknownFaces, setUnknownFaces] = useState([]);
  const { userData } = useContext(UserDataContext);
  const { scheme } = useContext(ColorSchemeContext);
  const isDark = scheme === 'dark';
  const colorScheme = {
    content: isDark ? styles.darkContent : styles.lightContent,
    text: isDark ? colors.white : colors.primaryText,
    backgroundColor: 'orange',
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="align-right"
          color={colors.lightPurple}
          size={24}
          onPress={() => headerButtonPress()}
          containerStyle={{ paddingRight: 15 }}
        />
      ),
    });
  }, [navigation]);

  const headerButtonPress = () => {
    alert('NOTHING TO SHOW HERE');
  };

   useEffect(() => {
    const db = getDatabase();
    const dbRef = ref(db, 'faces');
    console.log("receiving data");
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      console.log("faces =", data);
      if (data) {
        const known = [];
        const unknown = [];
        Object.entries(data).forEach(([key, value]) => {
          const { name, timestamp } = value; 
          if (name === "Unknown") {
            unknown.push({ name, timestamp });
          } else {
            known.push({ name, timestamp });
          }
        });
        setKnownFaces(known);
        setUnknownFaces(unknown);
        console.log("known = ", known);
      }
    });
  }, []);

  

  return (
    <ScreenTemplate style={styles.main}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>LOGS</Text>
        </View>
  
        <View style={styles.dataContainer}>
          <View style={styles.tableContainer}>
            <Text style={styles.tableTitle}>
              <Icon name="users" size={16} color="#FFF" /> Known Faces:
            </Text>
            {knownFaces.map((face, index) => (
              <Text key={index} style={styles.tableItem}>
                {`${face.name} - ${face.timestamp}`}
              </Text>
            ))}
          </View>
  
          <View style={styles.tableContainer}>
            <Text style={styles.tableTitle}>
              <Icon name="user" size={16} color="#FFF" /> Unknown Faces:
            </Text>
            {unknownFaces.map((face, index) => (
              <Text key={index} style={styles.tableItem}>
                {`${face.name} - ${face.timestamp}`}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenTemplate>
  );
  
  
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000', 
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF', 
  },
  dataContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  tableContainer: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    borderRadius: 10,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#FFF', 
  },
  tableItem: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#FFF',
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
});
