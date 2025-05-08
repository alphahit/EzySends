import React from 'react';
import {Text} from 'react-native';
import {FONTS, SIZES} from '../../theme';
import {COLORS} from '../../theme/colors';

const AppText = ({
  children,
  color = COLORS.blackText,
  size = SIZES.s,
  fontFamily = FONTS.PR,
  numberOfLines,
  style = {},
  onPress = () => {},
  onPressAllowed = false,
}) => {
  const combinedStyle = [
    {
      color: color ?? COLORS.blackText,
      fontSize: size ?? SIZES.s,
      fontFamily,
    },
    style,
  ];

  return (
    <Text
      {...(onPressAllowed && {onPress})}
      numberOfLines={numberOfLines}
      style={combinedStyle}>
      {children}
    </Text>
  );
};

export default AppText;
