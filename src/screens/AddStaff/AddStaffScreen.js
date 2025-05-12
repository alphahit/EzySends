import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchHubs } from '../../store/hubSlice';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Switch,
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
  const [showHubModal, setShowHubModal] = useState(false);
  const dispatch = useDispatch();
  const { hubs } = useSelector(state => state.hub);

  useEffect(() => {
    dispatch(fetchHubs());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    emergencyContact: '',
    dob: '',
    gmail: '',
    panNumber: '',
    aadhaarNumber: '',
    joiningDate: '',
    hub: { hubId: '', hubName: '' },
    beneficiaryName: '',
    accountNumber: '',
    ifsc: '',
    bankName: '',
    accountUsername: '',
    accountPassword: '',
    isAccountActive: false,
    perFwd: '',
    perRvp: '',
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
      // If editing, ensure hub is an object with hubId and hubName
      setFormData({
        ...editData,
        hub: editData.hub && typeof editData.hub === 'object'
          ? editData.hub
          : { hubId: '', hubName: editData.hub || '' },
      });
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
      !formData.emergencyContact ||
      !formData.accountNumber
    ) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const staffData = {
      ...formData,
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
          hub: '',
          beneficiaryName: '',
          accountNumber: '',
          ifsc: '',
          bankName: '',
          accountUsername: '',
          accountPassword: '',
          isAccountActive: false,
          perFwd: '',
          perRvp: '',
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

        <TouchableOpacity
          onPress={() => setShowHubModal(true)}
          disabled={isView}>
          <AppTextInput
            label="Joining HUB"
            placeholder="Select from dropdown menu"
            value={formData.hub?.hubName || ''}
            editable={false}
            rightIcon={
              <Calendar width={24} height={24} fill={COLORS.primaryDark} />
            }
          />
        </TouchableOpacity>

        <AppTextInput
          label="Beneficiary Name"
          placeholder="Enter beneficiary name"
          value={formData.beneficiaryName}
          onChangeText={val => handleChange('beneficiaryName', val)}
          editable={isCreate || isEditing || mode === 'edit'}
        />

        <AppTextInput
          label="Account Number*"
          placeholder="Enter account number"
          value={formData.accountNumber}
          onChangeText={val => handleChange('accountNumber', val)}
          keyboardType="number-pad"
          editable={isCreate || isEditing || mode === 'edit'}
        />

        <AppTextInput
          label="IFSC"
          placeholder="Enter IFSC code"
          value={formData.ifsc}
          onChangeText={val => handleChange('ifsc', val)}
          autoCapitalize="characters"
          editable={isCreate || isEditing || mode === 'edit'}
        />

        <AppTextInput
          label="Bank Name"
          placeholder="Enter bank name"
          value={formData.bankName}
          onChangeText={val => handleChange('bankName', val)}
          editable={isCreate || isEditing || mode === 'edit'}
        />

        <AppTextInput
          label="Account Username"
          placeholder="Enter account username"
          value={formData.accountUsername}
          onChangeText={val => handleChange('accountUsername', val)}
          editable={isCreate || isEditing || mode === 'edit'}
        />

        <AppTextInput
          label="Password"
          placeholder="Enter password"
          value={formData.accountPassword}
          onChangeText={val => handleChange('accountPassword', val)}
          secureTextEntry
          editable={isCreate || isEditing || mode === 'edit'}
        />

        <View style={styles.toggleContainer}>
          <AppText style={styles.toggleLabel}>Account Activation</AppText>
          <Switch
            value={formData.isAccountActive}
            onValueChange={val => handleChange('isAccountActive', val)}
            disabled={isView}
            trackColor={{false: '#767577', true: COLORS.primaryColor}}
            thumbColor={formData.isAccountActive ? '#fff' : '#f4f3f4'}
          />
        </View>

        <AppTextInput
          label="Per FWD Price"
          placeholder="Enter FWD price"
          value={formData.perFwd}
          onChangeText={val => handleChange('perFwd', val)}
          keyboardType="numeric"
          editable={isCreate || isEditing || mode === 'edit'}
        />

        <AppTextInput
          label="Per RVP Price"
          placeholder="Enter RVP price"
          value={formData.perRvp}
          onChangeText={val => handleChange('perRvp', val)}
          keyboardType="numeric"
          editable={isCreate || isEditing || mode === 'edit'}
        />

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

      <Modal
        visible={showHubModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowHubModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <AppText style={styles.modalTitle}>Select HUB</AppText>
              <TouchableOpacity onPress={() => setShowHubModal(false)}>
                <AppText style={styles.closeButton}>✕</AppText>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              {hubs && hubs.length > 0 ? (
                hubs.map((hub, idx) => (
                  <TouchableOpacity
                    key={hub.id || idx}
                    style={styles.hubItem}
                    onPress={() => {
                      handleChange('hub', { hubId: hub.id, hubName: hub.hubName });
                      setShowHubModal(false);
                    }}>
                    <AppText>{hub.hubName || hub.hubCode || 'Unnamed Hub'}</AppText>
                  </TouchableOpacity>
                ))
              ) : (
                <AppText style={{textAlign: 'center', padding: 10}}>No hubs available</AppText>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

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
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: RHA(10),
  },
  toggleLabel: {
    fontFamily: 'Poppins',
    fontSize: RHA(18),
    lineHeight: RHA(27),
    color: '#000000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: RHA(20),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: RHA(20),
  },
  modalTitle: {
    fontSize: RHA(18),
    fontWeight: '600',
  },
  closeButton: {
    fontSize: RHA(20),
    color: '#666',
  },
  modalContent: {
    maxHeight: '80%',
  },
  hubItem: {
    padding: RHA(15),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
});

export default AddStaffScreen;
