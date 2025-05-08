import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  moderateVerticalScale as RHA,
  moderateScale as RPH,
} from 'react-native-size-matters';
import { lightColors as COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';
import AppText from '../AppText/AppText';

const AppTextInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  rightIcon,
  multiline,
  numberOfLines,
  style,
  containerStyle,
  labelStyle,
  inputStyle,
  autoCapitalize = 'none',
  editable = true,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <AppText
          style={[styles.label, labelStyle]}
        >
          {label}
        </AppText>
      )}
      <View style={[styles.inputContainer, style, !editable && styles.disabledInput]}>
        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#888484"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          autoCapitalize={autoCapitalize}
          editable={editable}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={props.onRightIconPress}
            disabled={!props.onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
    width: '100%',
    marginBottom: RHA(17),
  },
  label: {
    width: '100%',
    height: RHA(27),
    fontFamily: FONTS.PR,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: RHA(18),
    lineHeight: RHA(27),
    color: '#000000',
  },
  inputContainer: {
    boxSizing: 'border-box',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    paddingHorizontal: RPH(10),
    gap: RPH(10),
    width: '100%',
    height: RHA(42),
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#558479',
    borderRadius: 0,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: FONTS.PR,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: RHA(16),
    lineHeight: RHA(24),
    color: '#000000',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledInput: {
    backgroundColor: '#F0F0F0',
    borderColor: '#D1D1D1',
  },
});

export default AppTextInput; 