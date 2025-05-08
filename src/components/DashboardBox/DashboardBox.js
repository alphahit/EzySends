import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {COLORS, FONTS, SIZES, RH, RW, RPH, RHA} from '../../theme';
import AppText from '../AppText/AppText';

const DashboardBox = ({
  title,
  value,
  icon,
  style,
  backgroundColor = COLORS.primaryDark,
  textColor = COLORS.whiteText,
  onPress = () => {}, // proper no-op default
  disabled = true, // disabled prop, defaults to true
  largeText = true,
  headerText = true,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.container,
        {backgroundColor}, // dim when disabled
        style,
      ]}>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          {headerText && (
            <AppText
              size={SIZES.m}
              fontFamily={FONTS.PM}
              color={textColor}
              style={styles.title}>
              {title}
            </AppText>
          )}
        </View>
        {largeText ? (
          <AppText
            size={SIZES.xxl}
            fontFamily={FONTS.PB}
            color={textColor}
            style={styles.value}>
            {value}
          </AppText>
        ) : (
          <AppText
            size={SIZES.ml}
            fontFamily={FONTS.PM}
            color={textColor}
            style={styles.value}>
            {value}
          </AppText>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: RPH(17),
    height: RHA(116),
    width: '47%',
  },
  contentContainer: {
    flexDirection: 'column',
    gap: RHA(24),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RPH(7),
  },
  iconContainer: {
    width: RPH(24),
    height: RPH(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: '500',
  },
  value: {
    // fontWeight: '700',
  },
});

export default DashboardBox;
