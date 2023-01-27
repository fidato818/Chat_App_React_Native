import React, { Component, useEffect, useState } from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { Avatar, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import { remove_user_Customer } from '../store/actions';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
  StatusBar,
  Constants,
  TouchableNativeFeedback,
  // ColorPalette,
  // Avatar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Drawer } from 'react-native-paper';

class CustomDrawerContentComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { fullname: '', email: '', active: '' };
  }

  componentDidMount() {}

  logoutApp = async () => {};

 
  render() {
    const { theme, user } = this.props;
    const { email, emailVerified, photoURL, fullname, displayName } =
      this.state;
   
    var currentUser = user && user.user.uid;
    var currentUserName = user && user.user.displayName;
    var currentUserImage = user && user.user.photoURL;
    // console.log('currentUser', user && user.user.displayName);
    // console.log('Drawer currentUser', user.user);
    // const ripple = TouchableNativeFeedback.Ripple('#adacac', false);
    var str = email && currentUserName;
    // console.log(str.charAt(0));
    // console.log(x.substring(0, 1));
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <SafeAreaView
            style={styles.container}
            forceInset={{ top: 'always', horizontal: 'never' }}>
            <View style={[styles.containHeader, { backgroundColor: '' }]}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                {/*
                <Avatar
                  size="large"
                  rounded
                  icon={{
                    name: 'user-circle-o',
                    type: 'font-awesome',
                    size: 80,
                  }} 
                />
                */}
                {currentUser ? (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    {currentUserImage ? (
                      <Avatar.Image
                        style={{ marginTop: 35 }}
                        size={80}
                        // source={require('../../assets/snack-icon.png')}
                        source={{
                          uri: currentUserImage,
                        }}
                      />
                    ) : (
                      <Avatar.Text
                        style={{
                          backgroundColor: '#C7D3D4FF',
                          marginTop: 35,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        size={80}
                        label={str && str.charAt(0)}
                      />
                    )}
                    <Text
                      style={{
                        color: '#f9f9f9',
                        marginTop: '3%',
                        // fontFamily: 'sans-serif-condensed',
                      }}>
                      {currentUserName}
                    </Text>
                    <Text
                      style={{
                        color: '#f9f9f9',
                        // fontFamily: 'sans-serif-condensed',
                      }}>
                      {email}
                    </Text>
                  </View>
                ) : (
                  <Text style={{ marginTop: 130 }} />
                )}
              </View>
            </View>

            {currentUser ? (
              /*  <DrawerItems {...this.props} />*/
              <Drawer.Section>
                <Drawer.Item
                  icon="home"
                  label="Home"
                  // style={{ backgroundColor: '#C7D3D4FF', color: '#603F83FF' }}
                  style={
                    this.state.active === 'Home'
                      ? styles.activeColor
                      : styles.inactiveColor
                  }
                  active={this.state.active === 'Home'}
                  // onPress={() => this.props.navigation.navigate('Home')}
                  onPress={() =>
                    this.setState({ active: 'Home' }, () =>
                      this.props.navigation.navigate('Home')
                    )
                  }
                />
                <Drawer.Item
                  icon="heart"
                  label="Favourites"
                  style={
                    this.state.active === 'Favourites'
                      ? styles.activeColor
                      : styles.inactiveColor
                  }
                  // active={this.state.active === 'Favourites'}
                  // onPress={() => this.props.navigation.navigate('Favourites')}
                  onPress={() =>
                    this.setState({ active: 'Favourites' }, () =>
                      this.props.navigation.navigate('Favourites')
                    )
                  }
                />

                <Drawer.Item
                  icon="order-bool-descending"
                  label="My Orders"
                  style={
                    this.state.active === 'My Orders'
                      ? styles.activeColor
                      : styles.inactiveColor
                  }
                  // active={this.state.active === 'My Orders'}
                  // onPress={() => this.props.navigation.navigate('Favourites')}
                  onPress={() =>
                    this.setState({ active: 'My Orders' }, () =>
                      this.props.navigation.navigate('My Orders')
                    )
                  }
                />
                <Drawer.Item
                  icon="home-city"
                  label="My Addresses"
                  style={
                    this.state.active === 'My Addresses'
                      ? styles.activeColor
                      : styles.inactiveColor
                  }
                  // active={this.state.active === 'My Addresses'}
                  // onPress={() => this.props.navigation.navigate('Favourites')}
                  onPress={
                    () =>
                      // this.setState({ active: 'My Addresses' }, () =>
                      this.props.navigation.navigate('Address', {
                        toggleHandler: false,
                      })
                    // )
                  }
                />
                <Drawer.Item
                  // icon="account-circle"
                  icon="tools"
                  label="Settings"
                  style={
                    this.state.active === 'My Profile'
                      ? styles.activeColor
                      : styles.inactiveColor
                  }
                  // active={this.state.active === 'My Profile'}
                  // onPress={() => this.props.navigation.navigate('Favourites')}
                  onPress={() =>
                    this.setState({ active: 'My Profile' }, () =>
                      this.props.navigation.navigate('My Profile')
                    )
                  }
                />

                {/*
                <Drawer.Item
                  icon="information-outline"
                  label="About"
                  style={
                    this.state.active === 'About'
                      ? styles.activeColor
                      : styles.inactiveColor
                  }
                  // active={this.state.active === 'About'}
                  // onPress={() => this.props.navigation.navigate('Favourites')}
                  onPress={() =>
                    this.setState({ active: 'About' }, () =>
                      this.props.navigation.navigate('About')
                    )
                  }
                />
                */}
              </Drawer.Section>
            ) : (
              <Drawer.Item
                // style={{ backgroundColor: '#64ffda' }}
                icon="login"
                label="Login"
                onPress={() => this.props.navigation.navigate('Login')}
              />
            )}

            {currentUser ? (
              <View>
                <View style={{ marginTop: '5%' }}>
                  <Divider style={{ backgroundColor: '#777f7c90' }} />
                </View>
              </View>
            ) : (
              <Text />
            )}
          </SafeAreaView>
        </ScrollView>

        {currentUser ? (
          <View elevation={6} style={{ backgroundColor: '#ffffff' }}>
            <TouchableNativeFeedback onPress={() => this.logoutApp()}>
              <View style={styles.containDrawerOption}>
                <Icon
                  name="logout"
                  type="simple-line-icon"
                  size={20}
                  color="red"
                  containerStyle={{ marginRight: '10%' }}
                />
                <Text
                  style={{ color: 'black', fontFamily: 'sans-serif-medium' }}>
                  Logout
                </Text>
              </View>
            </TouchableNativeFeedback>

            {/*   
         <TouchableNativeFeedback>
            <View style={styles.containDrawerOption}>
              <Icon
                name="user-secret"
                type="font-awesome"
                size={24}
                color="red"
                containerStyle={{ marginRight: '10%' }}
              />
              <Text style={{ color: 'black', fontFamily: 'sans-serif-medium' }}>
                Developer
              </Text>
            </View>
          </TouchableNativeFeedback>
           */}
          </View>
        ) : (
          <Text />
        )}
      </View>
    );
  }
}

export default CustomDrawerContentComponent;
const styles = StyleSheet.create({
  containDrawerOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  // paragraph: {
  //   margin: 24,
  //   marginTop: 0,
  //   fontSize: 35,
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  // },
  // logo: {
  //   height: 128,
  //   width: 128,
  // },
  activeColor: {
    // activeTintColor: '#603F83FF',
    // activeBackgroundColor: '#C7D3D4FF',
  },
  inactiveColor: {
    // inactiveTintColor: 'black',
    // inactiveBackgroundColor: 'transparent',
  },
});
