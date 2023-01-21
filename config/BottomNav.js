import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Messages from '../pages/Messages';
import SettingScreen from '../pages/Settings';

//Stacks
import MessagesStack from './MessagesNav';

const Tab = createBottomTabNavigator();

const BottomNav = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Messages">  
      {/*  <Tab.Screen
        name="Home" 
        component={Home}
        options={{
          title: 'Awesome app',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />*/}
      <Tab.Screen
        name="Messages"
        component={MessagesStack}
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="android-messages"
              color={color}
              size={26}
            />
          ),
          tabBarHideOnKeyboard: true,
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color }) => (
            <AntDesign name="setting" color={color} size={26} />
          ),
          tabBarHideOnKeyboard: true,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNav;
