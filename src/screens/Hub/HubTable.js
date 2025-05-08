import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {COLORS, FONTS, SIZES, RH, RW, RPH, RHA} from '../../theme';
import AppText from '../../components/AppText/AppText';
import TableComponent from '../../components/TableComponent';
import AppHeader from '../../components/AppHeader/AppHeader';
import SearchInput from '../../components/SearchInput';
import Drawer from '../../assets/svg/drawer.svg';
import NotificationIcon from '../../assets/svg/bell.svg';
import SearchIcon from '../../assets/svg/search.svg';
import {DrawerActions} from '@react-navigation/native';
import PlusWhite from '../../assets/svg/plusWhite.svg';
// Get screen width for calculations
const SCREEN_WIDTH = Dimensions.get('window').width;

const HubTable = ({navigation}) => {
  const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH - RW(40)); // Account for screen padding
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  // Calculate column widths
  const getColumnWidths = availableWidth => ({
    id: Math.floor(availableWidth * 0.08),
    hubName: Math.floor(availableWidth * 0.32),
    hubCode: Math.floor(availableWidth * 0.3),
    totalStaff: Math.floor(availableWidth * 0.3),
  });

  // Get column widths based on container width
  const columnWidths = getColumnWidths(containerWidth);
  // Table headers
  const headers = [
    {title: '#', key: 'id', width: columnWidths.id},
    {title: 'Hub Name', key: 'hubName', width: columnWidths.hubName},
    {title: 'Unique Code', key: 'hubCode', width: columnWidths.hubCode},
    {title: 'Total Staff', key: 'totalStaff', width: columnWidths.totalStaff},
  ];

  // Sample hub data
  const hubData = useMemo(
    () => [
      {id: '1', hubName: 'Khariar', hubCode: 'ESY001', totalStaff: '10'},
      {id: '2', hubName: 'Kolkata', hubCode: 'ESY002', totalStaff: '15'},
      {id: '3', hubName: 'Sinapali', hubCode: 'ESY003', totalStaff: '25'},
      {id: '4', hubName: 'Nuapada', hubCode: 'ESY004', totalStaff: '05'},
      {id: '5', hubName: 'Karangamal', hubCode: 'ESY005', totalStaff: '05'},
    ],
    [],
  );

  // Filter logic
  const filterData = useCallback(() => {
    if (!searchText.trim()) {
      setFilteredData(hubData);
    } else {
      const lc = searchText.toLowerCase();
      setFilteredData(
        hubData.filter(
          item =>
            item.hubName.toLowerCase().includes(lc) ||
            item.hubCode.toLowerCase().includes(lc) ||
            item.id.includes(lc),
        ),
      );
    }
  }, [searchText, hubData]);

  // Apply filter when search text changes
  useEffect(() => {
    filterData();
  }, [filterData]);

  // Initialize filtered data on component mount
  useEffect(() => {
    setFilteredData(hubData);
  }, [hubData]);

  const handleRowPress = row => {
    navigation.navigate('AddHub', {mode: 'view', editData: row});
  };

  const handleRowLongPress = (rowData, index) => {
    Alert.alert(
      'Staff Options',
      `${rowData.name}`,
      [
        {
          text: 'Edit',
          onPress: () => console.log('Edit pressed for', rowData.name),
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

  const iconSize = RPH(24);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Hub Database"
        leftIcon={
          <Drawer
            width={iconSize}
            height={iconSize}
            fill={COLORS.tableTextDark} // Control SVG color via fill/stroke props
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
            scrollEnabled={false} // Disable scrolling within the table
            containerWidth={containerWidth}
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => navigation.navigate('AddHub')}>
        <PlusWhite width={iconSize} height={iconSize} fill={COLORS.whiteText} />
        <AppText style={{color: COLORS.whiteText, marginLeft: RPH(8)}}>
          Add Hub
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

export default HubTable;
