import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import InputField from '../../components/InputField';
import {COLORS, SIZES, FONTS, RH, RW} from '../../theme';
import {Button} from '../../components/Button/Button';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
} from '@react-native-firebase/firestore';

const AddAdvanceModal = ({visible, onClose, employeeId}) => {
  const [newAdvanceDate, setNewAdvanceDate] = useState(new Date());
  const [newAdvanceAmount, setNewAdvanceAmount] = useState('');

  const handleAddAdvance = async () => {
    if (!newAdvanceAmount) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    try {
      const db = getFirestore();
      const transactionsRef = collection(db, 'transactions');

      await addDoc(transactionsRef, {
        employeeId,
        type: 'Advance',
        amount: parseFloat(newAdvanceAmount),
        date: newAdvanceDate,
        createdAt: new Date(),
      });

      // Update total advance in employee document
      const employeeRef = doc(db, 'employees', employeeId);
      const employeeDoc = await getDoc(employeeRef);
      const currentTotalAdvance = employeeDoc.data().totalAdvance || 0;
      await updateDoc(employeeRef, {
        totalAdvance: currentTotalAdvance + parseFloat(newAdvanceAmount),
      });

      setNewAdvanceAmount('');
      onClose();
      Alert.alert('Success', 'Advance added successfully!');
    } catch (error) {
      console.error('Error adding advance:', error);
      Alert.alert('Error', 'Failed to add advance');
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalBody}>
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Amount</Text>
              <InputField
                placeholder="Enter amount"
                value={newAdvanceAmount}
                onChangeText={setNewAdvanceAmount}
                keyboardType="numeric"
                labelStyle={{fontSize: SIZES.xs}}
                inputStyle={{fontSize: SIZES.s}}
                inputHeight={RH(45)}
                containerStyle={styles.amountInput}
              />
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Date</Text>
              <View style={styles.datePickerContainer}>
                <DatePicker
                  date={newAdvanceDate}
                  onDateChange={setNewAdvanceDate}
                  mode="date"
                />
              </View>
            </View>
          </View>

          <View style={styles.modalFooter}>
            <Button
              onPress={handleAddAdvance}
              backgroundColor={COLORS.primary}
              btnTitle="Add Advance"
              fontColor={COLORS.white}
              wrapperStyle={styles.addButton}
              titleStyle={{fontSize: SIZES.s}}
            />
            <Button
              onPress={onClose}
              backgroundColor={COLORS.white}
              btnTitle="Cancel"
              fontColor={COLORS.black}
              wrapperStyle={[styles.cancelButton]}
              titleStyle={{fontSize: SIZES.s}}
            />
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: RW(20),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray3,
  },
  modalTitle: {
    fontFamily: FONTS.PB,
    fontSize: SIZES.lg,
    color: COLORS.black,
  },
  closeButton: {
    width: RW(30),
    height: RW(30),
    borderRadius: RW(15),
    backgroundColor: COLORS.gray3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: SIZES.s,
    color: COLORS.black,
  },
  modalBody: {
    flexDirection: 'row',
    padding: RW(20),
    justifyContent: 'space-between',
  },
  inputSection: {
    flex: 0.5,
    marginHorizontal: RW(8),
  },
  inputLabel: {
    fontFamily: FONTS.PR,
    fontSize: SIZES.s,
    color: COLORS.gray2,
    marginBottom: RH(8),
  },
  amountInput: {
    width: '100%',
  },
  datePickerContainer: {
    flex: 0.5,
    borderWidth: 1,
    borderColor: COLORS.gray3,
    borderRadius: RW(8),
    padding: RW(10),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: RH(120),
  },
  modalFooter: {
    marginTop: RH(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: RW(20),
    borderTopWidth: 1,
    borderTopColor: COLORS.gray3,
  },
  addButton: {
    flex: 1,
    marginRight: RW(10),
  },
  cancelButton: {
    flex: 1,
  },
});

export default AddAdvanceModal;
