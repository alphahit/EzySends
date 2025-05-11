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
import AppText from '../../components/AppText/AppText';
import AppTextInput from '../../components/AppTextInput';
import AppHeader from '../../components/AppHeader/AppHeader';
import Back from '../../assets/svg/back.svg';
import Calendar from '../../assets/svg/calendar.svg';
import {COLORS} from '../../theme/colors';
import {saveHubDataToFirestore} from '../../firebase/firebaseFunctions';

const AddHubScreen = ({navigation, route}) => {
  const {mode = 'create', editData} = route.params || {};
  // Internal editing state for view mode
  const [isEditing, setIsEditing] = useState(mode === 'edit');

  const [formData, setFormData] = useState({
    hubName: '',
    hubCode: '',
    startingDate: '',
    location: '',
    contactNumber: '',
    managerName: '',
    capacity: '',
  });
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    if (editData) {
      const init = {
        hubName: editData.hubName || '',
        hubCode: editData.hubCode || '',
        startingDate: editData.startingDate || '',
        location: editData.location || '',
        contactNumber: editData.contactNumber || '',
        managerName: editData.managerName || '',
        capacity: editData.capacity || '',
      };
      setFormData(init);
      setOriginalData(init);
    }
  }, [editData]);

  const isView = mode === 'view' && !isEditing;
  const isCreate = mode === 'create';

  const handleChange = (key, value) => {
    if (!isView) setFormData({...formData, [key]: value});
  };

  const handleSubmit = async () => {
    const {
      hubName,
      hubCode,
      startingDate,
      location,
      contactNumber,
      managerName,
      capacity,
    } = formData;

    // Validate required fields
    if (!hubName || !hubCode) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const hubData = {
      hubName,
      hubCode,
      startingDate,
      location,
      contactNumber,
      managerName,
      capacity,
      createdAt: new Date().toISOString(),
    };

    try {
      if (mode === 'create') {
        // Save new hub data to Firestore
        await saveHubDataToFirestore(hubData);
        setFormData({
          hubName: '',
          hubCode: '',
          startingDate: '',
          location: '',
          contactNumber: '',
          managerName: '',
          capacity: '',
        });

        Alert.alert('Success', 'Hub added successfully!', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      } else if (mode === 'edit') {
        // Update existing hub data (you'll need to implement update logic in Firestore)
        console.log('Hub updated:', hubData);
        Alert.alert('Success', 'Hub updated successfully!', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      } else if (mode === 'view') {
        // Save after edit
        console.log('Hub updated:', hubData);
        Alert.alert('Success', 'Hub updated successfully!', [
          {text: 'OK', onPress: () => setIsEditing(false)},
        ]);
      }
    } catch (error) {
      console.error('Error saving hub data:', error.message);
      Alert.alert('Error', 'Failed to save hub data. Please try again.');
    }
  };
  const handleCancel = () => {
    if (mode === 'view' && isEditing) {
      // cancel edit: revert and back to view
      setFormData(originalData);
      setIsEditing(false);
    } else {
      navigation.goBack();
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleBackPress = () => navigation.goBack();

  const iconSize = RPH(24);

  // Determine header title
  const headerTitle =
    mode === 'create'
      ? 'Add New Hub'
      : isView
      ? 'Hub Details'
      : mode === 'edit'
      ? 'Edit Hub'
      : isEditing
      ? 'Edit Hub'
      : 'Hub Details';

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
        {/* Hub Name */}
        <AppTextInput
          label="Hub Name"
          placeholder="Enter Hub Name"
          value={formData.hubName}
          onChangeText={val => handleChange('hubName', val)}
          editable={isCreate || isEditing || mode === 'edit'}
        />

        {/* Hub Code */}
        <AppTextInput
          label="Hub Code"
          placeholder="Enter Hub Code"
          value={formData.hubCode}
          onChangeText={val => handleChange('hubCode', val)}
          editable={isCreate || isEditing || mode === 'edit'}
        />

        {/* Starting Date */}
        <AppTextInput
          label="Starting Date"
          placeholder="Select starting date"
          value={formData.startingDate}
          editable={false}
          rightIcon={
            <Calendar width={24} height={24} fill={COLORS.primaryDark} />
          }
          onRightIconPress={() =>
            !isView && !isCreate && console.log('Open date picker')
          }
        />

        {/* Location */}
        <AppTextInput
          label="Location"
          placeholder="Enter location"
          value={formData.location}
          onChangeText={val => handleChange('location', val)}
          editable={isCreate || isEditing || mode === 'edit'}
        />

        {/* Contact Number */}
        <AppTextInput
          label="Contact Number"
          placeholder="Enter contact number"
          keyboardType="phone-pad"
          value={formData.contactNumber}
          onChangeText={val => handleChange('contactNumber', val)}
          editable={isCreate || isEditing || mode === 'edit'}
        />

        {/* Manager Name */}
        <AppTextInput
          label="Manager Name"
          placeholder="Enter manager name"
          value={formData.managerName}
          onChangeText={val => handleChange('managerName', val)}
          editable={isCreate || isEditing || mode === 'edit'}
        />

        {/* Capacity */}
        <AppTextInput
          label="Capacity"
          placeholder="Enter capacity"
          value={formData.capacity}
          onChangeText={val => handleChange('capacity', val)}
          editable={isCreate || isEditing || mode === 'edit'}
        />

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {/** Primary btn **/}
          {(isCreate || isEditing || mode === 'edit') && (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleSubmit}>
              <AppText style={styles.buttonText}>
                {(mode === 'create' && 'ADD') ||
                  (mode === 'edit' && 'UPDATE') ||
                  (isEditing && 'SAVE')}
              </AppText>
            </TouchableOpacity>
          )}

          {/** Secondary btn **/}
          <TouchableOpacity
            style={[
              styles.button,
              styles.secondaryButton,
              isView && {marginLeft: 0},
            ]}
            onPress={isView ? handleEdit : handleCancel}>
            <AppText style={styles.buttonText}>
              {isView
                ? 'EDIT'
                : (isEditing && 'CANCEL') ||
                  (mode === 'create' && 'CANCEL') ||
                  (mode === 'edit' && 'CANCEL')}
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
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

export default AddHubScreen;
