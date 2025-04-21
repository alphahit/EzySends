import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Alert,
  TouchableOpacity,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import InputField from '../../components/InputField';
import {COLORS, SIZES, FONTS, RH, RW} from '../../theme';
import {Button} from '../../components/Button/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const AddAdvanceModal = ({visible, onClose, employeeId, transactionToEdit}) => {
  const [newAdvanceDate, setNewAdvanceDate] = useState(
    transactionToEdit?.date?.toDate() || new Date(),
  );
  const [newAdvanceAmount, setNewAdvanceAmount] = useState(
    transactionToEdit ? Math.abs(transactionToEdit.amount).toString() : '',
  );
  const [transactionType, setTransactionType] = useState(
    transactionToEdit
      ? transactionToEdit.amount > 0
        ? 'advance'
        : 'return'
      : 'advance',
  );

  // Reset form when modal is opened/closed
  useEffect(() => {
    if (visible && transactionToEdit) {
      setNewAdvanceDate(transactionToEdit.date.toDate());
      setNewAdvanceAmount(Math.abs(transactionToEdit.amount).toString());
      setTransactionType(transactionToEdit.amount > 0 ? 'advance' : 'return');
    } else if (!visible) {
      setNewAdvanceDate(new Date());
      setNewAdvanceAmount('');
      setTransactionType('advance');
    }
  }, [visible, transactionToEdit]);

  const handleTransaction = async () => {
    if (!newAdvanceAmount) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    const db = firestore();
    const transactionsRef = db.collection('transactions');
    const employeeRef = db.doc(`employees/${employeeId}`);
    const amount = parseFloat(newAdvanceAmount);
    // advance → +amount, return → −amount
    const signedAmount =
      transactionType === 'advance' ? amount : /* return */ -amount;

    try {
      if (transactionToEdit) {
        const transactionRef = db.doc(`transactions/${transactionToEdit.id}`);
        const oldAmount = transactionToEdit.amount;
        const diff = signedAmount - oldAmount;

        // 1) update the transaction record
        await transactionRef.update({
          type: transactionType === 'advance' ? 'Advance' : 'Return',
          amount: signedAmount,
          date: newAdvanceDate,
        });

        // 2) atomically bump totalAdvance by the change
        await employeeRef.update({
          totalAdvance: firestore.FieldValue.increment(diff),
        });

        Alert.alert('Success', 'Transaction updated successfully!');
      } else {
        // 1) add new transaction
        await transactionsRef.add({
          employeeId,
          type: transactionType === 'advance' ? 'Advance' : 'Return',
          amount: signedAmount,
          date: newAdvanceDate,
          createdAt: new Date(),
        });

        // 2) increment totalAdvance
        await employeeRef.update({
          totalAdvance: firestore.FieldValue.increment(signedAmount),
        });

        Alert.alert('Success', 'Transaction added successfully!');
      }

      setNewAdvanceAmount('');
      onClose();
    } catch (error) {
      console.error('Error processing transaction:', error);
      Alert.alert('Error', 'Failed to process transaction');
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalBody}>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  transactionType === 'advance' && styles.selectedType,
                ]}
                onPress={() => setTransactionType('advance')}>
                <Icon
                  name="cash-plus"
                  size={SIZES.s}
                  color={
                    transactionType === 'advance' ? COLORS.white : COLORS.black
                  }
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    transactionType === 'advance' && styles.selectedTypeText,
                  ]}>
                  Advance
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  transactionType === 'return' && styles.selectedType,
                ]}
                onPress={() => setTransactionType('return')}>
                <Icon
                  name="cash-minus"
                  size={SIZES.s}
                  color={
                    transactionType === 'return' ? COLORS.white : COLORS.black
                  }
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    transactionType === 'return' && styles.selectedTypeText,
                  ]}>
                  Return
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputSection}>
              <View style={styles.inputLabelContainer}>
                <Icon
                  name="currency-inr"
                  size={SIZES.xs}
                  color={COLORS.gray2}
                />
                <Text style={styles.inputLabel}>Amount</Text>
              </View>
              <InputField
                placeholder="Enter amount"
                value={newAdvanceAmount}
                onChangeText={setNewAdvanceAmount}
                keyboardType="numeric"
                labelStyle={{fontSize: SIZES.xxs}}
                inputStyle={{fontSize: SIZES.xs}}
                inputHeight={RH(40)}
                containerStyle={styles.amountInput}
                style={{wrapper: {marginBottom: 0}}}
              />
            </View>

            <View style={styles.inputSection}>
              <View style={styles.inputLabelContainer}>
                <Icon name="calendar" size={SIZES.xs} color={COLORS.gray2} />
                <Text style={styles.inputLabel}>Date</Text>
              </View>
              <View style={styles.datePickerContainer}>
                <DatePicker
                  date={newAdvanceDate}
                  onDateChange={setNewAdvanceDate}
                  mode="date"
                  style={{height: RH(100)}}
                />
              </View>
            </View>
          </View>

          <View style={styles.modalFooter}>
            <Button
              onPress={handleTransaction}
              backgroundColor={COLORS.primary}
              btnTitle={transactionToEdit ? 'Save Edit' : 'Add Advance'}
              fontColor={COLORS.white}
              wrapperStyle={styles.addButton}
              titleStyle={{fontSize: SIZES.xs}}
            />
            <Button
              onPress={onClose}
              backgroundColor={COLORS.white}
              btnTitle="Cancel"
              fontColor={COLORS.black}
              wrapperStyle={[styles.cancelButton]}
              titleStyle={{fontSize: SIZES.xs}}
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
    borderRadius: RW(12),
    width: '85%',
    maxWidth: RW(350),
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalBody: {
    padding: RW(12),
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: RH(12),
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: RH(8),
    marginHorizontal: RW(4),
    borderRadius: RW(6),
    borderWidth: 1,
    borderColor: COLORS.gray3,
    gap: RW(4),
  },
  selectedType: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeButtonText: {
    fontFamily: FONTS.PR,
    fontSize: SIZES.xs,
    color: COLORS.black,
  },
  selectedTypeText: {
    color: COLORS.white,
  },
  inputSection: {
    marginBottom: RH(12),
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RW(4),
    marginBottom: RH(4),
  },
  inputLabel: {
    fontFamily: FONTS.PR,
    fontSize: SIZES.xxs,
    color: COLORS.gray2,
  },
  amountInput: {
    width: '100%',
    marginBottom: 0,
  },
  datePickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray3,
    borderRadius: RW(6),
    padding: RW(8),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: RH(100),
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: RW(12),
    paddingBottom: RW(12),
  },
  addButton: {
    flex: 1,
    marginRight: RW(8),
  },
  cancelButton: {
    flex: 1,
  },
});

export default AddAdvanceModal;
