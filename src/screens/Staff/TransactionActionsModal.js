import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES } from '../../theme';

const TransactionActionsModal = ({ visible, onEdit, onDelete, onCancel, styles }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.transactionActionsModal}>
          <TouchableOpacity
            style={styles.transactionActionButton}
            onPress={onEdit}>
            <Icon name="pencil" size={SIZES.s} color={COLORS.primary} />
            <Text style={styles.transactionActionText}>Edit Transaction</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.transactionActionButton}
            onPress={onDelete}>
            <Icon name="delete" size={SIZES.s} color={COLORS.error} />
            <Text style={styles.transactionActionText}>Delete Transaction</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.transactionActionButton}
            onPress={onCancel}>
            <Icon name="close" size={SIZES.s} color={COLORS.black} />
            <Text style={styles.transactionActionText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TransactionActionsModal;
