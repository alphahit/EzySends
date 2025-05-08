import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { moderateScale as RPH, moderateVerticalScale as RHA } from 'react-native-size-matters';
import AppText from '../AppText/AppText';
import FilterIcon from '../../assets/svg/filter.svg';
import FilterDateModal from '../FilterDateModal/FilterDateModal';
import { FONTS } from '../../theme/fonts';

const FilterButton = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [filterType, setFilterType] = useState('last'); // 'last' or 'current'

  const getFilterText = () => {
    return filterType === 'last' ? 'Last Month' : 'Current Month';
  };

  const handleClear = (selected) => {
    setFilterType(selected);
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

      <FilterDateModal
        setModalVisible={setModalVisible}
        visible={modalVisible}
        onClear={handleClear}
        onCancel={handleCancel}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    gap: 4,
    width: RPH(97),
    height: RHA(28),


  },
  filterText: {
    width: RPH(65),
    height: RHA(18),
    fontFamily: FONTS.PR,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: RHA(12),
    lineHeight: RHA(18),
    textAlign: 'right',
    color: '#000000',
  }
});

export default FilterButton; 