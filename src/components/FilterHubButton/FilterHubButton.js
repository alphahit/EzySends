import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Modal, TouchableWithoutFeedback } from 'react-native';
import { moderateScale as RPH, moderateVerticalScale as RHA } from 'react-native-size-matters';
import AppText from '../AppText/AppText';
import FilterIcon from '../../assets/svg/filter.svg';
import { FONTS } from '../../theme/fonts';
import TwoButtons from '../TwoButtons/TwoButtons';
import { COLORS } from '../../theme/colors';

const FilterHubButton = ({ hubNames = [], selectedHub, setSelectedHub }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const getFilterText = () => {
    return selectedHub ? selectedHub : 'All Hubs';
  };

  const handleSelect = (hub) => {
    setSelectedHub(hub);
    setModalVisible(false);
  };

  const handleClear = () => {
    setSelectedHub('');
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.7}
        onPress={() => setModalVisible(true)}
      >
        <AppText style={styles.filterText}>{getFilterText()}</AppText>
        <FilterIcon width={RPH(18)} height={RPH(18)} />
      </TouchableOpacity>

      {/* Modal for hub selection, styled like FilterDateModal */}
      {modalVisible && (
        <Modal transparent visible={modalVisible} animationType="fade" onRequestClose={handleCancel}>
          <TouchableWithoutFeedback onPress={handleCancel}>
            <View style={styles.overlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  <View style={styles.optionsContainer}>
                    {hubNames.length === 0 ? (
                      <AppText style={styles.optionText}>No Hubs</AppText>
                    ) : (
                      hubNames.map((hub, idx) => {
                        const isSelected = selectedHub === hub;
                        return (
                          <TouchableOpacity
                            key={hub + idx}
                            activeOpacity={0.7}
                            onPress={() => handleSelect(hub)}
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
                              {hub}
                            </AppText>
                          </TouchableOpacity>
                        );
                      })
                    )}
                  </View>
                  <TwoButtons
                    containerStyle={styles.buttonRow}
                    primary={{
                      title: 'CLEAR',
                      onPress: handleClear,
                      backgroundColor: COLORS.primaryColor,
                      textColor: COLORS.whiteText,
                    }}
                    secondary={{
                      title: 'CANCEL',
                      onPress: handleCancel,
                      backgroundColor: COLORS.tableRowEvenBg,
                      textColor: COLORS.whiteText,
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: RPH(97),
    height: RHA(28),
  },
  filterText: {
    height: RHA(18),
    fontFamily: FONTS.PR,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: RHA(12),
    lineHeight: RHA(18),
    textAlign: 'right',
    color: '#000000',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    width: '100%',
    height: RHA(196),
    backgroundColor: '#fff',
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
    marginTop: RHA(25),
  },
});

export default FilterHubButton;