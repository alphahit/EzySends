import React, { useState } from 'react';
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  moderateVerticalScale as RHA,
  moderateScale as RPH,
} from 'react-native-size-matters';

import { FONTS } from '../../theme/fonts';
import AppText from '../AppText/AppText';
import TwoButtons from '../TwoButtons/TwoButtons';
import { COLORS } from '../../theme/colors';

export default function FilterDateModal({
  visible,
  onClear,
  onCancel,
  setModalVisible
}) {
  const [selected, setSelected] = useState('last'); // "last" or "current"

  const renderOption = (key, label) => {
    const isSelected = selected === key;
    return (
      <TouchableOpacity
        key={key}
        activeOpacity={0.7}
        onPress={() => {
            setSelected(key)
            // setModalVisible(false)
        }}
        style={[
          styles.option,
          isSelected ? styles.optionSelected : styles.optionUnselected,
        ]}
      >
        <View style={styles.radioOuter}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
        <AppText
          style={[
            styles.optionText,
            isSelected ? styles.textSelected : styles.textUnselected,
          ]}
        >
          {label}
        </AppText>
      </TouchableOpacity>
    );
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <View style={styles.optionsContainer}>
                {renderOption('last', 'Last Month')}
                {renderOption('current', 'Current Month')}
              </View>

              {/* replace manual buttons with TwoButtons */}
              <TwoButtons
                containerStyle={styles.buttonRow}
                primary={{
                  title: 'CLEAR',
                  onPress: () => onClear(selected),
                  backgroundColor: COLORS.primaryColor,
                  textColor: COLORS.whiteText,
                }}
                secondary={{
                  title: 'CANCEL',
                  onPress: onCancel,
                  backgroundColor: COLORS.tableRowEvenBg,
                  textColor: COLORS.whiteText,
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    height: RHA(196),
    backgroundColor: COLORS.screenBackgroundColor,
    paddingVertical: RHA(25),
    paddingHorizontal: RPH(22),
    position: 'absolute',
    bottom: 0,
  },
  optionsContainer: {
    gap: RHA(6),
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: RHA(6),
    paddingHorizontal: RPH(15),
    width: '100%',
    height: RHA(36),
  },
  optionSelected: {
    backgroundColor: COLORS.primaryColor,
  },
  optionUnselected: {
    backgroundColor: '#E9FAF6',
  },
  radioOuter: {
    width: RPH(24),
    height: RPH(24),
    borderRadius: RPH(12),
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: RPH(12),
    height: RPH(12),
    borderRadius: RPH(6),
    backgroundColor: 'black',
  },
  optionText: {
    fontFamily: FONTS.PM,
    fontSize: RHA(12),
    lineHeight: RHA(18),
    marginLeft: RPH(4),
  },
  textSelected: {
    color: COLORS.whiteText,
  },
  textUnselected: {
    color: COLORS.tableTextDark,
  },
  buttonRow: {
    // TwoButtons’ own padding + this extra top margin
    marginTop: RHA(25),
  },
});
