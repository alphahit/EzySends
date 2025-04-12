import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
  Keyboard,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import InputField from '../../components/InputField';
import { COLORS, SIZES, FONTS, RH, RW } from '../../theme';

// Sample transaction data for the staff
const sampleTransactions = [
  { id: 1, date: '2025-04-01', type: 'Salary', amount: 2000, description: 'April Salary' },
  { id: 2, date: '2025-04-05', type: 'Advance', amount: 300, description: 'Advance Payment' },
  { id: 3, date: '2025-04-10', type: 'Salary', amount: 2000, description: 'May Salary' },
  { id: 4, date: '2025-04-15', type: 'Advance', amount: 400, description: 'Advance Payment' },
  { id: 5, date: '2025-04-20', type: 'Salary', amount: 2000, description: 'June Salary' },
];

// Hardcoded staff details
const staffInfo = {
  name: 'Alice Smith',
  contact: '123-456-7890',
  address: '123 Apple Street, New York, NY',
  salaryDate: '15', // day of month
  salaryAmount: 2000,
};

// Helper function to format Date in DD-MM-YYYY
const formatDate = (date) => {
  if (!date) return '';
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Staff Info Modal Component
const StaffInfoModal = ({ visible, onClose }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Staff Details</Text>
          <Text style={styles.modalText}>
            <Text style={styles.modalLabel}>Name: </Text>
            {staffInfo.name}
          </Text>
          <Text style={styles.modalText}>
            <Text style={styles.modalLabel}>Contact: </Text>
            {staffInfo.contact}
          </Text>
          <Text style={styles.modalText}>
            <Text style={styles.modalLabel}>Address: </Text>
            {staffInfo.address}
          </Text>
          <Text style={styles.modalText}>
            <Text style={styles.modalLabel}>Salary Date: </Text>
            {staffInfo.salaryDate}
          </Text>
          <Text style={styles.modalText}>
            <Text style={styles.modalLabel}>Salary Amount: </Text>
            {staffInfo.salaryAmount}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const StaffDetails = () => {
  // State for type filter (Salary or Advance)
  const [typeFilter, setTypeFilter] = useState('');
  // Start and End dates are null by default (no date selected)
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  // Control modal visibility
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  // Filter transactions based on type and date range
  const filteredTransactions = useMemo(() => {
    return sampleTransactions.filter(item => {
      // Filter by type, if a filter is set
      if (typeFilter && !item.type.toLowerCase().includes(typeFilter.toLowerCase())) {
        return false;
      }
      // Convert the transaction's date string to a Date object
      const transactionDate = new Date(item.date);
      if (startDate !== null && transactionDate < startDate) {
        return false;
      }
      if (endDate !== null && transactionDate > endDate) {
        return false;
      }
      return true;
    });
  }, [typeFilter, startDate, endDate]);

  return (
    <Pressable onPress={() => Keyboard.dismiss()} style={styles.container}>
      {/* Header with Staff Name and Info Icon */}
      <View style={styles.headerRow}>
        <Text style={styles.staffName}>{staffInfo.name}</Text>
        <TouchableOpacity onPress={() => setInfoModalVisible(true)} style={styles.infoIcon}>
          <Text style={styles.infoIconText}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Section: Two type filter buttons and two date picker buttons in one row */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterButton, typeFilter === 'Salary' && styles.activeFilter]}
          onPress={() => {
            setTypeFilter(typeFilter === 'Salary' ? '' : 'Salary');
            Keyboard.dismiss();
          }}
        >
          <Text style={styles.filterButtonText}>S</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, typeFilter === 'Advance' && styles.activeFilter]}
          onPress={() => {
            setTypeFilter(typeFilter === 'Advance' ? '' : 'Advance');
            Keyboard.dismiss();
          }}
        >
          <Text style={styles.filterButtonText}>D</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => {
            Keyboard.dismiss();
            setOpenStart(true);
          }}
        >
          <Text style={styles.datePickerText}>
            {startDate ? formatDate(startDate) : 'Start Date'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => {
            Keyboard.dismiss();
            setOpenEnd(true);
          }}
        >
          <Text style={styles.datePickerText}>
            {endDate ? formatDate(endDate) : 'End Date'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableCell, styles.headerCell]}>#</Text>
        <Text style={[styles.tableCell, styles.headerCell]}>Date</Text>
        <Text style={[styles.tableCell, styles.headerCell]}>Type</Text>
        <Text style={[styles.tableCell, styles.headerCell]}>Amount</Text>
        <Text style={[styles.tableCell, styles.headerCell]}>Description</Text>
      </View>

      {/* Table Rows */}
      <ScrollView style={styles.tableContainer}>
        {filteredTransactions.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => {}}
            style={[
              styles.tableRow,
              index % 2 === 0 ? styles.rowEven : styles.rowOdd,
            ]}
          >
            <Text style={styles.tableCell}>{index + 1}</Text>
            <Text style={styles.tableCell}>{formatDate(new Date(item.date))}</Text>
            <Text style={styles.tableCell}>{item.type}</Text>
            <Text style={styles.tableCell}>{item.amount}</Text>
            <Text style={styles.tableCell}>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Staff Info Modal */}
      <StaffInfoModal visible={infoModalVisible} onClose={() => setInfoModalVisible(false)} />

      {/* Date Pickers for Start and End Dates */}
      <DatePicker
        modal
        open={openStart}
        date={startDate || new Date()}
        onConfirm={(date) => {
          setOpenStart(false);
          setStartDate(date);
        }}
        onCancel={() => {
          setOpenStart(false);
        }}
        mode="date"
      />
      <DatePicker
        modal
        open={openEnd}
        date={endDate || new Date()}
        onConfirm={(date) => {
          setOpenEnd(false);
          setEndDate(date);
        }}
        onCancel={() => {
          setOpenEnd(false);
        }}
        mode="date"
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray3,
    padding: RW(16),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: RH(16),
  },
  staffName: {
    fontFamily: FONTS.PB,
    fontSize: RW(20),
    color: COLORS.black,
  },
  infoIcon: {
    backgroundColor: COLORS.primary,
    borderRadius: RW(20),
    width: RW(40),
    height: RW(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIconText: {
    fontSize: RW(20),
    color: COLORS.white,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: RH(16),
  },
  filterButton: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: RH(8),
    paddingHorizontal: RW(12),
    borderRadius: RW(4),
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: RW(4),
  },
  activeFilter: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontFamily: FONTS.PB,
    fontSize: RW(14),
    color: COLORS.white,
  },
  datePickerButton: {
    backgroundColor: COLORS.white,
    borderRadius: RW(4),
    paddingVertical: RH(8),
    paddingHorizontal: RW(8),
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: RW(4),
  },
  datePickerText: {
    fontFamily: FONTS.PR,
    fontSize: RW(12),
    color: COLORS.black,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryLight,
    paddingVertical: RH(5),
    borderRadius: RW(4),
  },
  headerCell: {
    fontFamily: FONTS.PB,
    fontSize: RW(14),
    color: COLORS.black,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: RH(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  rowEven: {
    backgroundColor: COLORS.lightGray1,
  },
  rowOdd: {
    backgroundColor: COLORS.transparent,
  },
  tableCell: {
    flex: 1,
    fontFamily: FONTS.PR,
    fontSize: RW(12),
    color: COLORS.black,
    textAlign: 'center',
    paddingHorizontal: RW(4),
  },
  tableContainer: {
    marginTop: RH(8),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.transparent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: RW(8),
    padding: RW(16),
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: FONTS.PB,
    fontSize: RW(18),
    marginBottom: RH(12),
    color: COLORS.black,
  },
  modalText: {
    fontFamily: FONTS.PR,
    fontSize: RW(14),
    color: COLORS.black,
    marginBottom: RH(4),
  },
  modalLabel: {
    fontFamily: FONTS.PB,
  },
  modalCloseButton: {
    marginTop: RH(16),
    backgroundColor: COLORS.primary,
    paddingHorizontal: RW(16),
    paddingVertical: RH(8),
    borderRadius: RW(4),
  },
  modalCloseButtonText: {
    fontFamily: FONTS.PB,
    fontSize: RW(14),
    color: COLORS.white,
  },
});

export default StaffDetails;
