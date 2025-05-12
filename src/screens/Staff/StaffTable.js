import { DrawerActions } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Drawer from '../../assets/svg/drawer.svg';
import PlusWhite from '../../assets/svg/plusWhite.svg';
import SearchIcon from '../../assets/svg/search.svg';
import AppHeader from '../../components/AppHeader/AppHeader';
import AppText from '../../components/AppText/AppText';
import SearchInput from '../../components/SearchInput';
import TableComponent from '../../components/TableComponent';
import { COLORS, RH, RPH, RW } from '../../theme';
import { getStaffDataFromFirestore } from '../../firebase/firebaseFunctions';

// Get screen width for calculations
const SCREEN_WIDTH = Dimensions.get('window').width;

const StaffTable = ({navigation}) => {
  const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH - RW(40)); // Account for screen padding
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch staff data when component mounts and when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchStaffData();
    });

    // Initial fetch
    fetchStaffData();

    // Cleanup subscription
    return unsubscribe;
  }, [navigation]);

  const fetchStaffData = async () => {
    try {
      setIsLoading(true);
      const data = await getStaffDataFromFirestore();
      setStaffData(data);
      setFilteredData(data);
    } catch (error) {
      console.error('Error fetching staff data:', error);
      Alert.alert('Error', 'Failed to fetch staff data');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate appropriate column widths based on available space
  const getColumnWidths = availableWidth => {
    // Distribute proportionally (approximate percentages)
    return {
      id: Math.floor(availableWidth * 0.08), // 8% for ID column
      name: Math.floor(availableWidth * 0.32), // 32% for Name column
      perFwd: Math.floor(availableWidth * 0.2), // 20% for Per FWD
      perRvp: Math.floor(availableWidth * 0.2), // 20% for Per RVP
      hub: Math.floor(availableWidth * 0.2), // 20% for HUB
    };
  };

  // Get column widths based on container width
  const columnWidths = getColumnWidths(containerWidth);

  // Define table headers with proportional column widths
  const headers = [
    {
      title: '#',
      key: 'id',
      width: columnWidths.id,
    },
    {
      title: 'Name',
      key: 'name',
      width: columnWidths.name,
    },
    {
      title: 'Per FWD',
      key: 'perFwd',
      width: columnWidths.perFwd,
    },
    {
      title: 'Per RVP',
      key: 'perRvp',
      width: columnWidths.perRvp,
    },
    {
      title: 'HUB',
      key: 'hub',
      width: columnWidths.hub,
    },
  ];

  // Filter function
  const filterData = useCallback(() => {
    if (!searchText.trim()) {
      setFilteredData(staffData);
    } else {
      const lowercasedFilter = searchText.toLowerCase();
      const filtered = staffData.filter(item => {
        return (
          item.name.toLowerCase().includes(lowercasedFilter) ||
          item.id.toLowerCase().includes(lowercasedFilter) ||
          (item.hub && item.hub.toLowerCase().includes(lowercasedFilter))
        );
      });
      setFilteredData(filtered);
    }
  }, [searchText, staffData]);

  // Apply filter when search text changes
  useEffect(() => {
    filterData();
  }, [filterData]);

  const handleRowPress = (rowData, index) => {
    navigation.navigate('StaffDetail', {
      staffId: rowData.docId,
      staffData: rowData,
    });
  };

  const handleRowLongPress = (rowData, index) => {
    Alert.alert(
      'Staff Options',
      `${rowData.name}`,
      [
        {
          text: 'Edit',
          onPress: () => {
            navigation.navigate('AddStaff', {
              mode: 'edit',
              editData: rowData,
            });
          },
        },
        {
          text: 'Delete',
          onPress: () => console.log('Delete pressed for', rowData.name),
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  // Handle container size changes
  const handleLayoutChange = event => {
    const {width} = event.nativeEvent.layout;
    setContainerWidth(width);
  };
  
  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  const handleSearchClear = () => {
    setSearchText('');
  };

  const navigateToAddStaff = () => {
    navigation.navigate('AddStaff');
  };

  const iconSize = RPH(24);
  
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Staff Database"
        leftIcon={
          <Drawer
            width={iconSize}
            height={iconSize}
            fill={COLORS.tableTextDark}
          />
        }
        onPressLeft={handleMenuPress}
      />

      {/* Staff Search */}
      <View style={styles.searchContainer}>
        <SearchInput
          placeholder="Search staff..."
          value={searchText}
          onChangeText={setSearchText}
          onClear={handleSearchClear}
          leftIcon={
            <SearchIcon
              width={RPH(20)}
              height={RPH(20)}
              fill="none"
              stroke={COLORS.tableTextDark}
            />
          }
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.tableContainer} onLayout={handleLayoutChange}>
          <TableComponent
            headers={headers}
            data={filteredData}
            onRowPress={handleRowPress}
            onRowLongPress={handleRowLongPress}
            scrollEnabled={false}
            containerWidth={containerWidth}
            isLoading={isLoading}
          />
        </View>
      </ScrollView>

      {/* Add Staff FAB */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={navigateToAddStaff}
      >
        <PlusWhite
          width={iconSize}
          height={iconSize}
          fill={COLORS.whiteText}
        />
        <AppText style={{color: COLORS.whiteText, marginLeft: RPH(8)}}>
          Add Staff
        </AppText>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBackgroundColor,
  },
  searchContainer: {
    paddingHorizontal: RW(20),
    marginTop: RH(10),
    marginBottom: RH(15),
  },
  scrollContent: {
    flexGrow: 1,
    padding: RW(20),
    paddingTop: 0,
  },
  headerContainer: {
    marginBottom: RH(25),
  },
  headerTitle: {
    fontWeight: '600',
  },
  tableContainer: {
    width: '100%',
  },
  fabButton: {
    position: 'absolute',
    bottom: RH(20),
    right: RW(20),
    width: RPH(138),
    height: RPH(52),
    flexDirection: 'row',
    backgroundColor: COLORS.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});

export default StaffTable;
