import {DrawerActions} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import Drawer from '../../assets/svg/drawer.svg';
import FwdIcon from '../../assets/svg/fwd.svg';
import ImportIcon from '../../assets/svg/import.svg';
import PayoutIcon from '../../assets/svg/payout.svg';
import PlusWhite from '../../assets/svg/plusWhite.svg';
import RvpIcon from '../../assets/svg/rvp.svg';
import StaffIcon from '../../assets/svg/staff.svg';
import AppHeader from '../../components/AppHeader/AppHeader';
import AppText from '../../components/AppText/AppText';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import DashboardBox from '../../components/DashboardBox/DashboardBox';
import {COLORS, FONTS, RH, RHA, RPH} from '../../theme';
import {getStaffDataFromFirestore} from '../../firebase/firebaseFunctions';
import FilterButton from '../../components/FilterButton';
import { useSelector, useDispatch } from 'react-redux';
import { fetchHubs } from '../../store/hubSlice';
import FilterHubButton from '../../components/FilterHubButton/FilterHubButton';

// For the icons, we would typically import them from a library like react-native-vector-icons
// For this example, I'll create placeholders

const DashboardScreen = ({navigation}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [staftData, setStaffData] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const { hubs, loading: hubsLoading } = useSelector(state => state.hub);
  const [selectedHub, setSelectedHub] = useState('');

  // Fetch all hubs when dashboard mounts
  useEffect(() => {
    dispatch(fetchHubs());
  }, [dispatch]);

  // Update date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format date and time
  const formatDate = date => {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = date => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const handleLogout = () => {
    // perform your logout logic here
    console.log('Logged out!');
    setModalVisible(false);
  };
  const iconSize = RPH(24);

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  // const handleNotificationsPress = () => {
  //   Alert.alert('Notifications Pressed!');
  // };

  const navigateToAddStaff = () => {
    navigation.navigate('Staff Database', {
      screen: 'AddStaff',
    });
  };

  const navigateToAddHub = () => {
    navigation.navigate('Hub Database', {
      screen: 'AddHub',
    });
  };
  const handlegetStaffData = async () => {
    try {
      const res = await getStaffDataFromFirestore();
      console.log('Staff Data:', res);
      if (res?.length > 0) {
        setStaffData(res);
      }
    } catch (error) {
      console.error('Error fetching staff data:', error);
      Alert.alert('Error', 'Failed to fetch staff data.');
    }
  };
  useEffect(() => {
    handlegetStaffData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await handlegetStaffData();
    setRefreshing(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Dashboard"
        // --- Pass SVG components directly ---
        leftIcon={
          <Drawer
            width={iconSize}
            height={iconSize}
            fill={COLORS.tableTextDark} // Control SVG color via fill/stroke props
          />
        }
        onPressLeft={handleMenuPress}

        // --- ---
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View style={styles.filterContainer}>
          <FilterHubButton
            hubNames={hubs.map(hub => hub.hubName)}
            selectedHub={selectedHub}
            setSelectedHub={setSelectedHub}
          />
          <FilterButton />
        </View>

        {/* Dashboard Stats Row 1 */}
        <View style={styles.statsRow}>
          <DashboardBox
            title="Staff"
            value={
              selectedHub
                ? staftData.filter(staff => staff.hub?.hubName === selectedHub).length
                : staftData.length
            }
            icon={
              <StaffIcon
                width={iconSize}
                height={iconSize}
                fill={COLORS.whiteText}
              />
            }
            backgroundColor={COLORS.primaryColor}
            disabled={false}
            // onPress={navigateToStaffTable}
          />

          <DashboardBox
            title="Payout"
            value="₹380"
            icon={
              <PayoutIcon
                width={iconSize}
                height={iconSize}
                fill={COLORS.whiteText}
              />
            }
            backgroundColor={COLORS.primaryColor}
          />
        </View>
        {/* Dashboard Stats Row 2 */}
        <View style={styles.statsRow}>
          <DashboardBox
            title="FWD"
            value="380"
            icon={
              <FwdIcon
                width={iconSize}
                height={iconSize}
                fill={COLORS.whiteText}
              />
            }
            backgroundColor={COLORS.primaryColor}
          />

          <DashboardBox
            title="RVP"
            value="380"
            icon={
              <RvpIcon
                width={iconSize}
                height={iconSize}
                fill={COLORS.whiteText}
              />
            }
            backgroundColor={COLORS.primaryColor}
          />
        </View>
        <View style={styles.statsRow}>
          <DashboardBox
            title="FWD"
            value="Import Today Data"
            icon={
              <ImportIcon
                width={iconSize}
                height={iconSize}
                fill={COLORS.whiteText}
              />
            }
            backgroundColor={COLORS.primaryColor}
            disabled={false}
            largeText={false}
            headerText={false}
            onPress={() => {
              console.log('Test ---->');
            }}
          />

          <View style={{width: '47%', justifyContent: 'space-between'}}>
            <TouchableOpacity
              style={styles.fabButton}
              onPress={navigateToAddStaff}>
              <PlusWhite
                width={iconSize}
                height={iconSize}
                fill={COLORS.whiteText}
              />
              <AppText style={styles.buttonText}>Staff</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fabButton}
              onPress={navigateToAddHub}>
              <PlusWhite
                width={iconSize}
                height={iconSize}
                fill={COLORS.whiteText}
              />
              <AppText style={styles.buttonText}>Hub</AppText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.dtcontainer]}>
          <View>
            <AppText style={styles.dateText}>Date</AppText>
            <AppText style={styles.dateText}>
              {formatDate(currentDateTime)}
            </AppText>
          </View>

          <View>
            <AppText style={styles.dateText}>TimeStamp</AppText>
            <AppText style={styles.timeText}>
              {formatTime(currentDateTime)}
            </AppText>
          </View>
        </View>
      </ScrollView>

      <ConfirmModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        title="Logout"
        message="Are you sure you want to logout?"
        actions={[
          {
            label: 'YES',
            onPress: handleLogout,
            backgroundColor: '#274940', // primary color
            textColor: '#FFFFFF',
          },
          {
            label: 'NO',
            onPress: () => setModalVisible(false),
            backgroundColor: '#C5C5C5', // secondary color
            textColor: '#FFFFFF',
          },
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBackgroundColor,
  },
  scrollContent: {
    flexGrow: 1,
    padding: RPH(20),
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: RHA(20),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: RHA(20),
    gap: '3%',
  },
  actionContainer: {
    marginTop: RH(10),
    gap: RHA(15),
  },
  dtcontainer: {
    width: '100%',
    height: RHA(44),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: RHA(22),
    alignSelf: 'center',
  },
  dateText: {
    fontFamily: FONTS.PM,
    fontWeight: '400',
    fontSize: RHA(12),
    lineHeight: RHA(18),
    color: '#272727',
  },
  timeText: {
    fontFamily: FONTS.PM,
    fontWeight: '400',
    fontSize: RHA(12),
    lineHeight: RHA(18),
    textAlign: 'right',
    color: '#272727',
  },
  fabButton: {
    height: RPH(50),
    flexDirection: 'row',
    backgroundColor: COLORS.primaryColor,
    paddingLeft: RPH(15),
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
  buttonText: {
    color: COLORS.whiteText,
    marginLeft: RPH(8),
  },
});

export default DashboardScreen;
