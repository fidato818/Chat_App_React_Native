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
import Messages from '../pages/Messages';
import MessagesDetailScreen from '../pages/MessagesDetail';

import BottomNav from './BottomNav';

import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  SafeAreaView,
  Menu,
  Provider,
} from 'react-native';

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons'; // 6.2.2
import { connect } from 'react-redux';
import {
  IconButton,
  Colors,
  Button,
  Provider as PaperProvider,
  Divider,
  DefaultTheme,
} from 'react-native-paper';

const Stack = createNativeStackNavigator();

const MessagesStack = (props) => {
  return (
    <Stack.Navigator
      // initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Messages" component={Messages} />
    </Stack.Navigator>
  );
};

export default MessagesStack;
