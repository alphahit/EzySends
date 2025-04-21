import React from 'react';
import { Modal, Pressable, View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES } from '../../theme';

const FilterModal = ({ visible, onClose, onSelect, typeFilter, styles }) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={onClose}
      >
        <View style={styles.filterModalContent}>
          {[
            { type: 'Salary', icon: 'currency-inr' },
            { type: 'Advance', icon: 'cash-plus' },
            { type: 'Return', icon: 'cash-minus' },
          ].map(({ type, icon }) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterOption,
                typeFilter === type && styles.selectedFilter,
              ]}
              onPress={() => onSelect(type)}
            >
              <Icon
                name={icon}
                size={SIZES.s}
                color={typeFilter === type ? COLORS.white : COLORS.black}
              />
              <Text
                style={[
                  styles.filterOptionText,
                  typeFilter === type && styles.selectedFilterText,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => onSelect('')}
          >
            <Icon name="close" size={SIZES.s} color={COLORS.black} />
            <Text style={styles.filterOptionText}>Clear Filter</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

export default FilterModal;
