import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import InputField from '../components/InputField';
import { COLORS, SIZES, FONTS, RH, RW } from '../theme';
import { useNavigation } from '@react-navigation/native';

// Sample data for demonstration
const sampleData = [
  { id: 1, name: 'Alice Smith', totalAdvance: 500, salary: 2000 },
  { id: 2, name: 'Bob Johnson', totalAdvance: 300, salary: 2500 },
  { id: 3, name: 'Carol Williams', totalAdvance: 700, salary: 2200 },
  { id: 4, name: 'David Brown', totalAdvance: 400, salary: 1800 },
  { id: 5, name: 'Eva Davis', totalAdvance: 600, salary: 2600 },
];

// A reusable modal to choose sort options
const SortModal = ({ visible, onClose, onSelect }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Sort By</Text>
          <TouchableOpacity
            onPress={() => {
              onSelect('name');
              onClose();
            }}
            style={styles.modalOption}
          >
            <Text style={styles.modalText}>Name (A-Z)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onSelect('totalAdvance');
              onClose();
            }}
            style={styles.modalOption}
          >
            <Text style={styles.modalText}>Total Advance</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onSelect('salary');
              onClose();
            }}
            style={styles.modalOption}
          >
            <Text style={styles.modalText}>Salary</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.modalOption}>
            <Text style={[styles.modalText, { color: COLORS.dangerDark }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const Dashboard = () => {
  const [searchText, setSearchText] = useState('');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState(null);
    const navigation = useNavigation()
  // Filter and sort the data based on search text and sort option
  const filteredData = useMemo(() => {
    let data = sampleData;
    if (searchText) {
      data = data.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (sortOption) {
      data = [...data].sort((a, b) => {
        if (sortOption === 'name') {
          return a.name.localeCompare(b.name);
        } else if (sortOption === 'totalAdvance') {
          return a.totalAdvance - b.totalAdvance;
        } else if (sortOption === 'salary') {
          return a.salary - b.salary;
        }
        return 0;
      });
    }
    return data;
  }, [searchText, sortOption]);

  return (
    <View style={styles.container}>

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
            onPress={() => setSortModalVisible(true)}
            style={styles.sortButton}
          >
            <Text style={styles.sortButtonText}>Sort</Text>
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
            onPress={()=>{
                navigation.navigate('StaffDetails')
            }}
            style={[
              styles.tableRow,
              index % 2 === 0 ? styles.rowEven : styles.rowOdd,
            ]}
          >
            <Text style={styles.tableCell}>{index + 1}</Text>
            <Text style={styles.tableCell}>{item.name}</Text>
            <Text style={styles.tableCell}>{item.totalAdvance}</Text>
            <Text style={styles.tableCell}>{item.salary}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <SortModal
        visible={sortModalVisible}
        onClose={() => setSortModalVisible(false)}
        onSelect={(option) => setSortOption(option)}
      />
    </View>
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
    flex: 0.85,
    justifyContent: 'center'
  },
  sortButtonContainer: {
    flex: 0.15,
    marginLeft: RW(4),
    alignItems: 'flex-end',
  },
  sortButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: RW(12),
    paddingVertical: RH(8),
    borderRadius: RW(4),
  },
  sortButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.PB,
    fontSize: SIZES.s,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryLight,
    paddingVertical: RH(5),
    borderRadius: RW(4),
  },
  headerCell: {
    fontFamily: FONTS.PB,
    fontSize: SIZES.sm,
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
    borderRadius: RW(8),
    padding: RW(16),
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: FONTS.PB,
    fontSize: SIZES.l,
    marginBottom: RH(12),
    color: COLORS.black,
  },
  modalOption: {
    paddingVertical: RH(10),
    width: '100%',
    alignItems: 'center',
  },
  modalText: {
    fontFamily: FONTS.PR,
    fontSize: SIZES.m,
    color: COLORS.black,
  },
});

export default Dashboard;
