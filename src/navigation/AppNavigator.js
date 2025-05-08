import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import AddHubScreen from '../screens/AddHubScreen/AddHubScreen';
import AddStaffScreen from '../screens/AddStaff';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import HubTable from '../screens/Hub/HubTable';
import LoginScreen from '../screens/Login/LoginScreen';
import StaffTable from '../screens/Staff/StaffTable';
import StaffDetail from '../screens/StaffDetail/StaffDetail';
import CustomDrawerContent from './CustomDrawerContent';
import ResetPasswordScreen from '../screens/ResetPasswordScreen/ResetPasswordScreen';
import DragAndDrop from '../screens/Test/DragAndDrop';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
      <Stack.Screen name="StaffDetail" component={StaffDetail} />
      <Stack.Screen name="AddStaff" component={AddStaffScreen} />
      <Stack.Screen name="AddHub" component={AddHubScreen} />
    </Stack.Navigator>
  );
}

function StaffStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="StaffTable" component={StaffTable} />
      <Stack.Screen name="StaffDetail" component={StaffDetail} />
      <Stack.Screen name="AddStaff" component={AddStaffScreen} />
    </Stack.Navigator>
  );
}

function HubStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HubTable" component={HubTable} />
      <Stack.Screen name="AddHub" component={AddHubScreen} />
    </Stack.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 349,
          backgroundColor: '#FFFFFF',
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: -3,
          },
          shadowOpacity: 0.25,
          shadowRadius: 20.7,
          elevation: 5,
        },
        drawerLabelStyle: {
          fontFamily: 'Poppins-Medium',
          fontSize: 16,
          lineHeight: 24,
        },
        drawerActiveTintColor: '#FFFFFF',
        drawerActiveBackgroundColor: '#274940',
        drawerInactiveTintColor: '#282828',
      }}>
      <Drawer.Screen name="Dashboard" component={MainStack} />
      <Drawer.Screen name="Staff Database" component={StaffStack} />
      <Drawer.Screen name="Hub Database" component={HubStack} />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="DragAndDrop" component={DragAndDrop} />
        
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="MainApp" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
