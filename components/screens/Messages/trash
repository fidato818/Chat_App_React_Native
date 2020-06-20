import React, { Component } from 'react';
import { Platform, View, Alert } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import firebase from '../../config/firebase';
export default class TextMessages extends Component {
  state = {
    messages: [],
  };

  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || 'Chat!',
  });

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        },
      ],
    });
  }

  componentDidMount() {
    console.log('this.props', this.props.navigation.state.params);
  }

  onSend = (message, messages, friendId) => {
    var userId = firebase.auth().currentUser.uid;
    var useremail = firebase.auth().currentUser.email;
    // console.log(useremail)
    var userfriendId = this.props.navigation.state.params.friendId;
    var database = firebase.database();
    console.log('userId', userId);
    console.log('userfriendId', userfriendId);
    if (userId === null || userId === undefined) {
      Alert.alert('login user not defined');
    } else {
      database
        .ref('Messages/' + userfriendId)
        .set({
          _id: userfriendId,
          text: message,
          createdAt: new Date(),
          user: { 
            _id: userId,
            name: useremail,
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        })
        .then(success => {
          console.log('Success: ', success);
        })
        .catch(error => {
          console.log(`${error}`);
        });
    }
  };

  // onSend(messages = []) {
  //   this.setState(previousState => ({
  //     messages: GiftedChat.append(previousState.messages, messages),
  //   }));
  // }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          // user={{
          //   _id: 1,
          // }}
        />
        {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
      </View>
    );
  }
}
