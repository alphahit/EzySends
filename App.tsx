import React from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   useColorScheme,
//   View,
// } from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import HomeStack from './src/navigation/NavStack';
import firebase from '@react-native-firebase/app';

// Initialize Firebase
const firebaseConfig = {
  // Your Firebase config from google-services.json
  projectId: 'salary-app-79a41',
  apiKey: 'AIzaSyDanV1_k-8Dh7VP8W0HPOEmr4y-Qq8d_iw',
  storageBucket: 'salary-app-79a41.firebasestorage.app',
  appId: '1:1063844707613:android:ef9c94892a29abde7ef5f4'
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function App(): React.JSX.Element {
  // const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      {/* Rest of your app code */}

      <HomeStack />
    </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

export default App;
