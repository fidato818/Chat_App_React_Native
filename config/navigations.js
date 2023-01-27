import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomDrawerContentComponent from './Drawer';

//pages
import Splashcreen from '../pages/Splash';
import MessagesDetailScreen from '../pages/MessagesDetail';
import LoginScreen from '../pages/Login';
import SignupScreen from '../pages/Signup';

import OTPScreen from '../pages/OTP';

//Stacks
import BottomNav from './BottomNav';

import { createDrawerNavigator } from '@react-navigation/drawer';

import { connect } from 'react-redux';

const Stack = createNativeStackNavigator();

const LoginStack = (props) => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        // header: (props) => <CustomNavigationBar {...props} />,
      }}>
      <Stack.Screen name="Splash" component={Splashcreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
    </Stack.Navigator>
  );
};
const HomeStack = (props) => {
  return (
    <Stack.Navigator
      // initialRouteName="Splashcreen"
      screenOptions={{
        headerShown: false,
        // header: (props) => <CustomNavigationBar {...props} />,
      }}>
      // <Stack.Screen name="Splash" component={Splashcreen} />
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
  const currentValidation = props.user && props.user.user;
  const currentUser =
    currentValidation !== '' || currentValidation === undefined;
  // console.log('currentUser on Nav', currentValidation);
  // console.log('currentUser on Nav', currentUser);
  return (
    <NavigationContainer>
      {/*   {currentUser !== '' ? <DrawerNavigator /> : <LoginStackNavigator />}*/}
      {currentUser ? <HomeStack /> : <LoginStack />}
    </NavigationContainer>
  );
};
// const mapStateToProps = (state) => {
//   console.log('state', state);
//   // return {
//   //   user: state.user,
//   // };
// };
const mapStateToProps = (state) => ({
  user: state.user,
});

//   return {
//     user: state.user,
//   };

export default connect(mapStateToProps, null)(App);
