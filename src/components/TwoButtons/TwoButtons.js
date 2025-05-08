import React from 'react';
import { View, StyleSheet } from 'react-native';

import AppButton from '../AppButton/AppButton';
import { RHA, RPH } from '../../theme';

export default function TwoButtons({
  primary = {},
  secondary = {},
  containerStyle,
  buttonWidth = '45%',
}) {
  return (
    <View style={[styles.row, containerStyle]}>
      <AppButton
        {...primary}
        style={styles.btn}
        wrapperStyle={[
          styles.btnWrapper,
          { width: buttonWidth },
        ]}
      />
      <AppButton
        {...secondary}
        style={styles.btn}
        wrapperStyle={[
          styles.btnWrapper,
          { width: buttonWidth },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingHorizontal: RPH(17),
    paddingVertical: RHA(13),
  },
  btnWrapper: {
    flex: 0,
    marginTop: 0, // override AppButton default
  },
  btn: {borderRadius: 0, height: RHA(43)}
});
