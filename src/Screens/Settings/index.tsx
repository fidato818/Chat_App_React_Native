import React from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {
  useTheme,
  Appbar,
  DefaultTheme,
  Avatar,
  Card,
  IconButton,
} from 'react-native-paper';
import {toggleOff, toggleOn} from '../../Store/userReducers';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useAppSelector} from '../../Store/hooks';
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};
const SettingScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const themeSelector = useAppSelector((state: any) => state.isThemeDark);
  const dispatch = useDispatch();

  const togglTheme = () => {
    if (themeSelector == true) {
      dispatch(toggleOff());
    } else {
      dispatch(toggleOn());
    }
  };
  return (
    <View
      style={
        {
          // flex: 1,
          // alignItems: 'center',
          // justifyContent: 'center',
          // backgroundColor: 'skyblue',
        }
      }>
      <Appbar.Header

      // theme={{
      //   colors: {
      //     primary: theme?.colors.primary,
      //   },
      // }}
      >
        <Appbar.Content tvParallaxProperties title="Setting" />
      </Appbar.Header>

      <View style={{margin: 10}}>
        <Card style={{marginTop: 10}}>
          <Card.Title
            title="Setting"
            // subtitle="Card Subtitle"

            right={props => (
              <TouchableOpacity onPress={() => togglTheme()}>
                <Switch
                  // trackColor={{false: '#767577', true: '#81b0ff'}}
                  // thumbColor={themeSelector ? '#f5dd4b' : '#f4f3f4'}
                  // ios_backgroundColor="#3e3e3e"
                  onValueChange={() => togglTheme()}
                  value={themeSelector}
                />
              </TouchableOpacity>
            )}
          />
        </Card>
      </View>
    </View>
  );
};

export default SettingScreen;
