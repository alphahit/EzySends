import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import InputField from '../../components/InputField';
import {COLORS, SIZES, FONTS, RH, RW} from '../../theme';
import {Button} from '../../components/Button/Button';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore';

const AddEmployee = ({navigation}) => {
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeeContact, setNewEmployeeContact] = useState('');
  const [newEmployeeAddress, setNewEmployeeAddress] = useState('');
  // Remove the InputField for Salary Date and use a custom value
  const [newEmployeeSalaryDate, setNewEmployeeSalaryDate] = useState('');
  const [newEmployeeSalaryAmount, setNewEmployeeSalaryAmount] = useState('');
// Description state
const [newEmployeeDescription, setNewEmployeeDescription] = useState('');
// Control the Salary Date Picker modal visibility
const [isSalaryDateModalVisible, setIsSalaryDateModalVisible] = useState(false);

  const handleAddEmployee = async () => {
    if (
      !newEmployeeName ||
      !newEmployeeAddress ||
      !newEmployeeSalaryDate ||
      !newEmployeeSalaryAmount
      // Description is optional, do not require
    ) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const db = getFirestore();
      const employeesRef = collection(db, 'employees');

      await addDoc(employeesRef, {
        name: newEmployeeName,
        contact: newEmployeeContact,
        address: newEmployeeAddress,
        salaryDate: newEmployeeSalaryDate,
        salaryAmount: parseFloat(newEmployeeSalaryAmount),
        description: newEmployeeDescription,
        totalAdvance: 0,
        createdAt: serverTimestamp(),
      });

      Alert.alert('Success', 'Employee added successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding employee:', error);
      Alert.alert('Error', 'Failed to add employee.');
    }
  };

  // Create an array for days 1 to 28
  const days = Array.from({length: 28}, (_, i) => (i + 1).toString());

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? RH(60) : RH(20)}>
      <Pressable onPress={Keyboard.dismiss} style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <InputField
              placeholder="Name"
              value={newEmployeeName}
              onChangeText={setNewEmployeeName}
              label="Name"
              labelStyle={{fontSize: SIZES.xs}}
              inputStyle={{fontSize: SIZES.xs}}
              inputHeight={RH(40)}
            />
            <InputField
              placeholder="Contact"
              value={newEmployeeContact}
              onChangeText={setNewEmployeeContact}
              label="Contact"
              keyboardType="phone-pad"
              labelStyle={{fontSize: SIZES.xs}}
              inputStyle={{fontSize: SIZES.xs}}
              inputHeight={RH(40)}
            />
            <InputField
              placeholder="Address"
              value={newEmployeeAddress}
              onChangeText={setNewEmployeeAddress}
              label="Address"
              labelStyle={{fontSize: SIZES.xs}}
              inputStyle={{fontSize: SIZES.xs}}
              inputHeight={RH(40)}
            />
            {/* Salary Date Picker Field */}
            <View style={styles.salaryDateContainer}>
              <Text
                style={[
                  styles.label,
                  {
                    fontSize: SIZES.xs,
                    color: COLORS.black,
                  },
                ]}>
                Salary Date
              </Text>
              <Pressable
                onPress={() =>{
                  // Keyboard.dismiss();
                  setIsSalaryDateModalVisible(true)
                }}
                style={styles.datePickerField}>
                <Text style={styles.datePickerText}>
                  {newEmployeeSalaryDate
                    ? newEmployeeSalaryDate
                    : 'Salary Date'}
                </Text>
              </Pressable>
            </View>
            <InputField
              placeholder="Salary Amount"
              value={newEmployeeSalaryAmount}
              onChangeText={setNewEmployeeSalaryAmount}
              label="Salary Amount"
              keyboardType="numeric"
              labelStyle={{fontSize: SIZES.xs}}
              inputStyle={{fontSize: SIZES.xs}}
              inputHeight={RH(40)}
            />
            <InputField
              placeholder="Description (optional)"
              value={newEmployeeDescription}
              onChangeText={setNewEmployeeDescription}
              label="Description"
              labelStyle={{fontSize: SIZES.xs}}
              inputStyle={{fontSize: SIZES.xs}}
              inputHeight={RH(40)}
              multiline
              numberOfLines={3}
              style={{marginBottom: RH(8)}}
            />
            <View style={styles.buttonContainer}>
              <Button
                onPress={handleAddEmployee}
                backgroundColor={COLORS.primary}
                btnTitle="Add"
                fontColor={COLORS.white}
                wrapperStyle={{flex: 1, marginRight: RW(8)}}
                titleStyle={{fontSize: SIZES.xs}}
              />
              <Button
                onPress={() => navigation.goBack()}
                backgroundColor={COLORS.white}
                btnTitle="Cancel"
                fontColor={COLORS.black}
                wrapperStyle={[
                  {flex: 1, marginLeft: RW(8)},
                  styles.cancelButton,
                ]}
                titleStyle={{fontSize: SIZES.xs}}
              />
            </View>
          </View>
        </ScrollView>
        {/* Salary Date Modal */}
        <Modal
          transparent
          visible={isSalaryDateModalVisible}
          animationType="fade">
          <Pressable
            onPress={() => setIsSalaryDateModalVisible(false)}
            style={styles.modalOverlay}>
            <View onStartShouldSetResponder={() => true} style={styles.dateModalContent}>
              <View style={styles.dateOptionsContainer}>
                {days.map(day => (
                  <Pressable
                    key={day}
                    onPress={() => {
                      setNewEmployeeSalaryDate(day);
                      setIsSalaryDateModalVisible(false);
                    }}
                    style={styles.dateOption}>
                    <Text style={styles.dateOptionText}>{day}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </Pressable>
        </Modal>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray3,
  },
  scrollContent: {
    flexGrow: 1,
    padding: RW(16),
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  salaryDateContainer: {
    marginBottom: RH(8),
  },
  label: {
    color: COLORS.white,
    fontFamily: FONTS.PSB,
    marginBottom: RH(4),
  },
  datePickerField: {
    height: RH(40),
    justifyContent: 'center',
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.gray3,
    borderWidth: RW(1.5),
    borderRadius: RW(5),
    paddingHorizontal: RW(12),
  },
  datePickerText: {
    fontFamily: FONTS.PR,
    fontSize: SIZES.xs,
    color: COLORS.darkBlack,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: RH(16),
  },
  cancelButton: {
    // Additional styles for cancel button if needed
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateModalContent: {
    backgroundColor: COLORS.white,
    borderRadius: RW(12),
    padding: RW(20),
    width: '80%',
    maxWidth: RW(400),
    maxHeight: '70%',
    elevation: 5,
  },

  dateOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: RH(10),
  },
  dateOption: {
    width: '13%', // Approximately 7 items per row (7 x 13% ≈ 91% with spacing)
    marginVertical: RH(8),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: RH(10),
    backgroundColor: COLORS.primaryLight,
    borderRadius: RW(4),
  },
  dateOptionText: {
    fontFamily: FONTS.PR,
    fontSize: RW(14),
    color: COLORS.black,
  },
});

export default AddEmployee;
