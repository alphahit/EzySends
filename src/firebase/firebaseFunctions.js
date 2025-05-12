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
    const staffData = snapshot.docs.map((doc, index) => ({
      id: (index + 1).toString(),
      name: doc.data().name,
      perFwd: '₹13', // Default value, can be updated later
      perRvp: '₹13', // Default value, can be updated later
      hub: 'ESY003', // Default value, can be updated later
      ...doc.data(),
      docId: doc.id // Store the Firestore document ID
    }));
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
    const hubData = snapshot.docs.map((doc, index) => ({
      id: (index + 1).toString(),
      hubName: doc.data().hubName,
      hubCode: doc.data().hubCode,
      totalStaff: '0', // This can be calculated later based on staff count
      ...doc.data(),
      docId: doc.id // Store the Firestore document ID
    }));
    return hubData;
  } catch (error) {
    console.error('Error fetching hub data:', error.message);
    return [];
  }
};
export const updateStaffDataInFirestore = async (staffId, staffData) => {
  try {
    const staffRef = firestore().collection('staff').doc(staffId);
    await staffRef.update(staffData);
    console.log('Staff data updated successfully!');
    Alert.alert('Success', 'Staff data updated successfully!');
  } catch (error) {
    console.error('Error updating staff data:', error.message);
    Alert.alert('Error', 'Failed to update staff data. Please try again.');
  }
};
export const updateHubDataInFirestore = async (hubId, hubData) => {
  try {
    const hubRef = firestore().collection('hubs').doc(hubId);
    await hubRef.update(hubData);
    console.log('Hub data updated successfully!');
    Alert.alert('Success', 'Hub data updated successfully!');
  } catch (error) {
    console.error('Error updating hub data:', error.message);
    Alert.alert('Error', 'Failed to update hub data. Please try again.');
  }
};
