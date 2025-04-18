import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, Pressable} from 'react-native';
import {COLORS, FONTS, Icons, RH, RW, SIZES} from '../theme';

const InputField = ({
  value = '',
  iconType = 'Email',
  placeholder = '',
  label = '',
  isSecure = false,
  secureField = false,
  onChangeText = () => {},
  onFocus = () => {},
  onBlur = () => {},
  isError = false,
  style = {},
  keyboardType = 'default',
  labelStyle = {},
  inputStyle = {},
  inputHeight = RH(48),
}) => {
  const [secureEntry, setSecureEntry] = useState(isSecure);

  const localStyles = StyleSheet.create({
    wrapper: {
      //
    },
    label: {
      color: COLORS.black,
      fontSize: RW(13),
      fontWeight: '500',
      marginBottom: RH(4),
      ...labelStyle,
    },
    container: {
      alignItems: 'center',
      backgroundColor: COLORS.lightGray,
      borderColor: isError ? COLORS.dangerDark : COLORS.gray3,
      borderRadius: RW(5),
      borderWidth: RW(1.5),
      flexDirection: 'row',
      height: inputHeight,
      paddingHorizontal: RW(12),
    },
    inputContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      flex: 1,
    },
    input: {
      color: COLORS.darkBlack,
      flex: 1,
      fontSize: SIZES.sl,
      fontWeight: '600',
      ...inputStyle,
    },
    spaceRight: {
      marginRight: RW(12),
    },
  });

  return (
    <View style={[localStyles.wrapper, style.wrapper]}>
      {label ? (
        <Text style={[localStyles.label, style.label]}>{label}</Text>
      ) : null}
      <View style={localStyles.container}>
        <View style={[localStyles.inputContainer, style.inputContainer]}>
          <TextInput
            placeholder={placeholder}
            placeholderTextColor={COLORS.gray}
            style={localStyles.input}
            autoComplete="off"
            autoCorrect={false}
            autoCapitalize="none"
            secureTextEntry={secureEntry}
            value={value}
            maxLength={isSecure ? 16 : 50}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
            keyboardType={keyboardType}
          />
        </View>
      </View>
    </View>
  );
};

export default InputField;
