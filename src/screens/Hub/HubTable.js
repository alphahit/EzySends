import React, {useState, useEffect, useCallback} from 'react';
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
import SearchIcon from '../../assets/svg/search.svg';
import {DrawerActions} from '@react-navigation/native';
import PlusWhite from '../../assets/svg/plusWhite.svg';
import {getHubDataFromFirestore} from '../../firebase/firebaseFunctions';

// Get screen width for calculations
const SCREEN_WIDTH = Dimensions.get('window').width;

const HubTable = ({navigation}) => {
  const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH - RW(40)); // Account for screen padding
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [hubData, setHubData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch hub data when component mounts and when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchHubData();
    });

    // Initial fetch
    fetchHubData();

    // Cleanup subscription
    return unsubscribe;
  }, [navigation]);

  const fetchHubData = async () => {
    try {
      setIsLoading(true);
      const data = await getHubDataFromFirestore();
      setHubData(data);
      setFilteredData(data);
    } catch (error) {
      console.error('Error fetching hub data:', error);
      Alert.alert('Error', 'Failed to fetch hub data');
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleRowPress = row => {
    navigation.navigate('AddHub', {mode: 'view', editData: row});
  };

  const handleRowLongPress = (rowData, index) => {
    Alert.alert(
      'Hub Options',
      `${rowData.hubName}`,
      [
        {
          text: 'Edit',
          onPress: () => {
            navigation.navigate('AddHub', {
              mode: 'edit',
              editData: rowData,
            });
          },
        },
        {
          text: 'Delete',
          onPress: () => console.log('Delete pressed for', rowData.hubName),
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
            fill={COLORS.tableTextDark}
          />
        }
        onPressLeft={handleMenuPress}
      />

      {/* Hub Search */}
      <View style={styles.searchContainer}>
        <SearchInput
          placeholder="Search hub..."
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
