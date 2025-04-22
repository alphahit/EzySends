import React, {useState, useEffect} from 'react';
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
  doc,
  updateDoc,
} from '@react-native-firebase/firestore';

const EditEmployee = ({navigation, route}) => {
  const {employeeId, employeeData} = route.params;
  const [newEmployeeName, setNewEmployeeName] = useState(employeeData.name || '');
  const [newEmployeeContact, setNewEmployeeContact] = useState(employeeData.contact || '');
  const [newEmployeeAddress, setNewEmployeeAddress] = useState(employeeData.address || '');
  const [newEmployeeSalaryDate, setNewEmployeeSalaryDate] = useState(employeeData.salaryDate || '');
  const [newEmployeeSalaryAmount, setNewEmployeeSalaryAmount] = useState(employeeData.salaryAmount?.toString() || '');
  const [newEmployeeDescription, setNewEmployeeDescription] = useState(employeeData.description || '');
  const [isSalaryDateModalVisible, setIsSalaryDateModalVisible] = useState(false);

  const handleSaveEmployee = async () => {
    if (
      !newEmployeeName ||
      !newEmployeeAddress ||
      !newEmployeeSalaryDate ||
      !newEmployeeSalaryAmount
    ) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const db = getFirestore();
      const employeeRef = doc(db, 'employees', employeeId);

      await updateDoc(employeeRef, {
        name: newEmployeeName,
        contact: newEmployeeContact,
        address: newEmployeeAddress,
        salaryDate: newEmployeeSalaryDate,
        salaryAmount: parseFloat(newEmployeeSalaryAmount),
        description: newEmployeeDescription,
      });

      Alert.alert('Success', 'Employee updated successfully!');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      console.error('Error updating employee:', error);
      Alert.alert('Error', 'Failed to update employee.');
    }
  };

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
          <Text style={styles.title}>Edit Staff</Text>
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
                onPress={() => setIsSalaryDateModalVisible(true)}
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
              placeholder="Description"
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
                onPress={handleSaveEmployee}
                backgroundColor={COLORS.primary}
                btnTitle="Save"
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
  title: {
    fontSize: SIZES.l,
    fontFamily: FONTS.PEB,
    fontWeight: '600',
    color: COLORS.black,
    alignSelf: 'center',
    marginBottom: RH(20),
    textDecorationLine: 'underline',
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
    borderWidth: 1,
    borderColor: COLORS.gray3,
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
    width: '13%',
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

export default EditEmployee; 