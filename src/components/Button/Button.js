import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Animated, Text, TouchableOpacity, View} from 'react-native';
import {COLORS, FONTS, SIZES, RH} from '../../theme';
import styles from './styles';

export const AppButton = props => {
  const animatedButtonScale = new Animated.Value(1);

  // When button is pressed in, animate the scale to 1.03
  const onPressIn = () => {
    Animated.spring(animatedButtonScale, {
      toValue: 1.03,
      useNativeDriver: true,
    }).start();
  };

  // When button is pressed out, animate the scale back to 1
  const onPressOut = () => {
    Animated.spring(animatedButtonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // The animated style for scaling the button within the Animated.View
  const animatedScaleStyle = {
    transform: [{scale: animatedButtonScale}],
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={props?.isDisabled}
      style={[
        {
          backgroundColor: props.buttonColor ?? COLORS.white,
          paddingVertical: RH(12),
          paddingHorizontal: RH(20),
          borderRadius: RH(8),
          elevation: 3,
          shadowColor: COLORS.black,
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          width: '100%',
          alignItems: 'center',
        },
        {opacity: props?.isDisabled ? 0.4 : 1},
        props.buttonStyle,
        animatedScaleStyle,
      ]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={props.onPress}>
      <Text
        style={[
          {
            color: props.textColor,
            fontFamily: FONTS.PSB,
            fontSize: SIZES.sm,
            textAlign: 'center',
          },
          props.titleStyle,
        ]}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

export const Button = ({
  isDisabled = false,
  btnTitle = 'Get Started',
  onPress = () => {},
  isLoading = false,
  backgroundColor = COLORS.white,
  fontColor = COLORS.black,
  titleStyle,
  wrapperStyle,
}) => {
  const navigation = useNavigation();

  return (
    <View
      style={[styles.buttonWithArrowWrapper, {width: '100%'}, wrapperStyle]}>
      <AppButton
        isLoading={isLoading}
        isDisabled={isDisabled}
        onPress={() => {
          onPress != null ? onPress() : navigation.goBack();
        }}
        buttonColor={backgroundColor}
        buttonStyle={{alignItems: 'center'}}
        title={btnTitle}
        textColor={fontColor}
        titleStyle={titleStyle}
      />
    </View>
  );
};
