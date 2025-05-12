import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  moderateVerticalScale as RHA,
  moderateScale as RPH,
} from 'react-native-size-matters';
import DatePicker from 'react-native-date-picker';
import {FONTS} from '../../theme/fonts';
import AppText from '../../components/AppText/AppText';
import AppTextInput from '../../components/AppTextInput';
import AppHeader from '../../components/AppHeader/AppHeader';
import Back from '../../assets/svg/back.svg';
import Calendar from '../../assets/svg/calendar.svg';
import {COLORS} from '../../theme/colors';
import {
  saveStaffDataToFirestore,
  updateStaffDataInFirestore,
} from '../../firebase/firebaseFunctions';

const AddStaffScreen = ({navigation, route}) => {
  const {mode = 'create', editData} = route.params || {};
  const [isEditing, setIsEditing] = useState(mode === 'edit');

  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    emergencyContact: '',
    dob: '',
    gmail: '',
    panNumber: '',
    aadhaarNumber: '',
    joiningDate: '',
  });
  const [originalData, setOriginalData] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [dateField, setDateField] = useState(null);

  // helper to format as "DD-MM-YYYY"
  const formatDate = date => {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear().toString();
    return `${d}-${m}-${y}`;
  };
  useEffect(() => {
    if (editData) {
      setFormData(editData);
      setOriginalData(editData);
    }
  }, [editData]);

  const isCreate = mode === 'create';
  const isView = mode === 'view' && !isEditing;

  const handleChange = (key, value) => {
    if (!isView) {
      setFormData({...formData, [key]: value});
    }
  };

  const handleDatePress = (field) => {
    if (!isView) {
      setDateField(field);
      setTempDate(
        formData[field]
          ? new Date(
              formData[field].split('-').reverse().join('-')
            )
          : new Date(),
      );
      setShowDatePicker(true);
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.contactNumber ||
      !formData.emergencyContact
    ) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const staffData = {
      name: formData.name,
      contactNumber: formData.contactNumber,
      emergencyContact: formData.emergencyContact,
      dob: formData.dob,
      gmail: formData.gmail,
      panNumber: formData.panNumber,
      aadhaarNumber: formData.aadhaarNumber,
      joiningDate: formData.joiningDate,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (mode === 'create') {
        await saveStaffDataToFirestore(staffData);
        setFormData({
          name: '',
          contactNumber: '',
          emergencyContact: '',
          dob: '',
          gmail: '',
          panNumber: '',
          aadhaarNumber: '',
          joiningDate: '',
        });
        Alert.alert('Success', 'Staff added successfully!', [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Staff Database', {
                screen: 'StaffTable'
              });
            },
          },
        ]);
      } else if (mode === 'edit') {
        await updateStaffDataInFirestore(editData.docId, staffData);
        Alert.alert('Success', 'Staff updated successfully!', [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Staff Database', {
                screen: 'StaffTable'
              });
            },
          },
        ]);
      }
    } catch (error) {
      console.error('Error handling submit:', error);
      Alert.alert('Error', 'Failed to save staff data. Please try again.');
    }
  };

  const handleCancel = () => {
    if (mode === 'view' && isEditing) {
      setFormData(originalData);
      setIsEditing(false);
    } else {
      navigation.goBack();
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleBackPress = () => navigation.goBack();

  const iconSize = RPH(24);

  const headerTitle =
    mode === 'create'
      ? 'Add New Staff'
      : isView
      ? 'Staff Details'
      : 'Edit Staff';

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title={headerTitle}
        leftIcon={
          <View style={styles.iconContainer}>
            <Back
              width={iconSize}
              height={iconSize}
              fill={COLORS.tableTextDark}
            />
          </View>
        }
        onPressLeft={handleBackPress}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <AppTextInput
          label="Name"
          placeholder="Enter Name"
          value={formData.name}
          onChangeText={val => handleChange('name', val)}
          editable={isCreate || isEditing || mode === 'edit'}
        />

        <AppTextInput
          label="Contact Number"
          placeholder="Enter phone number"
          value={formData.contactNumber}
          onChangeText={val => handleChange('contactNumber', val)}
          keyboardType="phone-pad"
          editable={isCreate || isEditing || mode === 'edit'}
        />

        <AppTextInput
          label="Emergency Contact Number"
          placeholder="Enter phone number"
          value={formData.emergencyContact}
          onChangeText={val => handleChange('emergencyContact', val)}
          keyboardType="phone-pad"
          editable={isCreate || isEditing || mode === 'edit'}
        />

        <TouchableOpacity
          onPress={() => handleDatePress('dob')}
          disabled={isView}>
          <AppTextInput
            label="D.O.B"
            placeholder="Select date of birth"
            value={formData.dob}
            editable={false}
            rightIcon={
              <Calendar width={24} height={24} fill={COLORS.primaryDark} />
            }
          />
        </TouchableOpacity>

        <AppTextInput
          label="Gmail"
          placeholder="Enter Gmail"
          value={formData.gmail}
          onChangeText={val => handleChange('gmail', val)}
          keyboardType="email-address"
          editable={isCreate || isEditing || mode === 'edit'}
        />

        <AppTextInput
          label="Pan Number"
          placeholder="Enter Pan number"
          value={formData.panNumber}
          onChangeText={val => handleChange('panNumber', val)}
          autoCapitalize="characters"
          editable={isCreate || isEditing || mode === 'edit'}
        />

        <AppTextInput
          label="Aadhaar Number"
          placeholder="Enter Aadhaar Number"
          value={formData.aadhaarNumber}
          onChangeText={val => handleChange('aadhaarNumber', val)}
          keyboardType="number-pad"
          editable={isCreate || isEditing || mode === 'edit'}
        />

        <TouchableOpacity
          onPress={() => handleDatePress('joiningDate')}
          disabled={isView}>
          <AppTextInput
            label="Date of joining"
            placeholder="Select date of joining"
            value={formData.joiningDate}
            editable={false}
            rightIcon={
              <Calendar width={24} height={24} fill={COLORS.primaryDark} />
            }
          />
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          {(isCreate || isEditing || mode === 'edit') && (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleSubmit}>
              <AppText style={styles.buttonText}>
                {mode === 'create' ? 'ADD' : 'UPDATE'}
              </AppText>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              styles.secondaryButton,
              isView && {marginLeft: 0},
            ]}
            onPress={isView ? handleEdit : handleCancel}>
            <AppText style={styles.buttonText}>
              {isView ? 'EDIT' : 'CANCEL'}
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <DatePicker
        modal
        open={showDatePicker}
        date={tempDate}
        mode="date"
        onConfirm={date => {
          setShowDatePicker(false);
          handleChange(dateField, formatDate(date));
        }}
        onCancel={() => setShowDatePicker(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF'},
  scrollView: {flex: 1},
  scrollContent: {paddingHorizontal: RPH(25), paddingBottom: RHA(40)},
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: RHA(30),
  },
  button: {
    flex: 1,
    height: RHA(43),
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {backgroundColor: '#274940', marginRight: RPH(14)},
  secondaryButton: {backgroundColor: '#C5C5C5', marginLeft: RPH(14)},
  buttonText: {color: '#FFFFFF', fontSize: RHA(16), textTransform: 'uppercase'},
  iconContainer: {
    backgroundColor: COLORS.primaryColor,
    width: RPH(40),
    height: RPH(40),
    borderRadius: RPH(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddStaffScreen;
