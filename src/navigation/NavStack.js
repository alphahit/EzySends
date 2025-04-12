import * as React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import Home from '../screens/Home';
import Login from '../screens/Login/Login';
import StaffDetails from '../screens/Staff/StaffDetails';
const NavStack = createStackNavigator();

const HomeStack = () => {
  return (
    <NavStack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
      initialRouteName={"Login"}>
        <NavStack.Screen name="Login" component={Login} /> 
        <NavStack.Screen name="Home" component={Home} />
        <NavStack.Screen name="StaffDetails" component={StaffDetails} />
        
      </NavStack.Navigator>
  );
};
export default HomeStack;