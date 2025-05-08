import React, { FC } from 'react';
import { View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';

// Assuming you have a theme file for colors, fonts etc.
// If not, replace with your actual colors/font values
import {  FONTS, RHA, RPH } from '../../theme'; // Adjust path as needed
import { COLORS } from '../../theme/colors';
import AppText from '../AppText/AppText';

interface AppHeaderProps {
  title: string;
  leftIcon?: React.ReactNode; // Component/Element for the left icon
  onPressLeft?: () => void;  // Action for left icon press
  rightIcon?: React.ReactNode; // Component/Element for the right icon
  onPressRight?: () => void; // Action for right icon press
  style?: StyleProp<ViewStyle>; // Optional custom style for the main container
  titleStyle?: StyleProp<TextStyle>; // Optional custom style for the title
  iconContainerStyle?: StyleProp<ViewStyle>; // Optional custom style for icon wrappers
}

const AppHeader: FC<AppHeaderProps> = ({
  title,
  leftIcon,
  onPressLeft,
  rightIcon,
  onPressRight,
  style,
  titleStyle,
  iconContainerStyle,
}) => {

  const renderIcon = (
    icon: React.ReactNode | undefined,
    onPress: (() => void) | undefined
  ) => {
    // Always render the wrapper view to maintain layout balance
    // Apply the shared iconContainerStyle and the specific side style
    return (
      <View style={[styles.iconWrapper, iconContainerStyle]}>
        {icon && ( // Only render TouchableOpacity and Icon if icon exists
          <TouchableOpacity hitSlop={20} onPress={onPress} disabled={!onPress}>
            {icon}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {/* Left Icon Area */}
      {renderIcon(leftIcon, onPressLeft)}

      {/* Center Title Area */}
      <View style={styles.titleContainer}>
        <AppText style={[styles.titleText, titleStyle]} numberOfLines={1}>
          {title}
        </AppText>
      </View>

      {/* Right Icon Area */}
      {renderIcon(rightIcon, onPressRight)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Will place items correctly due to wrappers
    height: RHA(55), // Responsive height
    paddingHorizontal: RPH(15), // Responsive padding
    marginTop: RPH(10),
    backgroundColor: COLORS.screenBackgroundColor, // Example background color

  },
  iconWrapper: {
    width: RPH(40), // Fixed responsive width for balance
    height: '100%', // Take full height of header
    justifyContent: 'center',
    alignItems: 'center', // Center icon within the wrapper
     // backgroundColor: 'lightblue', // DEBUG: uncomment to see wrapper area
  },
  titleContainer: {
    flex: 1, // Take remaining space
    justifyContent: 'center',
    alignItems: 'center', // Center title text container
    marginHorizontal: RPH(5), // Add some space between title and icons
    // backgroundColor: 'lightcoral', // DEBUG: uncomment to see title area
  },
  titleText: {
    fontSize: RPH(18), // Responsive font size
    color: COLORS.tableTextDark, // Example text color
    fontFamily: FONTS.PB, // Example font family (Bold)
    textAlign: 'center',
  },
});

export default AppHeader;