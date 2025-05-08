import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Back from '../../assets/svg/back.svg';
import AppLogo from '../../assets/svg/appLogo.svg';
import AppButton from '../../components/AppButton/AppButton';
import AppText from '../../components/AppText/AppText';
import {COLORS} from '../../theme/colors';
import {FONTS, RHA, RPH, RW, SIZES} from '../../theme/fonts';

const ResetPasswordScreen = ({navigation}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleReset = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return AppText.alert('Error', 'Please fill all fields');
    }
    if (newPassword !== confirmPassword) {
      return AppText.alert('Error', 'New passwords do not match');
    }
    // TODO: call your reset-password API
    console.log('Resetting password:', {oldPassword, newPassword});
    navigation.goBack();
  };
  const iconSize = RPH(24);
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.iconContainer}>
            <Back
              width={iconSize}
              height={iconSize}
              fill={COLORS.tableTextDark}
            />
          </TouchableOpacity>
          {/* Logo + Title */}
          <View style={styles.logoContainer}>
            <AppLogo
              width={RPH(109)}
              height={RHA(80)}
              fill={COLORS.tableTextDark}
            />
            <View style={styles.logoTextContainer}>
              <AppText
                fontFamily={FONTS.PSM}
                size={SIZES.xxl}
                color={COLORS.primaryDark}
                style={styles.companyName}>
                EZY SENDS
              </AppText>
              <AppText size={SIZES.xs} color="#565656" style={styles.tagline}>
                YOUR PACKAGE OUR PRIORITY
              </AppText>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <AppText
              fontFamily={FONTS.PM}
              size={SIZES.l}
              style={styles.loginTitle}>
              RESET PASSWORD
            </AppText>

            <View style={styles.inputContainer}>
              {/* Old Password */}
              <View style={styles.inputFieldContainer}>
                <AppText style={styles.inputLabel} size={SIZES.m}>
                  Old Password
                </AppText>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your old password"
                    placeholderTextColor="#888484"
                    secureTextEntry
                    value={oldPassword}
                    onChangeText={setOldPassword}
                  />
                </View>
              </View>

              {/* New Password */}
              <View style={styles.inputFieldContainer}>
                <AppText style={styles.inputLabel} size={SIZES.m}>
                  New Password
                </AppText>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your new password"
                    placeholderTextColor="#888484"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                </View>
              </View>

              {/* Confirm New Password */}
              <View style={styles.inputFieldContainer}>
                <AppText style={styles.inputLabel} size={SIZES.m}>
                  Retype New Password
                </AppText>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Retype your new password"
                    placeholderTextColor="#888484"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Reset Button */}
          <AppButton
            title="RESET PASSWORD"
            backgroundColor={COLORS.primaryColor}
            textColor={COLORS.whiteText}
            onPress={handleReset}
            wrapperStyle={styles.loginButtonWrapper}
            textStyle={styles.loginButtonText}
            style={{borderRadius: 0}}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBackgroundColor,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: RW(25),
    paddingBottom: RHA(30),
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: RHA(60),
    marginBottom: RHA(40),
  },
  logoTextContainer: {
    alignItems: 'center',
    marginTop: RHA(10),
  },
  companyName: {
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  tagline: {
    textAlign: 'center',
    textTransform: 'uppercase',
    marginTop: RHA(2),
  },
  formContainer: {
    flex: 1,
    marginBottom: RHA(30),
  },
  loginTitle: {
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: RHA(43),
  },
  inputContainer: {
    gap: RHA(17),
  },
  inputFieldContainer: {
    gap: RHA(10),
  },
  inputLabel: {
    color: '#000000',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#558479',
    borderRadius: RPH(4),
    height: RHA(42),
    paddingHorizontal: RW(10),
  },
  input: {
    flex: 1,
    fontFamily: FONTS.PR,
    fontSize: RW(16),
    color: '#000000',
  },
  loginButtonWrapper: {
    marginTop: 'auto',
    marginBottom: RHA(30),
  },
  loginButtonText: {
    textTransform: 'uppercase',
    fontFamily: FONTS.PSM,
  },
  iconContainer: {
    backgroundColor: COLORS.primaryColor,
    width: RPH(40),
    height: RPH(40),
    borderRadius: RPH(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: RPH(26),
  },
});

export default ResetPasswordScreen;
