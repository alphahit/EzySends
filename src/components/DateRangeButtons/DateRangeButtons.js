import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AppText from '../AppText/AppText';
import {
  moderateScale as RPH,
  moderateVerticalScale as RHA,
} from 'react-native-size-matters';
import { FONTS } from '../../theme/fonts';

export default function DateRangeButtons({
  startDate,
  endDate,
  onSelectStart,
  onSelectEnd,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.button} onPress={onSelectStart}>
        <AppText style={styles.text}>
          {startDate || 'Start Date'}
        </AppText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.second]}
        onPress={onSelectEnd}
      >
        <AppText style={styles.text}>
          {endDate || 'End Date'}
        </AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: RPH(168),
    height: RHA(28),
  },
  button: {
    width: RPH(84),
    height: RHA(28),
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: RHA(5),
    paddingHorizontal: RPH(12),
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  second: {
    marginLeft: RPH(6),
  },
  text: {
    flex: 1,
    fontFamily: FONTS.PM,
    fontSize: RHA(12),
    lineHeight: RHA(18),
    color: '#000000',
    textAlign: 'right',
  },
});
