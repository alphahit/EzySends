import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES } from '../../theme';

const StaffInfoModal = ({ visible, onClose, staffInfo, navigation, employeeId, styles }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEdit = () => {
    onClose();
    navigation.navigate('EditEmployee', {
      employeeId,
      employeeData: staffInfo,
    });
  };

  const handleDelete = async () => {
    try {
      const db = require('@react-native-firebase/firestore').getFirestore();
      const { doc, deleteDoc } = require('@react-native-firebase/firestore');
      const employeeRef = doc(db, 'employees', employeeId);
      await deleteDoc(employeeRef);
      Alert.alert('Success', 'Employee deleted successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting employee:', error);
      Alert.alert('Error', 'Failed to delete employee.');
    }
  };

  return (
    <>
      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Icon name="account-details" size={SIZES.sm} color={COLORS.primary} />
                <Text style={styles.modalTitle}>Staff Details</Text>
              </View>
              <View style={styles.modalActions}>
                <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
                  <Icon name="pencil" size={SIZES.s} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowDeleteModal(true)} style={styles.actionButton}>
                  <Icon name="delete" size={SIZES.s} color={COLORS.error} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Icon name="close" size={SIZES.s} color={COLORS.black} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <Icon name="account" size={SIZES.s} color={COLORS.primary} />
                  <Text style={styles.infoLabel}>Name</Text>
                </View>
                <Text style={styles.infoValue}>{staffInfo?.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <Icon name="phone" size={SIZES.s} color={COLORS.primary} />
                  <Text style={styles.infoLabel}>Contact</Text>
                </View>
                <Text style={styles.infoValue}>{staffInfo?.contact}</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <Icon name="home" size={SIZES.s} color={COLORS.primary} />
                  <Text style={styles.infoLabel}>Address</Text>
                </View>
                <Text style={styles.infoValue}>{staffInfo?.address}</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <Icon name="calendar" size={SIZES.s} color={COLORS.primary} />
                  <Text style={styles.infoLabel}>Salary Date</Text>
                </View>
                <Text style={styles.infoValue}>{staffInfo?.salaryDate}</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <Icon name="currency-inr" size={SIZES.s} color={COLORS.primary} />
                  <Text style={styles.infoLabel}>Salary Amount</Text>
                </View>
                <Text style={styles.infoValue}>{staffInfo?.salaryAmount}</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <Icon name="information-outline" size={SIZES.s} color={COLORS.primary} />
                  <Text style={styles.infoLabel}>Description</Text>
                </View>
                <Text style={[styles.infoValue, { flex: 1, textAlign: 'right' }]} numberOfLines={3}>
                  {staffInfo?.description ? staffInfo.description : 'No description provided.'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal transparent visible={showDeleteModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationModalContent}>
            <Text style={styles.confirmationTitle}>Delete Employee</Text>
            <Text style={styles.confirmationMessage}>
              Are you sure you want to delete this employee? This action cannot be undone.
            </Text>
            <View style={styles.confirmationButtons}>
              <TouchableOpacity
                style={[styles.confirmationButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmationButton, styles.deleteButton]}
                onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default StaffInfoModal;
