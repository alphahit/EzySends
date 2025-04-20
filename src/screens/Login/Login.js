import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  BackHandler,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import {COLORS, IMAGES, RH, FONTS, SIZES} from '../../theme';
import {MMKV} from 'react-native-mmkv';
import {useIsFocused} from '@react-navigation/native';
import {Button} from '../../components/Button/Button';
import InputField from '../../components/InputField';

const Login = ({navigation}) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const storage = new MMKV();

  const handleLoginPress = async () => {
    // Reset errors
    setPhoneError(false);
    setPasswordError(false);

    // Validate phone number
    // if (phone !== '9437128448') {
    //   setPhoneError(true);
    //   Alert.alert('Error', 'Invalid phone number');
    //   return;
    // }

    // // Validate password
    // if (password !== 'Bej@8484') {
    //   setPasswordError(true);
    //   Alert.alert('Error', 'Invalid password');
    //   return;
    // }

    // // If both are correct, proceed to login
    // storage.set('phone', phone);
    // storage.set('password', password);
    setPhone('');
    setPassword('');
    navigation.navigate('Home');
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      setPhoneError(false);
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
          placeholder="Phone"
          label="Phone"
          iconType="Phone"
          isError={phoneError}
          value={phone}
          keyboardType="phone-pad"
          onChangeText={value => {
            setPhoneError(false);
            setPhone(value);
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
