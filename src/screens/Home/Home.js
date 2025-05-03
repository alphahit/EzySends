import React, {useState, useMemo, useEffect} from 'react';
import {listenAccumulatedSalary} from './accumulateSalary';
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
  FlatList,
} from 'react-native';
import InputField from '../../components/InputField';
import {COLORS, SIZES, FONTS, RH, RW} from '../../theme';
import {useNavigation} from '@react-navigation/native';
import {Button} from '../../components/Button/Button';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  getDocs,
  addDoc,
} from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {MMKV} from 'react-native-mmkv';

// A reusable modal to choose sort options
const SortModal = ({visible, onClose, onSelect}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent}>
          {/* Total Advance Sort Options */}
          <View style={styles.sortOptionGroup}>
            <View style={styles.sortOptionButtonsRow}>
              <TouchableOpacity
                onPress={() => {
                  onSelect({field: 'totalAdvance', order: 'desc'});
                  onClose();
                }}
                style={styles.iconButton}>
                <Icon
                  name="sort-descending"
                  size={SIZES.sm}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
              <View style={styles.sortGroupHeader}>
                <Icon
                  name="cash-multiple"
                  size={SIZES.sm}
                  color={COLORS.primary}
                />
                <Text style={styles.sortGroupTitle}>Total Advance</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  onSelect({field: 'totalAdvance', order: 'asc'});
                  onClose();
                }}
                style={styles.iconButton}>
                <Icon
                  name="sort-ascending"
                  size={SIZES.sm}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Salary Sort Options */}
          <View style={styles.sortOptionGroup}>
            <View style={styles.sortOptionButtonsRow}>
              <TouchableOpacity
                onPress={() => {
                  onSelect({field: 'salaryAmount', order: 'desc'});
                  onClose();
                }}
                style={styles.iconButton}>
                <Icon
                  name="sort-descending"
                  size={SIZES.sm}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
              <View style={styles.sortGroupHeader}>
                <Icon
                  name="currency-inr"
                  size={SIZES.sm}
                  color={COLORS.primary}
                />
                <Text style={styles.sortGroupTitle}>Salary</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  onSelect({field: 'salaryAmount', order: 'asc'});
                  onClose();
                }}
                style={styles.iconButton}>
                <Icon
                  name="sort-ascending"
                  size={SIZES.sm}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <Button
            onPress={onClose}
            backgroundColor={COLORS.white}
            btnTitle="Cancel"
            fontColor={COLORS.black}
            wrapperStyle={styles.cancelButton}
            titleStyle={{fontSize: SIZES.xs}}
          />
        </View>
      </View>
    </Modal>
  );
};

// Function to check and update salaries for all employees
const checkAndUpdateSalaries = async () => {
  try {
    const db = getFirestore();
    const employeesRef = collection(db, 'employees');
    const employeesSnapshot = await getDocs(employeesRef);
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    for (const doc of employeesSnapshot.docs) {
      const employeeData = doc.data();
      const employeeId = doc.id;
      const salaryDate = parseInt(employeeData.salaryDate);

      // Check if we're in the same month as the salary date
      const transactionsRef = collection(db, 'transactions');
      const salaryQuery = query(
        transactionsRef,
        where('employeeId', '==', employeeId),
        where('type', '==', 'Salary'),
        where('date', '>=', new Date(currentYear, currentMonth, 1)),
        where('date', '<=', new Date(currentYear, currentMonth + 1, 0)),
      );

      const salarySnapshot = await getDocs(salaryQuery);

      // If no salary entry exists for this month
      if (salarySnapshot.empty) {
        // Create salary entry with the salary date
        const salaryEntryDate = new Date(currentYear, currentMonth, salaryDate);

        // Only add if the salary date has passed
        if (salaryEntryDate <= today) {
          await addDoc(transactionsRef, {
            employeeId,
            type: 'Salary',
            amount: employeeData.salaryAmount,
            date: salaryEntryDate,
            createdAt: new Date(),
            paid: false,
          });
          console.log(
            `Added salary for employee ${employeeData.name} for date ${salaryDate}`,
          );
        }
      }
    }
  } catch (error) {
    console.error('Error updating salaries:', error);
  }
};

const Dashboard = () => {
  const [searchText, setSearchText] = useState('');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [accumulatedSalaries, setAccumulatedSalaries] = useState({});
  const [salaryStatus, setSalaryStatus] = useState({});
  const navigation = useNavigation();
  const storage = new MMKV();

  // Check and update salaries when component mounts
  useEffect(() => {
    const today = new Date().toDateString();
    const lastOpened = storage.getString('lastOpened');

    if (lastOpened !== today) {
      // Update last opened date
      storage.set('lastOpened', today);
      // Run salary check and update
      checkAndUpdateSalaries();
    }
  }, []);

  useEffect(() => {
    const db = getFirestore();
    const employeesRef = collection(db, 'employees');
    const q = query(employeesRef, orderBy('name'));

    console.log('Attempting to connect to Firestore...');

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        console.log('Firestore connection successful, received snapshot');
        const employeeList = [];
        const salaryUnsubscribers = [];

        if (!snapshot || !snapshot.docs) {
          console.error('Invalid snapshot received:', snapshot);
          return;
        }

        snapshot.forEach(doc => {
          const data = doc.data();
          const employeeId = doc.id;
          employeeList.push({
            id: employeeId,
            ...data,
            totalAdvance: data.totalAdvance || 0,
          });

          // Listen for salary status
          const salaryQuery = query(
            collection(db, 'transactions'),
            where('employeeId', '==', employeeId),
            where('type', '==', 'Salary'),
            where(
              'date',
              '>=',
              new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            ),
            where(
              'date',
              '<=',
              new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            ),
          );

          const salaryUnsub = onSnapshot(salaryQuery, salarySnapshot => {
            const salaryData = salarySnapshot.docs[0]?.data();
            setSalaryStatus(prev => ({
              ...prev,
              [employeeId]: {
                exists: !salarySnapshot.empty,
                paid: salaryData?.paid || false,
                date: salaryData?.date,
              },
            }));
          });
          salaryUnsubscribers.push(salaryUnsub);

          // Listen for accumulated salary for this employee
          const unsub = listenAccumulatedSalary(employeeId, accumulated => {
            setAccumulatedSalaries(prev => ({
              ...prev,
              [employeeId]: accumulated,
            }));
          });
          salaryUnsubscribers.push(unsub);
        });
        setEmployees(employeeList);
        // Clean up salary listeners on unmount
        return () => salaryUnsubscribers.forEach(unsub => unsub());
      },
      error => {
        console.error('Firestore connection error:', error);
        Alert.alert(
          'Database Error',
          'Unable to connect to the database. Please check your internet connection and try again.',
        );
      },
    );

    return () => {
      console.log('Cleaning up Firestore listeners');
      unsubscribe();
    };
  }, []);

  // Filter and sort the data based on search text and sort option
  const filteredData = useMemo(() => {
    let data = employees;
    if (searchText) {
      data = data.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase()),
      );
    }
    if (sortOption) {
      data = [...data].sort((a, b) => {
        const aValue = a[sortOption.field] || 0;
        const bValue = b[sortOption.field] || 0;

        if (sortOption.order === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });
    }
    return data;
  }, [searchText, sortOption, employees]);

  return (
    <Pressable onPress={() => Keyboard.dismiss()} style={styles.container}>
      {/* Search and Sort Row */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputContainer}>
          <InputField
            placeholder="Search staff..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <View style={styles.sortButtonContainer}>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => navigation.navigate('AddEmployee')}>
            <Icon name="account-plus" size={SIZES.sm} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.sortButtonContainer}>
          <TouchableOpacity
            onPress={() => setSortModalVisible(true)}
            style={styles.sortButton}>
            <Icon name="sort" size={SIZES.sm} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableCell, styles.headerCell]}>#</Text>
        <Text style={[styles.tableCell, styles.headerCell]}>Name</Text>
        <Text style={[styles.tableCell, styles.headerCell]}>Advance</Text>
        <Text style={[styles.tableCell, styles.headerCell]}>Salary</Text>
      </View>

      {/* Table Rows */}
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('StaffDetails', {employeeId: item.id});
            }}
            style={[
              styles.tableRow,
              index % 2 === 0 ? styles.rowEven : styles.rowOdd,
            ]}>
            <Text style={styles.tableCell}>{index + 1}</Text>
            <View style={styles.tableCell}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontFamily: FONTS.PR,
                  fontSize: SIZES.s,
                  color: COLORS.black,
                  textAlign: 'center',
                }}>
                {item.name}
              </Text>
                <Text
                  style={{
                    fontFamily: FONTS.PR,
                    fontSize: SIZES.xs,
                    color: COLORS.black,
                    textAlign: 'center',
                  }}>
                  ₹{item.salaryAmount} / m
                </Text>
            </View>
            <Text style={styles.tableCell}>₹{item.totalAdvance}</Text>
              <Text style={styles.tableCell}>
                ₹
                {accumulatedSalaries[item.id] !== undefined
                  ? accumulatedSalaries[item.id]
                  : '--'}
              </Text>
          </TouchableOpacity>
        )}
        style={styles.tableContainer}
      />

      {/* Floating Add Button */}

      <SortModal
        visible={sortModalVisible}
        onClose={() => setSortModalVisible(false)}
        onSelect={option => setSortOption(option)}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray3, // Grey background from your color file
    padding: RW(16),
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: RH(10),
  },
  searchInputContainer: {
    flex: 0.8,
    justifyContent: 'center',
  },
  sortButtonContainer: {
    flex: 0.1,
    marginLeft: RW(4),
    alignItems: 'flex-end',
  },
  sortButton: {
    backgroundColor: COLORS.primary,
    padding: RW(8),
    borderRadius: RW(8),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sortButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.PB,
    fontSize: SIZES.s,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryLight,
    paddingVertical: RH(12),
    borderRadius: RW(8),
    marginTop: RH(16),
  },
  headerCell: {
    fontFamily: FONTS.PB,
    fontSize: SIZES.s,
    color: COLORS.black,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: RH(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
    backgroundColor: COLORS.white,
    marginHorizontal: RW(2),
    borderRadius: RW(4),
    marginTop: RH(4),
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
    fontSize: SIZES.s,
    color: COLORS.black,
    textAlign: 'center',
    paddingHorizontal: RW(4),
  },
  tableContainer: {
    marginTop: RH(8),
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.transparent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: RW(16),
    padding: RW(20),
    width: '90%',
    maxWidth: RW(400),
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sortOptionGroup: {
    marginBottom: RH(24),
    alignItems: 'center',
  },
  sortGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortGroupTitle: {
    fontFamily: FONTS.PB,
    fontSize: SIZES.s,
    color: COLORS.black,
    marginLeft: RW(4),
  },
  sortOptionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: RW(12),
  },
  iconButton: {
    width: RW(40),
    height: RW(40),
    borderRadius: RW(8),
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cancelButton: {
    marginTop: RH(12),
  },

  floatingButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.PB,
    fontSize: SIZES.s,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: COLORS.white,
    borderRadius: RW(8),
    padding: RW(12),
    width: '90%',
    maxWidth: RW(400),
    maxHeight: '70%',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: RH(12),
  },
});

export default Dashboard;
