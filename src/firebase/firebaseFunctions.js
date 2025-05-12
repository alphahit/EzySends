import { getApp } from '@react-native-firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc
} from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

// Initialize Firestore using the default Firebase app
const app = getApp();
const db = getFirestore(app);

/**
 * Save a new staff entry to the Firestore 'staff' collection.
 * @param {Object} staffData - The staff data object to save.
 */
export const saveStaffDataToFirestore = async (staffData) => {
  try {
    // Use modular API: addDoc(collection(db, 'staff'), data)
    await addDoc(collection(db, 'staff'), staffData);
    console.log('Staff data saved successfully!');
    Alert.alert('Success', 'Staff data saved successfully!');
  } catch (error) {
    console.error('Error saving staff data:', error.message);
    Alert.alert('Error', 'Failed to save staff data. Please try again.');
  }
};

/**
 * Save a new hub entry to the Firestore 'hubs' collection.
 * @param {Object} hubData - The hub data object to save.
 */
export const saveHubDataToFirestore = async (hubData) => {
  try {
    await addDoc(collection(db, 'hubs'), hubData);
    console.log('Hub data saved successfully!');
    Alert.alert('Success', 'Hub data saved successfully!');
  } catch (error) {
    console.error('Error saving hub data:', error.message);
    Alert.alert('Error', 'Failed to save hub data. Please try again.');
  }
};

/**
 * Fetch all staff data from the Firestore 'staff' collection.
 * @returns {Promise<Array>} Array of staff objects, each with a Firestore docId.
 */
export const getStaffDataFromFirestore = async () => {
  try {
    // Get all documents in 'staff'
    const snapshot = await getDocs(collection(db, 'staff'));
    return snapshot.docs.map((docSnap, index) => ({
      id: (index + 1).toString(),    // UI-friendly numeric ID
      docId: docSnap.id,             // Firestore document ID
      ...docSnap.data(),             // Spread stored fields
    }));
  } catch (error) {
    console.error('Error fetching staff data:', error.message);
    return [];
  }
};

/**
 * Fetch all hub data from the Firestore 'hubs' collection.
 * @returns {Promise<Array>} Array of hub objects, each with a Firestore docId.
 */
export const getHubDataFromFirestore = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'hubs'));
    return snapshot.docs.map((docSnap, index) => ({
      id: (index + 1).toString(),
      docId: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error('Error fetching hub data:', error.message);
    return [];
  }
};

/**
 * Update an existing staff document in Firestore.
 * @param {string} staffId - Firestore document ID for the staff entry.
 * @param {Object} staffData - The staff data to update.
 */
export const updateStaffDataInFirestore = async (staffId, staffData) => {
  try {
    // Reference a specific document then update
    const staffDocRef = doc(db, 'staff', staffId);
    await updateDoc(staffDocRef, staffData);
    console.log('Staff data updated successfully!');
    Alert.alert('Success', 'Staff data updated successfully!');
  } catch (error) {
    console.error('Error updating staff data:', error.message);
    Alert.alert('Error', 'Failed to update staff data. Please try again.');
  }
};

/**
 * Update an existing hub document in Firestore.
 * @param {string} hubId - Firestore document ID for the hub entry.
 * @param {Object} hubData - The hub data to update.
 */
export const updateHubDataInFirestore = async (hubId, hubData) => {
  try {
    const hubDocRef = doc(db, 'hubs', hubId);
    await updateDoc(hubDocRef, hubData);
    console.log('Hub data updated successfully!');
    Alert.alert('Success', 'Hub data updated successfully!');
  } catch (error) {
    console.error('Error updating hub data:', error.message);
    Alert.alert('Error', 'Failed to update hub data. Please try again.');
  }
};
