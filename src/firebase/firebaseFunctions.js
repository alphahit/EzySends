import firestore from '@react-native-firebase/firestore';
import {Alert} from 'react-native';

export const saveStaffDataToFirestore = async staffData => {
  try {
    // Add the staff data to the "staff" collection in Firestore
    const staffRef = firestore().collection('staff');
    await staffRef.add(staffData);
    console.log('Staff data saved successfully!');
    Alert.alert('Success', 'Staff data saved successfully!');
  } catch (error) {
    console.error('Error saving staff data:', error.message);
    Alert.alert('Error', 'Failed to save staff data. Please try again.');
  }
};
export const saveHubDataToFirestore = async hubData => {
  try {
    // Add the hub data to the "hubs" collection in Firestore
    const hubRef = firestore().collection('hubs');
    await hubRef.add(hubData);
    console.log('Hub data saved successfully!');
    Alert.alert('Success', 'Hub data saved successfully!');
  } catch (error) {
    console.error('Error saving hub data:', error.message);
    Alert.alert('Error', 'Failed to save hub data. Please try again.');
  }
};
export const getStaffDataFromFirestore = async () => {
  try {
    const staffRef = firestore().collection('staff');
    const snapshot = await staffRef.get();
    const staffData = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    return staffData;
  } catch (error) {
    console.error('Error fetching staff data:', error.message);
    return [];
  }
};
export const getHubDataFromFirestore = async () => {
  try {
    const hubRef = firestore().collection('hubs');
    const snapshot = await hubRef.get();
    const hubData = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    return hubData;
  } catch (error) {
    console.error('Error fetching hub data:', error.message);
    return [];
  }
};
