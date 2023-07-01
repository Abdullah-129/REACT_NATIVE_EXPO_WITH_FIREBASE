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
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import {sendNotification} from '../../utils/SendNotification';

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

export default function Home() {
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
  async function registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
  
    // Only ask if permissions have not been determined yet
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
  
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }
  
    // Get the device token
    let token;
    if (Constants.isDevice) {
      const { data: expoToken } = await Notifications.getExpoPushTokenAsync();
      token = expoToken;
    } else {
      console.log('Must use physical device for push notifications');
    }
  
    return token;
  }
  
  

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
          const { name, timestamp } = value; // Destructure the name and timestamp fields
          if (name === "Unknown") {
            unknown.push({ name, timestamp });
            const recipientToken = registerForPushNotificationsAsync();
            sendNotification({
              title: 'New Unknown Face',
              body: `An unknown face was detected at ${timestamp}.`,
              token: recipientToken,
              data: { name, timestamp },
            });
          } else {
            known.push({ name, timestamp });

          }
        });
        setKnownFaces(known);
        setUnknownFaces(unknown);
      }
    });
  }, []);

  // Filter known faces for today
  const currentDate = new Date().toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  console.log("date = ", currentDate);

  const filteredKnownFaces = knownFaces.filter((face) => {
    const timestamp = face.timestamp;
    const [datePart] = timestamp.split(' ');
    const [day, month, year] = datePart.split(':').map(part => part.trim());
  
    const faceDate = `${day} ${month} ${year}`;
    return faceDate === currentDate;
  });
  
  

  // Filter unknown faces for today
  const filteredUnknownFaces = unknownFaces.filter((face) => {
  const timestamp = face.timestamp;
  console.log("timestamp = ", timestamp);
  const [datePart, timePart] = timestamp.split(' ');
  console.log("date part = ", datePart);
  console.log("timepart = ", timePart);
  const [day, month, year] = datePart.split(':').map(part => part.trim());
  console.log("date-edited", day,month,year)
  const [hours, minutes, seconds] = timePart.split(':').map(part => part.trim());
  console.log("date-time", hours,minutes,seconds)


  const faceDate = `${day} ${month} ${year}`;
  console.log("current date = ", currentDate);
  console.log("facedate date = ", faceDate);
  return faceDate === currentDate;
  
});

  

  return (
    <ScreenTemplate style={styles.main}>
      <ScrollView>
        <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Facial Recognition System</Text>
        </View>
        <Text style={styles.headerText2}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>

        <View style={styles.dataContainer}>
          <View style={styles.tableContainer}>
            <Text style={styles.tableTitle}>
              <Icon name="users" size={16} color="#FFF" /> Known Faces:
            </Text>
            {filteredKnownFaces.map((face, index) => (
              <Text key={index} style={styles.tableItem}>
                {`${face.name} - ${face.timestamp}`}
              </Text>
            ))}
          </View>

          <View style={styles.tableContainer}>
            <Text style={styles.tableTitle}>
              <Icon name="user" size={16} color="#FFF" /> Unknown Faces:
            </Text>
            {filteredUnknownFaces.map((face, index) => (
              <Text key={index} style={styles.tableItem}>
                {`${face.name} - ${face.timestamp}`}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.footerContainer}>
          {/* <Button
            label="FIRE-BASE-"
            color={colors.lightPurple}
            onPress={() =>
              navigation.navigate('Detail', {
                userData: userData,
                from: 'Home',
                title: userData.email,
              })
            }
          /> */}
        </View>
      </ScrollView>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000', // Dark background
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF', // White text color
  },
  headerText2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF', // White text color
    textAlign: 'center'
  },
  dataContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  tableContainer: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white background
    borderRadius: 10,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#FFF', // White text color
  },
  tableItem: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#FFF', // White text color
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
});
