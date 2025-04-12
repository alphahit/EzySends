import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  BackHandler,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {COLORS, IMAGES, RH} from '../../theme';
import {MMKV} from 'react-native-mmkv';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useIsFocused} from '@react-navigation/native';
import styles from './styles';
import {Button} from '../../components/Button/Button';
import InputField from '../../components/InputField';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const storage = new MMKV();

  // Dummy login function simulating an API call

  const handleLoginPress = async () => {

    navigation.navigate('Home');


    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //   setEmailError(true);
    //   return;
    // }
    // if (password.length < 8) {
    //   setPasswordError(true);
    //   return;
    // }
    // // const deviceId = Date.now().toString();

    // storage.set('email', email);
    // storage.set('password', password);

    // setEmail('');
    // setPassword('');

    // if (email === 'bej@gmail.com' && password === 'bej13579')
    //   navigation.navigate('Home');
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      setEmailError(false);
      setPasswordError(false);
    }
  }, [isFocused]);

  const handleBackPress = () => {
    BackHandler.exitApp();
    return true;
  };

  const scrollRef = useRef(null);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: COLORS.gray3, padding: 20}}>
      <Text style={styles.welcomeText}>Welcome</Text>
      <InputField
        placeholder="Email"
        label="Email"
        iconType="Email"
        isError={emailError}
        value={email}
        keyboardType="email-address"
        onChangeText={value => {
          setEmailError(false);
          setEmail(value);
        }}
      />
      <InputField
        placeholder="Password"
        label="Password"
        iconType="Password"
        isError={passwordError}
        isSecure
        secureField
        value={password}
        onChangeText={value => {
          setPasswordError(false);
          setPassword(value);
        }}
      />
      <View style={styles.forgotPasswordContainer}>
        <TouchableOpacity
          onPress={() => {
            console.log('ForgotPassword');
            // navigation.navigate('ForgotPassword')
          }}>
          <Text style={styles.forgotPasswordText}>Forgot Password</Text>
        </TouchableOpacity>
      </View>

      <Button
        onPress={handleLoginPress}
        backgroundColor={COLORS.white}
        btnTitle="Login"
        fontColor={COLORS.black}
      />
    </View>
  );
};

export default Login;
