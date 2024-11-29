import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../../Screens/Chat';
import ChatScreen from '../../Screens/Home';
import ChatDetailScreen from '../../Screens/ChatDetails';
import SettingScreen from '../../Screens/Settings';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        // headerStyle: {backgroundColor: 'papayawhip'},
        headerShown: false,
        animation: 'fade_from_bottom',
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
 
    </Stack.Navigator>
  );
};
const ChatStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ChatScr" component={ChatScreen} />
    </Stack.Navigator>
  );
};

function BottomNavi() {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
        name="Chat"
        component={HomeStack}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="telescope-sharp" color={color} size={size} />
          ),
        }}
        name="Users"
        component={ChatStack}
      />
    </Tab.Navigator>
  );
}

export default BottomNavi;
