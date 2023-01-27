import { useState, useEffect } from 'react';
import { StatusBar, AppState } from 'react-native';
import AppNavigator from './config/navigations';
import { store, persistor } from './store/index';
import { Provider as StoreProvider } from 'react-redux';
// import { styles } from './components/screens/styles';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { enableScreens } from 'react-native-screens';
import SplashScreen from './pages/Splash';
enableScreens();
console.disableYellowBox = true;
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#607D8B',
    accent: '#f1c40f',
  },
};
const App = () => {
  const [outOfApp, setOutOfApp] = useState(true);
  const appStateChangeListener = (val) => {
    if (val == 'active') {
      //val will be "active" only when app is in foreground
      // use navigation to navigate to Splashscreen
      console.log('Out');
      setOutOfApp(false);
    } else {
      console.log('in');
      setOutOfApp(true);
    }
  };
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      appStateChangeListener
    );

    return () => {
      AppState.removeEventListener('change', appStateChangeListener);
    };
  }, []);
  if (outOfApp) {
    return <SplashScreen />;
  } else
  return (
    <PaperProvider theme={theme}>
      <StoreProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppNavigator />
        </PersistGate>
      </StoreProvider>
      <StatusBar
        hidden={false}
        translucent={true}
        // backgroundColor={styles.headerColor}
        barStyle="light-content"
      />
    </PaperProvider>
  );
};
export default App;
