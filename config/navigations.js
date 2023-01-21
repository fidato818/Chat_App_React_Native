import React from 'react';
import { Transition } from 'react-native-reanimated';
import {
  AntDesign as Icon,
  FontAwesome as FontAwesomeIcon,
} from 'react-native-vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomDrawerContentComponent from './Drawer';

//pages
import HomeScreen from '../pages/Home';
import MessagesDetailScreen from '../pages/MessagesDetail';
import LoginScreen from '../pages/Login';
import SignupScreen from '../pages/Signup';

import OTPScreen from '../pages/OTP';

//Stacks
import BottomNav from './BottomNav';
import CustomNavigationBar from '../components/CustomNavigationBar';



import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import { connect } from 'react-redux';


const Stack = createNativeStackNavigator();

const LoginStack = (props) => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        // header: (props) => <CustomNavigationBar {...props} />,
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
    </Stack.Navigator>
  );
};
const HomeStack = (props) => {
  return (
    <Stack.Navigator
      initialRouteName="MessagesDetailScreen"
      screenOptions={{
        headerShown: false,
        // header: (props) => <CustomNavigationBar {...props} />,
      }}>
      <Stack.Screen name="Home" component={BottomNav} />
      <Stack.Screen name="Messages Detail" component={MessagesDetailScreen} />
    </Stack.Navigator>
  );
};

const Drawer = createDrawerNavigator();

const DrawerNavi = (props) => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContentComponent {...props} />}>
      <Drawer.Screen name="Home" component={HomeStack} />
      {/**  <Drawer.Screen name="Notifications" component={NotificationsScreen} />*/}
    </Drawer.Navigator>
  );
};

const App = (props) => {
  // console.log('props', props);
  const currentUser = props.props && props.user.user;
  // console.log('currentUser', currentUser);
  return (
    <NavigationContainer>
      {/*   {currentUser !== '' ? <DrawerNavigator /> : <LoginStackNavigator />}*/}
      {currentUser !== '' ? <HomeStack /> : <LoginStack />}
    </NavigationContainer>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

//   return {
//     user: state.user,
//   };

export default connect(mapStateToProps, null)(App);
