import React, { useState } from 'react';
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  TextInput,
} from 'react-native';

import { FONTS, RHA, RPH } from '../../theme/fonts';
import AppText from '../AppText/AppText';
import TwoButtons from '../TwoButtons/TwoButtons';
import { COLORS } from '../../theme/colors';

export default function AddAdvanceModal({
  visible,
  onSubmit,
  onCancel,
}) {
  const [fwd, setFwd] = useState('');
  const [rvp, setRvp] = useState('');
  const [amount, setAmount] = useState('');

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      {/* backdrop */}
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>

              {/* Inputs */}
              <View style={styles.content}>
                <View style={[styles.rowInputs, { marginBottom: RHA(25) }]}>
                  {/* Fwd */}
                  <View style={[styles.field, { marginRight: RPH(25) }]}>
                    <AppText style={styles.label}>Fwd</AppText>
                    <View style={styles.inputBox}>
                      <TextInput
                        style={styles.input}
                        value={fwd}
                        onChangeText={setFwd}
                        placeholder="15"
                        placeholderTextColor="#888484"
                      />
                    </View>
                  </View>

                  {/* RVP */}
                  <View style={styles.field}>
                    <AppText style={styles.label}>RVP</AppText>
                    <View style={styles.inputBox}>
                      <TextInput
                        style={styles.input}
                        value={rvp}
                        onChangeText={setRvp}
                        placeholder="14"
                        placeholderTextColor="#888484"
                      />
                    </View>
                  </View>
                </View>

                {/* Advance Amount */}
                <View style={styles.fieldFull}>
                  <AppText style={styles.label}>Advance Amount</AppText>
                  <View style={styles.inputBoxFull}>
                    <TextInput
                      style={styles.input}
                      value={amount}
                      onChangeText={setAmount}
                      placeholder="0"
                      placeholderTextColor="#888484"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <TwoButtons
                containerStyle={styles.buttonRow}
                buttonWidth={RPH(142)}
                primary={{
                  title: 'ADD',
                  onPress: () => onSubmit({ fwd, rvp, amount }),
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
    width: RPH(356),
    height: RHA(301),
    backgroundColor: COLORS.screenBackgroundColor,
    paddingVertical: RHA(25),
    paddingHorizontal: RPH(22),
    justifyContent: 'space-between',
  },
  content: {
    width: RPH(312),
  },
  rowInputs: {
    flexDirection: 'row',
  },
  field: {
    width: RPH(143.5),
  },
  fieldFull: {
    width: RPH(312),
  },
  label: {
    fontFamily: FONTS.PM,
    fontSize: RHA(18),
    lineHeight: RHA(27),
    color: '#000000',
    marginBottom: RHA(10),
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#558479',
    width: '100%',
    height: RHA(42),
    paddingVertical: RHA(9),
    paddingHorizontal: RPH(10),
  },
  inputBoxFull: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#558479',
    width: '100%',
    height: RHA(42),
    paddingVertical: RHA(9),
    paddingHorizontal: RPH(10),
  },
  input: {
    flex: 1,
    fontFamily: FONTS.PR,
    fontSize: RHA(16),
    lineHeight: RHA(24),
    color: '#282828',
  },
  buttonRow: {
    // no extra margins needed—container is space-between
  },
});
