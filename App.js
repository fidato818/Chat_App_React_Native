import { StatusBar } from 'react-native';
import AppNavigator from './config/navigations';
import { store, persistor } from './store/index';
import { Provider as StoreProvider } from 'react-redux';
// import { styles } from './components/screens/styles';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { enableScreens } from 'react-native-screens';

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
