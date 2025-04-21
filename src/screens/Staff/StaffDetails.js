import React, {useState, useMemo, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
  Keyboard,
  Alert,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {COLORS, SIZES, FONTS, RH, RW} from '../../theme';
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
} from '@react-native-firebase/firestore';
import AddAdvanceModal from './AddAdvanceModal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

// Helper function to format Date in DD-MM-YYYY
const formatDate = date => {
  if (!date) return '';
  const day = ('0' + date.getDate()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Staff Info Modal Component
const StaffInfoModal = ({visible, onClose, staffInfo, navigation, employeeId}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEdit = () => {
    onClose();
    navigation.navigate('EditEmployee', {
      employeeId,
      employeeData: staffInfo,
    });
  };

  const handleDelete = async () => {
    try {
      const db = getFirestore();
      const employeeRef = doc(db, 'employees', employeeId);
      await deleteDoc(employeeRef);
      Alert.alert('Success', 'Employee deleted successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting employee:', error);
      Alert.alert('Error', 'Failed to delete employee.');
    }
  };

  return (
    <>
      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Icon name="account-details" size={SIZES.sm} color={COLORS.primary} />
                <Text style={styles.modalTitle}>Staff Details</Text>
              </View>
              <View style={styles.modalActions}>
                <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
                  <Icon name="pencil" size={SIZES.s} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowDeleteModal(true)} style={styles.actionButton}>
                  <Icon name="delete" size={SIZES.s} color={COLORS.error} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Icon name="close" size={SIZES.s} color={COLORS.black} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <Icon name="account" size={SIZES.s} color={COLORS.primary} />
                  <Text style={styles.infoLabel}>Name</Text>
                </View>
                <Text style={styles.infoValue}>{staffInfo?.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <Icon name="phone" size={SIZES.s} color={COLORS.primary} />
                  <Text style={styles.infoLabel}>Contact</Text>
                </View>
                <Text style={styles.infoValue}>{staffInfo?.contact}</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <Icon name="map-marker" size={SIZES.s} color={COLORS.primary} />
                  <Text style={styles.infoLabel}>Address</Text>
                </View>
                <Text style={styles.infoValue}>{staffInfo?.address}</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <Icon name="calendar" size={SIZES.s} color={COLORS.primary} />
                  <Text style={styles.infoLabel}>Salary Date</Text>
                </View>
                <Text style={styles.infoValue}>{staffInfo?.salaryDate}</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <Icon name="currency-inr" size={SIZES.s} color={COLORS.primary} />
                  <Text style={styles.infoLabel}>Salary Amount</Text>
                </View>
                <Text style={styles.infoValue}>₹{staffInfo?.salaryAmount}</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal transparent visible={showDeleteModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationModalContent}>
            <Text style={styles.confirmationTitle}>Delete Employee</Text>
            <Text style={styles.confirmationMessage}>
              Are you sure you want to delete this employee? This action cannot be undone.
            </Text>
            <View style={styles.confirmationButtons}>
              <TouchableOpacity
                style={[styles.confirmationButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmationButton, styles.deleteButton]}
                onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const StaffDetails = ({route}) => {
  const {employeeId} = route.params;
  console.log('StaffDetails mounted with employeeId:', employeeId);

  const [typeFilter, setTypeFilter] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [staffInfo, setStaffInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [newAdvanceDate, setNewAdvanceDate] = useState(new Date());
  const [newAdvanceAmount, setNewAdvanceAmount] = useState('');
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionActions, setShowTransactionActions] = useState(false);

  const handleFilterSelect = (filter) => {
    setTypeFilter(filter);
    setShowFilterModal(false);
  };
  const navigation = useNavigation();
  useEffect(() => {
    if (!employeeId) {
      console.log('No employeeId provided');
      Alert.alert('Error', 'No employee selected');
      return;
    }

    const db = getFirestore();
    const employeeRef = doc(db, 'employees', employeeId);
    console.log('Fetching employee details for ID:', employeeId);

    const getEmployeeDetails = async () => {
      try {
        const docSnap = await getDoc(employeeRef);
        console.log('Employee document snapshot:', docSnap);

        if (docSnap && docSnap.data) {
          const data = docSnap.data();
          console.log('Employee data:', data);
          setStaffInfo(data);

          // Add automatic salary entry if it's salary date
          const today = new Date();
          const salaryDate = parseInt(data.salaryDate);

          if (today.getDate() === salaryDate) {
            const transactionsRef = collection(db, 'transactions');
            const salaryQuery = query(
              transactionsRef,
              where('employeeId', '==', employeeId),
              where('type', '==', 'Salary'),
              where(
                'date',
                '>=',
                new Date(today.getFullYear(), today.getMonth(), 1),
              ),
              where(
                'date',
                '<=',
                new Date(today.getFullYear(), today.getMonth() + 1, 0),
              ),
            );

            const salarySnapshot = await getDocs(salaryQuery);
            if (salarySnapshot.empty) {
              // Add salary transaction if not already added this month
              await addDoc(transactionsRef, {
                employeeId,
                type: 'Salary',
                amount: data.salaryAmount,
                date: today,
                createdAt: new Date(),
              });
            }
          }
        } else {
          console.log('No employee found with ID:', employeeId);
          Alert.alert('Error', 'Employee not found');
        }
      } catch (error) {
        console.error('Error fetching employee details:', error);
        Alert.alert('Error', 'Failed to fetch employee details');
      }
    };

    getEmployeeDetails();

    // Set up transactions listener
    const transactionsRef = collection(db, 'transactions');
    const q = query(
      transactionsRef,
      where('employeeId', '==', employeeId),
      orderBy('date', 'desc'),
    );

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        try {
          if (!snapshot) {
            console.log('No snapshot available for transactions');
            setTransactions([]);
            return;
          }

          const transactionList = [];
          snapshot.docs.forEach(docData => {
            const data = docData.data();
            console.log('Transaction data:', data);
            transactionList.push({
              id: docData.id,
              ...data,
            });
          });
          console.log('Updated transactions list:', transactionList);
          setTransactions(transactionList);
        } catch (error) {
          console.error('Error processing transactions snapshot:', error);
          setTransactions([]);
        }
      },
      error => {
        console.error('Error in transactions onSnapshot:', error);
        Alert.alert('Error', 'Failed to fetch transactions');
      },
    );

    return () => {
      console.log('Cleaning up StaffDetails listeners');
      unsubscribe();
    };
  }, [employeeId]);


  const filteredTransactions = useMemo(() => {
    return transactions.filter(item => {
      if (
        typeFilter &&
        !item.type.toLowerCase().includes(typeFilter.toLowerCase())
      ) {
        return false;
      }
      const transactionDate = item.date.toDate();
      if (startDate !== null && transactionDate < startDate) {
        return false;
      }
      if (endDate !== null && transactionDate > endDate) {
        return false;
      }
      return true;
    });
  }, [transactions, typeFilter, startDate, endDate]);

  const handleLongPress = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionActions(true);
  };


  const handleDeleteTransaction = async () => {
    const db = firestore();
    const transactionRef = db.doc(`transactions/${selectedTransaction.id}`);
    const employeeRef    = db.doc(`employees/${employeeId}`);
    const amt            = selectedTransaction.amount; // already signed
  
    try {
      await transactionRef.delete();
      // if it was +100, this will do −100; if −50, this will do +50
      await employeeRef.update({
        totalAdvance: firestore.FieldValue.increment(-amt)
      });
      Alert.alert('Success', 'Transaction deleted successfully!');
      setShowTransactionActions(false);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      Alert.alert('Error', 'Failed to delete transaction.');
    }
  };
  
  const handleEditTransaction = () => {
    setShowTransactionActions(false);
    setShowAdvanceModal(true);
    setNewAdvanceDate(selectedTransaction.date.toDate());
    setNewAdvanceAmount(selectedTransaction.amount.toString());
  };

  return (
    <Pressable onPress={() => Keyboard.dismiss()} style={styles.container}>
      {/* Header with Staff Name and Info Icon */}
      <View style={styles.headerRow}>
        <Text style={styles.staffName}>{staffInfo?.name}</Text>
        <TouchableOpacity
          onPress={() => setInfoModalVisible(true)}
          style={styles.infoIcon}>
          <Icon name="information" size={RW(40)} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Filter Section */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}>
          <Icon 
            name="filter-variant" 
            size={SIZES.s} 
            color={COLORS.white} 
          />
          {typeFilter && (
            <View style={styles.activeFilterBadge}>
              <Icon
                name={
                  typeFilter === 'Salary'
                    ? 'currency-inr'
                    : typeFilter === 'Advance'
                    ? 'cash-plus'
                    : 'cash-minus'
                }
                size={SIZES.xs}
                color={COLORS.white}
              />
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => {
            Keyboard.dismiss();
            setOpenStart(true);
          }}>
          <Text style={styles.datePickerText}>
            {startDate ? formatDate(startDate) : 'Start Date'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => {
            Keyboard.dismiss();
            setOpenEnd(true);
          }}>
          <Text style={styles.datePickerText}>
            {endDate ? formatDate(endDate) : 'End Date'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Dropdown Modal */}
      <Modal
        transparent
        visible={showFilterModal}
        animationType="fade"
        onRequestClose={() => setShowFilterModal(false)}>
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setShowFilterModal(false)}>
          <View style={styles.filterModalContent}>
            {[
              {type: 'Salary', icon: 'currency-inr'},
              {type: 'Advance', icon: 'cash-plus'},
              {type: 'Return', icon: 'cash-minus'},
            ].map(({type, icon}) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterOption,
                  typeFilter === type && styles.selectedFilter,
                ]}
                onPress={() => handleFilterSelect(type)}>
                <Icon
                  name={icon}
                  size={SIZES.s}
                  color={typeFilter === type ? COLORS.white : COLORS.black}
                />
                <Text
                  style={[
                    styles.filterOptionText,
                    typeFilter === type && styles.selectedFilterText,
                  ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => handleFilterSelect('')}>
              <Icon name="close" size={SIZES.s} color={COLORS.black} />
              <Text style={styles.filterOptionText}>Clear Filter</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableCell, styles.headerCell]}>#</Text>
        <Text style={[styles.tableCell, styles.headerCell]}>Date</Text>
        <Text style={[styles.tableCell, styles.headerCell]}>Type</Text>
        <Text style={[styles.tableCell, styles.headerCell]}>Amount</Text>
      </View>

      {/* Table Rows */}
      <ScrollView style={styles.tableContainer}>
        {filteredTransactions.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.tableRow,
              index % 2 === 0 ? styles.rowEven : styles.rowOdd,
            ]}
            onLongPress={() => handleLongPress(item)}>
            <Text style={styles.tableCell}>{index + 1}</Text>
            <Text style={styles.tableCell}>
              {formatDate(item.date.toDate())}
            </Text>
            <Text style={styles.tableCell}>{item.type}</Text>
            <Text style={styles.tableCell}>{item.amount}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Advance Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAdvanceModal(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Staff Info Modal */}
      <StaffInfoModal
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
        staffInfo={staffInfo}
        navigation={navigation}
        employeeId={employeeId}
      />

      {/* Add Advance Modal */}
      <AddAdvanceModal
        visible={showAdvanceModal}
        onClose={() => {
          setShowAdvanceModal(false);
          setSelectedTransaction(null);
        }}
        employeeId={employeeId}
        transactionToEdit={selectedTransaction}
      />

      {/* Transaction Actions Modal */}
      <Modal transparent visible={showTransactionActions} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.transactionActionsModal}>
            <TouchableOpacity
              style={styles.transactionActionButton}
              onPress={handleEditTransaction}>
              <Icon name="pencil" size={SIZES.s} color={COLORS.primary} />
              <Text style={styles.transactionActionText}>Edit Transaction</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.transactionActionButton}
              onPress={handleDeleteTransaction}>
              <Icon name="delete" size={SIZES.s} color={COLORS.error} />
              <Text style={styles.transactionActionText}>Delete Transaction</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.transactionActionButton}
              onPress={() => setShowTransactionActions(false)}>
              <Icon name="close" size={SIZES.s} color={COLORS.black} />
              <Text style={styles.transactionActionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Date Pickers for Start and End Dates */}
      <DatePicker
        modal
        open={openStart}
        date={startDate || new Date()}
        onConfirm={date => {
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
        onConfirm={date => {
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
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: RH(16),
  },
  filterButton: {
    backgroundColor: COLORS.primary,
    padding: RW(8),
    borderRadius: RW(4),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: RW(4),
    flexDirection: 'row',
    gap: RW(4),
  },
  activeFilterBadge: {
    backgroundColor: COLORS.primaryDark,
    padding: RW(4),
    borderRadius: RW(2),
  },
  filterModalContent: {
    backgroundColor: COLORS.white,
    borderRadius: RW(8),
    padding: RW(12),
    width: '50%',
    maxWidth: RW(200),
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: RW(8),
    borderRadius: RW(4),
    marginBottom: RH(4),
    gap: RW(8),
  },
  selectedFilter: {
    backgroundColor: COLORS.primary,
  },
  filterOptionText: {
    fontFamily: FONTS.PR,
    fontSize: SIZES.xs,
    color: COLORS.black,
  },
  selectedFilterText: {
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: RW(16),
    width: '90%',
    maxWidth: RW(400),
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: RW(20),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray3,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RW(8),
  },
  modalTitle: {
    fontFamily: FONTS.PB,
    fontSize: SIZES.sl,
    color: COLORS.black,
  },
  modalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RW(8),
  },
  actionButton: {
    width: RW(30),
    height: RW(30),
    borderRadius: RW(15),
    backgroundColor: COLORS.gray3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: RW(30),
    height: RW(30),
    borderRadius: RW(15),
    backgroundColor: COLORS.gray3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    paddingHorizontal: RW(20),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: RH(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray3,
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RW(8),
    flex: 0.4,
  },
  infoLabel: {
    fontFamily: FONTS.PR,
    fontSize: SIZES.s,
    color: COLORS.gray2,
  },
  infoValue: {
    fontFamily: FONTS.PB,
    fontSize: SIZES.s,
    color: COLORS.black,
    flex: 0.6,
    textAlign: 'right',
  },
  modalBodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: RH(20),
  },
  // Each section in the row (date picker and amount input)
  modalSection: {
    flex: 1,
    marginHorizontal: RW(4),
  },
  amountInputContainer: {
    width: '100%',
  },
  amountInput: {
    width: '100%',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: RH(16),
  },
  modalButton: {
    flex: 1,
    marginHorizontal: RW(8),
  },
  cancelButton: {
    backgroundColor: COLORS.gray3,
  },
  addButton: {
    position: 'absolute',
    bottom: RH(20),
    right: RW(20),
    width: RW(50),
    height: RW(50),
    borderRadius: RW(25),
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: SIZES.xl,
    fontFamily: FONTS.PB,
  },
  confirmationModalContent: {
    backgroundColor: COLORS.white,
    borderRadius: RW(16),
    padding: RW(20),
    width: '80%',
    maxWidth: RW(400),
    elevation: 5,
  },
  confirmationTitle: {
    fontFamily: FONTS.PB,
    fontSize: SIZES.sl,
    color: COLORS.black,
    marginBottom: RH(12),
  },
  confirmationMessage: {
    fontFamily: FONTS.PR,
    fontSize: SIZES.s,
    color: COLORS.gray2,
    marginBottom: RH(20),
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: RW(12),
    marginTop: RH(20),
  },
  confirmationButton: {
    paddingVertical: RH(8),
    paddingHorizontal: RW(16),
    borderRadius: RW(4),
    minWidth: RW(80),
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  cancelButtonText: {
    fontFamily: FONTS.PR,
    fontSize: SIZES.s,
    color: COLORS.black,
  },
  deleteButtonText: {
    fontFamily: FONTS.PR,
    fontSize: SIZES.s,
    color: COLORS.white,
  },
  transactionActionsModal: {
    backgroundColor: COLORS.white,
    borderRadius: RW(16),
    padding: RW(20),
    width: '80%',
    maxWidth: RW(400),
    elevation: 5,
  },
  transactionActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: RH(12),
    paddingHorizontal: RW(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray3,
  },
  transactionActionText: {
    fontFamily: FONTS.PR,
    fontSize: SIZES.s,
    color: COLORS.black,
    marginLeft: RW(12),
  },
});

export default StaffDetails;
