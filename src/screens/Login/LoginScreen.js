import React, {useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AppLogo from '../../assets/svg/appLogo.svg';
import AppButton from '../../components/AppButton/AppButton';
import AppText from '../../components/AppText/AppText';
import {COLORS} from '../../theme/colors';
import {FONTS, RH, RHA, RPH, RW, SIZES} from '../../theme/fonts';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';
import {useDispatch} from 'react-redux';
import { loginSuccess } from '../../store/loginSlice';

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('admin@gmail.com');
  const [password, setPassword] = useState('123456');
  const dispatch = useDispatch();
  // console.log("hello")
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in both email and password.');
      return;
    }
    console.log('AURH');
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password,
      );
      console.log('User logged in:', userCredential.user);
      // console.log('User ID:', userCredential.user.uid);
      // console.log('User Email:', userCredential.user.email);
      if (userCredential?.user?.email) {
        dispatch(
          loginSuccess({
            // accessToken: userCredential.user.stsTokenManager.accessToken,
            userId: userCredential?.user?.uid,
            userEmail: userCredential?.user?.email,
          })
        );
        navigation.reset({
          index: 0,
          routes: [{name: 'MainApp'}],
        });
      }
    } catch (error) {
      console.log('Login error:', error.message);
    }
  };
  const handleDragAndDropPress = () => {
    navigation.navigate('DragAndDrop');
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Logo and Company Name */}
          <View style={styles.logoContainer}>
            {/* Logo will be added here */}
            <AppLogo
              width={RPH(109)}
              height={RHA(80)}
              fill={COLORS.tableTextDark} // Match color if needed
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

          {/* Login Form */}
          <View style={styles.formContainer}>
            <AppText
              fontFamily={FONTS.PM}
              size={SIZES.l}
              style={styles.loginTitle}>
              ADMIN LOGIN
            </AppText>

            <View style={styles.inputContainer}>
              {/* Username/Email Input */}
              <View style={styles.inputFieldContainer}>
                <AppText style={styles.inputLabel} size={SIZES.m}>
                  Username/Email
                </AppText>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your Username"
                    placeholderTextColor="#888484"
                    value={username}
                    onChangeText={setUsername}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputFieldContainer}>
                <AppText style={styles.inputLabel} size={SIZES.m}>
                  Password
                </AppText>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your Password"
                    placeholderTextColor="#888484"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
              </View>

              {/* Reset Password Link */}
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ResetPassword');
                }}
                style={styles.resetPasswordContainer}>
                <AppText size={SIZES.s} style={styles.resetPasswordText}>
                  Reset Password?
                </AppText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <AppButton
            title="LOGIN NOW"
            backgroundColor={COLORS.primaryColor}
            textColor={COLORS.whiteText}
            onPress={handleLogin}
            wrapperStyle={styles.loginButtonWrapper}
            textStyle={styles.loginButtonText}
            style={{borderRadius: 0}}
          />
          {/* <AppButton
          onPress={handleDragAndDropPress}
          backgroundColor={COLORS.primaryLight}
          title="Try Drag & Drop"
          fontColor={COLORS.black}
          style={{
            width: '100%',
          }}
          wrapperStyle={{marginTop: RH(12)}}
          titleStyle={{
            fontFamily: FONTS.PSB,
            fontSize: SIZES.sm,
          }}
        /> */}
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
  resetPasswordContainer: {
    alignItems: 'flex-end',
  },
  resetPasswordText: {
    textAlign: 'right',
  },
  loginButtonWrapper: {
    marginTop: 'auto',
    marginBottom: RHA(30),
  },
  loginButtonText: {
    textTransform: 'uppercase',
    fontFamily: FONTS.PSM,
  },
});

export default LoginScreen;
