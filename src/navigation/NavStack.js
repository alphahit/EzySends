import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../screens/Home/Home';
import Login from '../screens/Login/Login';
import StaffDetails from '../screens/Staff/StaffDetails';
import AddEmployee from '../screens/AddEmployee/AddEmployee';
import EditEmployee from '../screens/AddEmployee/EditEmployee';
import {MMKV} from 'react-native-mmkv';
import {ActivityIndicator, View} from 'react-native';

const NavStack = createStackNavigator();
const storage = new MMKV();

const HomeStack = () => {
  const [initialRoute, setInitialRoute] = React.useState(null);

  React.useEffect(() => {
    // MMKV is synchronous, so this is fine
    const isLoggedIn = storage.getBoolean('loggedIn');
    setInitialRoute(isLoggedIn ? 'Home' : 'Login');
  }, []);

  if (!initialRoute) {
    // Show a loading indicator while checking login status
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <NavStack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
      initialRouteName={initialRoute}>
        <NavStack.Screen name="Login" component={Login} /> 
        <NavStack.Screen name="Home" component={Home} />
        <NavStack.Screen name="StaffDetails" component={StaffDetails} />
        <NavStack.Screen name="AddEmployee" component={AddEmployee} />
        <NavStack.Screen name="EditEmployee" component={EditEmployee} />
      </NavStack.Navigator>
  );
};
export default HomeStack;