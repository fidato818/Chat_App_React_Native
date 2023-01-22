import React, { Component } from 'react';

import {
  ScrollView,
  Switch,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { remove_user_Customer } from '../store/actions';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../config/firebase';
var database = firebase.database();
import {
  List,
  Avatar,
  Divider,
  Appbar,
  Provider as PaperProvider,
  Subheading,
} from 'react-native-paper';
import PropTypes from 'prop-types';
class Contact extends Component {
  state = {
    pushNotifications: true,
  };

  componentDidMount() {
    this.getCurrentUserDetail();
  }
  getCurrentUserDetail = () => {
    const { user } = this.props;
    const currentUserId = user.user && user.user.uid;

    database.ref('Users/' + currentUserId).on('value', (snapshot) => {
      var childData = snapshot.val();

      const { email, createAt, fullName, displayname } = childData;
      this.setState({
        email,
        createAt,
        fullName,
        displayname,
      });
    });
  };
  onPressSetting = () => {
    this.props.navigation.navigate('Options');
  };

  onChangePushNotifications = () => {
    this.setState((state) => ({
      pushNotifications: !state.pushNotifications,
    }));
  };

  logoutApp = async () => {
    try {
      // const posts = await AsyncStorage.removeItem('userToken');
      // let postsFav = JSON.parse(posts);

      firebase
        .auth()
        .signOut()
        .then(() => {
          this.props.logout_user();
          this.props.navigation.navigate('Login');
        });

      // this.props.navigation.navigate('Login');
      // BackHandler.exitApp();
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };
  render() {
    const { user } = this.props;
    const { email, createAt } = this.state;

    return (
      <PaperProvider>
        <Appbar.Header
          style={{
            backgroundColor: 'teal',
            color: 'white',
            fontWeight: '200',
            fontFamily: 'Comfortaa-Regular',
          }}>
          <Appbar.Action
            icon="menu"
            onPress={() => this.props.navigation.openDrawer()}
          />
          <Appbar.Content title="Profile" />
        </Appbar.Header>
        <ScrollView style={styles.scroll}>
          <View style={styles.userRow}>
            <View style={styles.userImage}>
              <TouchableOpacity
                style={styles.btnSend}
                onPress={() => this.logoutApp()}>
                <Avatar.Image
                  size={50}
                  source={require('../assets/adaptive-icon.png')}
                />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={{ fontSize: 16 }}>Let's Chat</Text>
              <Text
                style={{
                  color: 'gray',
                  fontSize: 16,
                }}>
                {email}
              </Text>
            </View>
          </View>
          <View style={{ backgroundColor: 'grey' }}>
            <Subheading style={{ marginLeft: 10, color: 'white' }}>
              Account
            </Subheading>
          </View>
          <View>
            <List.Item
              title="Push Notifications"
              left={(props) => <List.Icon {...props} icon="bell-ring" />}
              right={(props) => (
                <Switch
                  value={this.state.pushNotifications}
                  onValueChange={this.onChangePushNotifications}
                />
              )}
              onPress={() => this.onPressSetting()}
            />
            <Divider />
            <List.Item
              title="Currency"
              description="USD"
              left={(props) => <List.Icon {...props} icon="currency-usd" />}
              right={(props) => <List.Icon {...props} icon="arrow-right" />}
              onPress={() => this.onPressSetting()}
            />
            <Divider />
            <List.Item
              title="Location"
              description="New York"
              left={(props) => <List.Icon {...props} icon="map-marker" />}
              right={(props) => <List.Icon {...props} icon="arrow-right" />}
              onPress={() => this.onPressSetting()}
            />
            <Divider />
            <List.Item
              title="Language"
              description="English"
              left={(props) => <List.Icon {...props} icon="google-earth" />}
              right={(props) => <List.Icon {...props} icon="arrow-right" />}
              onPress={() => this.onPressSetting()}
            />
          </View>
          <View style={{ backgroundColor: 'grey' }}>
            <Subheading style={{ marginLeft: 10, color: 'white' }}>
              More
            </Subheading>
          </View>
          <View>
            <List.Item
              title="About US"
              left={(props) => (
                <List.Icon {...props} icon="information-variant" />
              )}
              right={(props) => <List.Icon {...props} icon="arrow-right" />}
              onPress={() => this.onPressSetting()}
            />
            <Divider />
            <List.Item
              title="Terms and Policies"
              left={(props) => (
                <List.Icon {...props} icon="lightbulb-outline" />
              )}
              right={(props) => <List.Icon {...props} icon="arrow-right" />}
              onPress={() => this.onPressSetting()}
            />
            <Divider />
            <List.Item
              title="Share our App"
              left={(props) => <List.Icon {...props} icon="share-variant" />}
              right={(props) => <List.Icon {...props} icon="arrow-right" />}
              onPress={() => this.onPressSetting()}
            />
            <Divider />
            <List.Item
              title="Rate Us"
              left={(props) => (
                <List.Icon {...props} icon="star-circle-outline" />
              )}
              right={(props) => <List.Icon {...props} icon="arrow-right" />}
              onPress={() => this.onPressSetting()}
            />
            <Divider />
            <List.Item
              title="Send FeedBack"
              left={(props) => <List.Icon {...props} icon="email-newsletter" />}
              right={(props) => <List.Icon {...props} icon="arrow-right" />}
              onPress={() => this.onPressSetting()}
            />
          </View>
          <StatusBar style="light" />
        </ScrollView>
      </PaperProvider>
    );
  }  
}
const mapDispatchToProps = (dispatch) => {
  return {
    logout_user: () => dispatch(remove_user_Customer()),
  };
};
const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(Contact);

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: 'white',
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
  },
  userImage: {
    marginRight: 12, 
  },
  // listItemContainer: {
  //   height: 55,
  //   borderWidth: 0.5,
  //   borderColor: '#ECECEC',
  // },
});
