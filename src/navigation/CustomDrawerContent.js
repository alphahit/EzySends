import React, { useState } from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

import {COLORS, FONTS, SIZES, RH, RW, RPH, RHA} from '../theme';
import DashboardIcon from '../assets/svg/dashboard.svg';
import ContactPageIcon from '../assets/svg/contact_page.svg';
import HubIcon from '../assets/svg/hub.svg';
import LogoutIcon from '../assets/svg/logout.svg';
import AppLogo from '../assets/svg/appLogo.svg';
import AppText from '../components/AppText/AppText';
import ConfirmModal from '../components/ConfirmModal/ConfirmModal';

const LogoutButton = ({onPress}) => (
  <TouchableOpacity style={styles.logoutButton} onPress={onPress}>
    <LogoutIcon width={24} height={24} />
    <Text style={styles.logoutText}>Logout</Text>
  </TouchableOpacity>
);

const CustomDrawerContent = props => {
  const {state} = props;
  const iconSize = RPH(24);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  const showLogoutModal = () => {
    setLogoutModalVisible(true);
  };

  const handleLogoutConfirm = () => {
    // Close the modal
    setLogoutModalVisible(false);
    
    // Navigate to login screen
    props.navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  // Custom drawer items
  const CustomDrawerItem = ({label, icon, onPress, isActive}) => (
    <TouchableOpacity
      style={[styles.drawerItem, isActive && styles.activeDrawerItem]}
      onPress={onPress}>
      {icon}
      <Text
        style={[
          styles.drawerItemText,
          isActive && styles.activeDrawerItemText,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={{marginTop: RPH(68), marginLeft: RPH(20)}}>
        <AppLogo
          width={RPH(109)}
          height={RHA(80)}
          fill={COLORS.tableTextDark} // Match color if needed
        />
        <AppText style={styles.text}>EZY SENDS</AppText>
      </View>

      <View style={styles.divider} />

      <View style={styles.drawerItemsContainer}>
        {/* Custom drawer items */}
        <CustomDrawerItem
          label="Dashboard"
          icon={
            <DashboardIcon
              width={iconSize}
              height={iconSize}
              fill={state.index === 0 ? '#FFFFFF' : '#282828'}
            />
          }
          onPress={() => props.navigation.navigate('Dashboard')}
          isActive={state.index === 0}
        />

        <CustomDrawerItem
          label="Staff Database"
          icon={
            <ContactPageIcon
              width={iconSize}
              height={iconSize}
              fill={state.index === 1 ? '#FFFFFF' : '#282828'}
            />
          }
          onPress={() => {
            props.navigation.navigate('Staff Database', {
              screen: 'StaffTable'
            });
          }}
          isActive={state.index === 1}
        />

        <CustomDrawerItem
          label="Hub Database"
          icon={
            <HubIcon
              width={iconSize}
              height={iconSize}
              fill={state.index === 2 ? '#FFFFFF' : '#282828'}
            />
          }
          onPress={() => {
            props.navigation.navigate('Hub Database', {
              screen: 'HubTable'
            });
          }}
          isActive={state.index === 2}
        />
      </View>

      <LogoutButton onPress={showLogoutModal} />
      
      <ConfirmModal
        visible={isLogoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        title="Logout"
        message="Are you sure you want to logout?"
        actions={[
          {
            label: 'YES',
            onPress: handleLogoutConfirm,
            backgroundColor: '#274940', // primary color
            textColor: '#FFFFFF',
          },
          {
            label: 'NO',
            onPress: () => setLogoutModalVisible(false),
            backgroundColor: '#C5C5C5', // secondary color
            textColor: '#FFFFFF',
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 14,
    width: 123,
    height: 109,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 68,
  },
  logo: {
    width: 93,
    height: 68,
    position: 'relative',
  },
  logoVector1: {
    position: 'absolute',
    left: '10.05%',
    right: '37.92%',
    top: '0%',
    bottom: '57.75%',
    backgroundColor: '#558479',
  },
  logoVector2: {
    position: 'absolute',
    left: '0%',
    right: '24.78%',
    top: '12.23%',
    bottom: '49.6%',
    backgroundColor: '#274940',
  },
  logoVector3: {
    position: 'absolute',
    left: '17.25%',
    right: '39.16%',
    top: '34.32%',
    bottom: '41.11%',
    backgroundColor: '#558479',
    opacity: 0.8,
  },
  logoVector4: {
    position: 'absolute',
    left: '29.91%',
    right: '36.97%',
    top: '35.99%',
    bottom: '37.68%',
    backgroundColor: '#558479',
    opacity: 0.8,
  },
  logoVector5: {
    position: 'absolute',
    left: '42.95%',
    right: '35.8%',
    top: '39.1%',
    bottom: '38.33%',
    backgroundColor: '#558479',
    opacity: 0.4,
  },
  logoText: {
    width: 123,
    height: 27,
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 22,
    lineHeight: 27,
    textAlign: 'center',
    color: '#274940',
  },
  divider: {
    width: '100%',
    height: 1,
    marginTop: 44,
    backgroundColor: '#D1DEDB',
  },
  drawerItemsContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingLeft: 15,
    gap: 12,
    marginBottom: 18,
    borderRadius: 4,
  },
  activeDrawerItem: {
    backgroundColor: '#274940',
  },
  drawerItemText: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: '#282828',
    flex: 1,
  },
  activeDrawerItemText: {
    color: '#FFFFFF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingLeft: 15,
    gap: 12,
    position: 'absolute',
    width: 313,
    height: 52,
    left: 25,
    bottom: 41,
  },
  logoutIconBox: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  logoutIcon: {
    position: 'absolute',
    left: '5.75%',
    right: '88.63%',
    top: '32.69%',
    bottom: '32.69%',
    backgroundColor: '#274940',
  },
  logoutText: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: '#274940',
    flex: 1,
  },
  text: {
    fontSize: RHA(21.9734),
    lineHeight: RHA(27),
    textAlign: 'center',
    color: '#274940',
    width: RPH(123),
    height: RHA(27),
    marginTop: RH(10),
  },
});

export default CustomDrawerContent;
