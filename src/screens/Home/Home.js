import React, {useState, useMemo, useEffect} from 'react';
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
} from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

const Dashboard = () => {
  const [searchText, setSearchText] = useState('');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState(null);
  const [employees, setEmployees] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const db = getFirestore();
    const employeesRef = collection(db, 'employees');
    const q = query(employeesRef, orderBy('name'));

    const unsubscribe = onSnapshot(q, snapshot => {
      const employeeList = [];
      snapshot.forEach(doc => {
        employeeList.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      console.log('Fetched employees:', employeeList);
      setEmployees(employeeList);
    });

    return () => unsubscribe();
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
      <ScrollView style={styles.tableContainer}>
        {filteredData.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => {
              console.log(
                'Navigating to StaffDetails with employeeId:',
                item.id,
              );
              navigation.navigate('StaffDetails', {employeeId: item.id});
            }}
            style={[
              styles.tableRow,
              index % 2 === 0 ? styles.rowEven : styles.rowOdd,
            ]}>
            <Text style={styles.tableCell}>{index + 1}</Text>
            <Text style={styles.tableCell}>{item.name}</Text>
            <Text style={styles.tableCell}>{item.totalAdvance || 0}</Text>
            <Text style={styles.tableCell}>{item.salaryAmount}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
