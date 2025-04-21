import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES } from '../../theme';

const SalaryPaidModal = ({
  visible,
  isSalaryPaid,
  setIsSalaryPaid,
  actualPayDate,
  setActualPayDate,
  onClose,
  onSave,
  styles
}) => {
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  console.log('SalaryPaidModal props:', { isSalaryPaid, actualPayDate });
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, styles.salaryModalContent]}>
          <Text style={styles.salaryModalTitle}>Salary Payment Status</Text>
          <TouchableOpacity
            style={styles.paidStatusContainer}
            activeOpacity={0.7}
            onPress={() => setIsSalaryPaid(!isSalaryPaid)}>
            <Text style={styles.paidStatusLabel}>Mark as Paid</Text>
            <View style={[styles.checkbox, isSalaryPaid && styles.checked]}>
              {isSalaryPaid && (
                <Icon name="check" size={SIZES.s} color={COLORS.white} />
              )}
            </View>
          </TouchableOpacity>
          {/* Actual Pay Date Picker */}
          <View style={{ marginVertical: 16 }}>
            <Text style={styles.paidStatusLabel}>Actual Pay Date</Text>
            <TouchableOpacity
              style={[
                styles.datePickerButton,
                actualPayDate && { borderColor: COLORS.success, borderWidth: 2, borderRadius: 8 },
                { marginTop: 8, padding: 12, alignItems: 'center', backgroundColor: '#f5f5f5' }
              ]}
              onPress={() => setShowDatePicker(true)}>
              <Text style={{ color: COLORS.black }}>
                {actualPayDate
                  ? (function formatDate(date) {
                      let d = date;
                      if (!(d instanceof Date)) {
                        if (typeof d.toDate === 'function') d = d.toDate();
                        else d = new Date(d);
                      }
                      const day = ('0' + d.getDate()).slice(-2);
                      const month = ('0' + (d.getMonth() + 1)).slice(-2);
                      const year = d.getFullYear();
                      return `${day}-${month}-${year}`;
                    })(actualPayDate)
                  : 'Select Date'}
              </Text>
            </TouchableOpacity>
            <DatePicker
              modal
              open={showDatePicker}
              date={
                actualPayDate
                  ? (actualPayDate instanceof Date
                      ? actualPayDate
                      : typeof actualPayDate.toDate === 'function'
                        ? actualPayDate.toDate()
                        : new Date(actualPayDate)
                    )
                  : new Date()
              }
              mode="date"
              onConfirm={date => {
                setShowDatePicker(false);
                setActualPayDate(date);
              }}
              onCancel={() => setShowDatePicker(false)}
            />
          </View>

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={onSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SalaryPaidModal;
