import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Animated, Text, TouchableOpacity, View} from 'react-native';

import {COLORS} from '../../theme';

import styles from './styles';

export const AppButton = props => {
  const animatedButtonScale = new Animated.Value(1);
  // When button is pressed in, animate the scale to 1.030
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
        },
        {borderRadius: props?.buttonBorderRadius},
        {opacity: props?.isDisabled ? 0.4 : 1},
        styles.buttonStyle,
        props.buttonStyle,
        animatedScaleStyle,
      ]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={props.onPress}>
      {/* <View style={[styles.btnWrapper, props.btnWrapperStyle]}>
        {renderContent()}
      </View> */}
      <Text>{props.title}</Text>
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
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.buttonWithArrowWrapper}>
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
      />
    </View>
  );
};
