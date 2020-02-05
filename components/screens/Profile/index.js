import React from 'react';

import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

import {
  Provider as PaperProvider,
  Button,
  Card,
  Avatar,
  Title,
  Paragraph,
  IconButton,
  Divider,
} from 'react-native-paper';
import { Ionicons, Feather } from '@expo/vector-icons';
import firebase from '../../config/firebase';

export default class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      name: 'Adnan Ahmed',
      user: '',
      email: '',
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('user changed..', user.email);
        this.setState({
          user: user.username,
          email: user.email,
        });
      }
    });
  }

  logOutUser() {
    firebase.auth().signOut();
    this.props.navigation.navigate('Login');
  }
  render() {
    const { name, username, email } = this.state;
    console.log(username);
    console.log(this.props);
    return (
      <PaperProvider>
        <Card.Title
          title={email ? email : 'Adnan Ahmed'}
          left={props => <Avatar.Text {...props} label="AD" size={36} />}
          right={props => (
            <Button
              icon={require('../../../assets/icons/icons8-export-24.png')}
              onPress={() => {
                this.logOutUser();
              }}
            />
          )}
        />
        <Divider />
      </PaperProvider>
    );
  }
}
const styles = StyleSheet.create({
  // container: {
  //   alignItems: 'center',
  //   backgroundColor: '#ecf0f1',
  // },
});
