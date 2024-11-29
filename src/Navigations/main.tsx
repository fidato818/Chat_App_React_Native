import React, {useState, useEffect} from 'react';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../Screens/Chat';
import ChatScreen from '../Screens/Home';
import ChatDetailScreen from '../Screens/ChatDetails';
import SettingScreen from '../Screens/Settings';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import BootSplash from 'react-native-bootsplash';
//Auth
import SignupScr from '../Screens/Auth/Signup';
import LoginScr from '../Screens/Auth/Login';
import LoginWithPhone from '../Screens/Auth/LoginWithPhone';
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  ThemeProvider,
} from 'react-native-paper';

import merge from 'deepmerge';
import {useSelector} from 'react-redux';

import auth from '@react-native-firebase/auth';
import BottomNavi from './BottomNavi';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);
const LoginStack = () => {
  return (
    <Stack.Navigator
      // initialRouteName={uid !== undefined ? 'Home' : 'Login'}
      initialRouteName={'Login'}
      screenOptions={{
        headerStyle: {backgroundColor: 'papayawhip'},
        headerShown: false,
        animation: 'fade_from_bottom',
      }}>
      <Stack.Screen name="Signup" component={SignupScr} />
      <Stack.Screen name="Login" component={LoginScr} />
      <Stack.Screen name="LoginWithPhone" component={LoginWithPhone} />
    </Stack.Navigator>
  );
};
// const theme = {
//   ...DefaultTheme,
//   roundness: 2,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: '#3498db',
//     accent: '#f1c40f',
//   },
// };

const MainNavigation = () => {
  const themeSelector = useSelector((state: any) => state.isThemeDark);
  const getUserData = useSelector((state: any) => state.user);

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  let theme =
    themeSelector !== false ? CombinedDarkTheme : CombinedDefaultTheme;

  // const checkUser = [null, undefined];
  // const isLoginUser = checkUser.includes(user);
  const {email, uid} = getUserData;

  return (
    // {/* <NavigationContainer theme={theme}>
    //   {uid === undefined ? (
    //     <Stack.Navigator
    //       // initialRouteName={uid !== undefined ? 'Home' : 'Login'}
    //       screenOptions={{headerShown: false, animation: 'fade_from_bottom'}}>
    //       <Stack.Group
    //         screenOptions={{
    //           headerStyle: {backgroundColor: 'papayawhip'},
    //         }}>
    //         <Stack.Screen name="Signup" component={SignupScr} />
    //         <Stack.Screen name="Login" component={LoginScr} />
    //       </Stack.Group>
    //     </Stack.Navigator>
    //   ) : (

    //     // <Stack.Group>
    //     //   <Stack.Screen name="Home" component={HomeScreen} />
    //     //   <Stack.Screen name="Chat" component={ChatScreen} />
    //     //   <Stack.Screen name="Chat Detail" component={ChatDetailScreen} />
    //     //   <Stack.Screen name="Settings" component={SettingScreen} />
    //     // </Stack.Group>

    //     // <Stack.Screen name="Bottom Navi" component={HomeScreen} />
    //     <BottomNavi />
    //   )}
    // </NavigationContainer> */}

    <PaperProvider theme={theme}>
      <NavigationContainer
        theme={theme}
        // onReady={() => BootSplash.hide({fade: true})}>
        onReady={() => BootSplash.hide()}>
        <Stack.Navigator
          initialRouteName="loginScreen"
          screenOptions={{headerShown: false, animation: 'fade_from_bottom'}}>
          {uid === undefined ? (
            <Stack.Group>
              <Stack.Screen name="loginScreen" component={LoginStack} />
            </Stack.Group>
          ) : (
            <>
              <Stack.Group>
                <Stack.Screen name="main" component={BottomNavi} />
                <Stack.Screen name="Chat Detail" component={ChatDetailScreen} />
                <Stack.Screen name="Settings" component={SettingScreen} />
              </Stack.Group>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default MainNavigation;
