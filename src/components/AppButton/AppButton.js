import React, {useRef} from 'react';
import {
  Animated,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS, SIZES, RH} from '../../theme';
import AppText from '../AppText/AppText';

const AppButton = ({
  title = 'Get Started',
  onPress,
  disabled = false,
  loading = false,
  backgroundColor = COLORS.primaryDark,
  textColor = COLORS.whiteText,
  style,
  textStyle,
  wrapperStyle,
  // animation config
  scaleOnPress = true,
  disabledOpacity = 0.4,
}) => {
  const navigation = useNavigation();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (scaleOnPress) {
      Animated.spring(scale, {
        toValue: 1.03,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (scaleOnPress) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePress = () => {
    if (disabled || loading) return;
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, wrapperStyle]}>
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={disabled || loading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={[
          styles.button,
          style,
          {
            backgroundColor,
            opacity: disabled ? disabledOpacity : 1,
            transform: [{scale}],
          },
        ]}>
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <AppText style={[styles.text, {color: textColor}, textStyle]}>
            {title}
          </AppText>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: RH(10),
  },
  button: {
    flex: 1,
    paddingVertical: RH(12),
    paddingHorizontal: RH(20),
    borderRadius: RH(8),
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    fontFamily: FONTS.PSM,
    fontSize: SIZES.s,
    textAlign: 'center',
  },
});

export default AppButton;
