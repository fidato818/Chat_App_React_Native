import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
  createDrawerNavigator,
  Header,
} from 'react-navigation';
import React from 'react';
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
import LoginScreen from '../screens/LoginSignup';
import HomeScreen from '../screens/Home';
import ChatScreen from '../screens/Chat';
import ProfileScreen from '../screens/Profile';
import StatusScreen from '../screens/Status';
import Messages from '../screens/Messages';
import { Ionicons } from '@expo/vector-icons'; // 6.2.2

import {
  IconButton,
  Colors,
  Button,
  Provider as PaperProvider,
  Drawer,
  Divider,
} from 'react-native-paper';

class IconWithBadge extends React.Component {
  state = {
    visible: false,
  };

  render() {
    const { name, badgeCount, color, size } = this.props;
    return (
      <View style={{ width: 24, height: 24, margin: 5 }}>
        <Ionicons name={name} size={size} color={color} />
        {badgeCount > 0 && (
          <View
            style={{
              // /If you're using react-native < 0.57 overflow outside of the parent
              // will not work on Android, see https://git.io/fhLJ8
              position: 'absolute',
              right: -6,
              top: -3,
              backgroundColor: 'red',
              borderRadius: 6,
              width: 12,
              height: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
              {badgeCount}
            </Text>
          </View>
        )}
      </View>
    );
  }
}

const HomeIconWithBadge = props => {
  // You should pass down the badgeCount in some other ways like context, redux, mobx or event emitters.
  return <IconWithBadge {...props} badgeCount={3} />;
};
const BottomNavigatior = createBottomTabNavigator(
  {
    Chat: {
      screen: ChatScreen,
      navigationOptions: {
        header: null,
      },
    },
    Status: {
      screen: StatusScreen,
      navigationOptions: {
        header: null,
      },
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        if (routeName === 'Chat') {
          iconName = focused
            ? 'ios-information-circle'
            : 'ios-information-circle-outline';
          // Sometimes we want to add badges to some icons.
          // You can check the implementation below.
          IconComponent = HomeIconWithBadge;
        } else if (routeName === 'Profile') {
          iconName = focused ? 'ios-list-box' : 'ios-list';
        } else if (routeName === 'Status') {
          iconName = focused ? 'ios-people' : 'ios-people';
        }

        // You can return any component that you like here!
        return <IconComponent name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
      showIcon: true,
    },
  }
);

const DashboardNavigator = createStackNavigator(
  {
    // Auth: {
    //   screen: SwitchNavigator,
    //   navigationOptions: {
    //     header: null,
    //   },
    // },
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        header: null,
      },
    },
    Home: {
      screen: BottomNavigatior,
      navigationOptions: {
        header: null,
      },
    },
    Status: {
      screen: StatusScreen,
      navigationOptions: {
        header: null,
      },
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        header: null,
      },
    },
    TextMessages: {
      screen: Messages,
      navigationOptions: {
        header: null,
        headerStyle: { backgroundColor: '#FFF' },
        headerTitleStyle: { color: 'green' },
      },
    },
  },
  {
    initialRouteName: 'Home',

    navigationOptions: ({ navigation, navigationOptions }) => {
 
      const { params } = navigation.state;
      console.log(params)
      const { routeName } = navigation.state.routes[navigation.state.index];
      return {
        headerTitle: routeName,
        headerStyle: {
          backgroundColor: 'teal',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      };
    },
  }
);

// const customDrawerContentComponent = props => {
//   <PaperProvider>
//     <View style={styles.drawerHeader}>
//       <View>
//         <Image
//           style={styles.drawerImage}
//           source={require('../assets/kisspng-skype-computer-icons-symbol-download-crime-5ac34b54cd3cf7.3486135615227482448407.png')}
//         />
//       </View>
//     </View>
//     <View>
//       <DrawerItems {...props} />
//     </View>
//   </PaperProvider>;
// };
const SwitchNavigator = createSwitchNavigator({
  Login: {
    screen: LoginScreen,
  },
});

const DashboardStackNavigator = createStackNavigator(
  {
    DashboardTabNavigator: {
      screen: DashboardNavigator,
    },
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        headerRight: (
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={{
              left: Dimensions.get('window').height < 667 ? '15%' : '3%',
              // backgroundColor: 'red',
              // width: '100%',
              marginRight: 30,
            }}>
            <Image
              style={{ width: 30, height: 30 }}
              source={require('../../assets/icons/icons8-export-24.png')}
            />
          </TouchableOpacity>
        ),
        headerLeft: (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            // style={{
            //   left: Dimensions.get('window').height < 667 ? '8%' : '3%',
            //   backgroundColor: 'red',
            //   width: '100%',
            // }}
          >
            <Image
              style={{ width: 30, height: 30, marginLeft: 15 }}
              source={require('../../assets/icons/icons8-menu-24.png')}
            />
          </TouchableOpacity>
        ),
      };
    },
  }
);

// const AppDrawerNavigator = createDrawerNavigator(
//   {
//     Dashboards: {
//       screen: DashboardStackNavigator,
//       navigationOptions: {
//         drawerLabel: () => null,
//       },
//     },
//     Home: {
//       screen: HomeScreen,
//       navigationOptions: {
//         header: null,
//       },
//     },
//   },
//   {
//     contentComponent: props => (
//       <ScrollView>
//         <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
//           <Image
//             style={{
//               width: 150,
//               height: 150,
//               marginTop: 20,
//               marginLeft: 50,
//               borderRadius: 150 / 2,
//             }}
//             source={require('../assets/account_circle_black_120x120.png')}
//           />

//           <View>
//             <Text>adnanahmed@gmail.com</Text>
//           </View>

//           <Drawer.Item
//             label="Home"
//             active="true"
//             onPress={() => props.navigation.navigate('Home')}
//           />
//           <Drawer.Item
//             label="Login for Practice"
//             active="true"
//             onPress={() => props.navigation.navigate('Login')}
//           />
//           <Drawer.Item
//             label="My Device"
//             active="true"
//             onPress={() => props.navigation.navigate('My Device')}
//           />
//           <Drawer.Item
//             label="My Robbed History"
//             active="true"
//             onPress={() => props.navigation.navigate('My Robbed History')}
//           />
//           <Drawer.Item
//             label="All Robbed History"
//             active="true"
//             onPress={() => props.navigation.navigate('All Robbed History')}
//           />
//           <Drawer.Item
//             style={{ bottom: 0 }}
//             label="LOGOUT"
//             active="true"
//             onPress={() => props.navigation.navigate('All Robbed History')}
//           />
//         </SafeAreaView>
//       </ScrollView>
//     ),
//   }
// );

const AppSwitchNavigator = createSwitchNavigator({
  // Auth: { screen: SplashScreen },
  // Dashboard: { screen: AppDrawerNavigator },
  Dashboard: { screen: DashboardStackNavigator },
});

const AppContainer = createAppContainer(AppSwitchNavigator);

export default createAppContainer(AppContainer);
