import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  BackHandler,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {COLORS, IMAGES, RH, FONTS, SIZES} from '../../theme';
import {MMKV} from 'react-native-mmkv';
import {useIsFocused} from '@react-navigation/native';
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1, backgroundColor: COLORS.gray3, padding: RH(20)}}>
      <View style={{flex: 1, justifyContent: 'center'}}>
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

        <Button
          onPress={handleLoginPress}
          backgroundColor={COLORS.primary}
          btnTitle="Login"
          fontColor={COLORS.white}
          style={{
            width: '100%',
          }}
          wrapperStyle={{marginTop: RH(20)}}
          titleStyle={{
            fontFamily: FONTS.PSB,
            fontSize: SIZES.sm,
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
