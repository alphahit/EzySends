import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {COLORS, FONTS, SIZES, RH, RW, RPH, RHA} from '../../theme';
import AppText from '../AppText/AppText';

const SearchInput = ({
  placeholder = 'Search...',
  value,
  onChangeText,
  onSubmitEditing,
  onClear,
  style,
  inputStyle,
  showLabel = false,
  label = 'Search',
  labelStyle,
  rightIcon,
  leftIcon,
}) => {
  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <AppText
          fontFamily={FONTS.PR}
          size={SIZES.m}
          style={[styles.label, labelStyle]}>
          {label}
        </AppText>
      )}
      <View style={styles.inputContainer}>
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#888484"
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          style={[
            styles.input,
            inputStyle,
            leftIcon && { paddingLeft: RW(40) },
            rightIcon && { paddingRight: RW(40) },
          ]}
        />
        {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
        {value && value.length > 0 && onClear && (
          <TouchableOpacity style={styles.clearButton} onPress={onClear}>
            <AppText size={SIZES.m} color={COLORS.tableTextDark}>
              ✕
            </AppText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: RH(10),
  },
  label: {
    color: COLORS.tableTextDark,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: RHA(42),
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#558479',
    borderRadius: RPH(4),
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: FONTS.PR,
    fontSize: RW(16),
    lineHeight: RH(24),
    color: COLORS.tableTextDark,
    paddingHorizontal: RW(10),
  },
  leftIconContainer: {
    position: 'absolute',
    left: RW(10),
    zIndex: 1,
  },
  rightIconContainer: {
    position: 'absolute',
    right: RW(10),
    zIndex: 1,
  },
  clearButton: {
    position: 'absolute',
    right: RW(10),
    padding: RW(5),
    zIndex: 1,
  },
});

export default SearchInput; 