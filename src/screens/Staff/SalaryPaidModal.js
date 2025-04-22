import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, FONTS, RH, RW } from '../../theme';

const SalaryPaidModal = ({
  visible,
  isSalaryPaid,
  setIsSalaryPaid,
  actualPayDate,
  setActualPayDate,
  onClose,
  onSave,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Format date as DD-MM-YYYY
  const formatDate = date => {
    let d = date instanceof Date ? date : new Date(date);
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, styles.salaryModalContent]}>
          <Text style={styles.salaryModalTitle}>Salary Payment Status</Text>

          <TouchableOpacity
            style={styles.paidStatusContainer}
            activeOpacity={0.7}
            onPress={() => setIsSalaryPaid(!isSalaryPaid)}
          >
            <Text style={styles.paidStatusLabel}>Mark as Paid</Text>
            <View style={[styles.checkbox, isSalaryPaid && styles.checked]}>
              {isSalaryPaid && (
                <Icon name="check" size={SIZES.s} color={COLORS.white} />
              )}
            </View>
          </TouchableOpacity>

          <View style={{ width: '100%' }}>
            <Text style={styles.paidStatusLabel}>Actual Pay Date</Text>
            <TouchableOpacity
              style={[
                styles.datePickerButton,
                actualPayDate && {
                  borderColor: COLORS.success,
                  borderWidth: 2,
                  borderRadius: RW(8),
                },
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ fontFamily: FONTS.PR, fontSize: SIZES.xs, color: COLORS.black }}>
                {actualPayDate ? formatDate(actualPayDate) : 'Select Date'}
              </Text>
            </TouchableOpacity>
            <DatePicker
              modal
              open={showDatePicker}
              date={actualPayDate || new Date()}
              mode="date"
              onConfirm={date => {
                setShowDatePicker(false);
                setActualPayDate(date);
              }}
              onCancel={() => setShowDatePicker(false)}
            />
          </View>

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={onSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: RW(16),
    width: '90%',
    maxWidth: RW(400),
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  salaryModalContent: {
    padding: RW(24),
    width: '80%',
    alignItems: 'center',
    borderRadius: RW(12),
  },
  salaryModalTitle: {
    fontFamily: FONTS.PB,
    fontSize: SIZES.l,
    marginBottom: RH(16),
    color: COLORS.black,
  },
  paidStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: RH(16),
    width: '100%',
  },
  paidStatusLabel: {
    fontFamily: FONTS.PR,
    fontSize: SIZES.s,
    color: COLORS.black,
  },
  checkbox: {
    width: RW(24),
    height: RW(24),
    borderRadius: RW(12),
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: COLORS.primary,
  },
  datePickerButton: {
    marginTop: RH(8),
    padding: RW(12),
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: RW(4),
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: RH(16),
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: RW(8),
    paddingVertical: RH(12),
    borderRadius: RW(8),
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.gray3,
  },
  cancelButtonText: {
    fontFamily: FONTS.PR,
    fontSize: SIZES.s,
    color: COLORS.black,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    fontFamily: FONTS.PR,
    fontSize: SIZES.s,
    color: COLORS.white,
  },
});

export default SalaryPaidModal;
