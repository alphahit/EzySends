import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';

import { COLORS, FONTS, RHA, RPH } from '../../theme';
import TwoButtons from '../TwoButtons/TwoButtons';


export default function ConfirmModal({
  visible,
  title,
  message,
  onClose = () => {},
  actions = [],  // expecting exactly two items
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>
              </View>
              <TwoButtons
                primary={{
                  title: actions[0]?.label,
                  onPress: actions[0]?.onPress,
                  disabled: actions[0]?.disabled,
                  loading: actions[0]?.loading,
                  backgroundColor: actions[0]?.backgroundColor,
                  textColor: actions[0]?.textColor,
                }}
                secondary={{
                  title: actions[1]?.label,
                  onPress: actions[1]?.onPress,
                  disabled: actions[1]?.disabled,
                  loading: actions[1]?.loading,
                  backgroundColor: actions[1]?.backgroundColor,
                  textColor: actions[1]?.textColor,
                }}
                containerStyle={styles.actions}
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
    width: RPH(312),
    backgroundColor: COLORS.screenBackgroundColor,
    overflow: 'hidden',
    paddingHorizontal: RPH(17),
  },
  content: {
    paddingVertical: RHA(17),

    gap: RHA(12),
  },
  title: {
    fontFamily: FONTS.PM,
    fontSize: RHA(18),
    lineHeight: RHA(27),
    fontWeight: '500',
    color: COLORS.black,
  },
  message: {
    fontFamily: FONTS.PM,
    fontSize: RHA(16),
    lineHeight: RHA(24),
    fontWeight: '400',
    color: COLORS.black,
  },
  actions: {
    // TwoButtons already applies its own padding,
    // but if you need to adjust here, you can.
  },
});
