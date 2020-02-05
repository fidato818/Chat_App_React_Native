import React, { Component } from 'react';
import {
  Platform,
  View,
  Alert,
  KeyboardAvoidingView,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import {
  Avatar,
  Card,
  Title,
  Paragraph,
  TextInput,
  FAB,
  Portal,
  Button,
  Provider,
  SafeAreaView,
  ScrollView,
  Constants,
  Snackbar,
} from 'react-native-paper';
import { GiftedChat } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import firebase from '../../config/firebase';
export default class TextMessages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userfriendId: '',
      userId: '',
      text: '',
      createdAt: '',
      messagesData: [],
    };
  }

  // static navigationOptions = ({ navigation }) => {
  //   console.log(navigation.state);
  // };

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('friendName'),
    };
  };
  componentDidMount() {
    this.getmessages();
  }

  getmessages = () => {
    var userfriendId = this.props.navigation.state.params.friendId;
    this.firebaseRef = firebase.database().ref('Messages');
    this.firebaseRef.on('value', snapshot => {
      let message = snapshot.val();
      console.log('message', message);
      console.log('userfriendId', userfriendId);

      var newArr = [];

      for (let word in message) {
        for (let word2 in message[word]) {
          console.log(message[word][word2].userfriendId);
          newArr.push({
            userfriendId: message[word][word2].userfriendId,
            userId: message[word][word2].userId,
            text: message[word][word2].text,
            createdAt: message[word][word2].createdAt,
          });
        }
      }

      this.setState({ messagesData: newArr });
    });
  };

  onSend = (message, friendId) => {
    const { text } = this.state;
    var userId = firebase.auth().currentUser.uid;
    var useremail = firebase.auth().currentUser.email;
    // console.log(useremail)
    var userfriendId = this.props.navigation.state.params.friendId;
    var database = firebase.database();
    console.log('userId', userId);
    // console.log('userfriendId', userfriendId);
    if (userId === null || userId === undefined) {
      Alert.alert('login user not defined');
    } else {
      database
        .ref('Messages/' + userfriendId)
        .push({
          userfriendId,
          userId,
          text,
          createdAt: new Date().toLocaleTimeString(),
        })
        .then(success => {
          // this.props.navigation.setParams({ username: useremail });
          console.log('Success: ', success);
          alert('success');
        })
        .catch(error => {
          console.log(`${error}`);
        });
    }
  };

  render() {
    const { messagesData } = this.state;
    var userfriendId = this.props.navigation.state.params.friendId;
    console.log('messagesData', messagesData);
    const keyboardVerticalOffset = Platform.OS === 'android' ? 85 : 0;
    return (
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="position"
          keyboardVerticalOffset={keyboardVerticalOffset}
          enabled>
          {messagesData.map(e => {
            return (
              <View>
                {userfriendId === e.userfriendId ? (
                  <View>
                    <Text
                      style={{
                        textAlign: 'right',
                        color: 'white',
                        padding: 8,
                        backgroundColor: 'grey',
                        marginTop: 10,
                      }}>
                      {e.text}
                    </Text>
                  </View>
                ) : (
                  <View>
                    <Text> </Text>
                  </View>
                )}
              </View>
            );
          })}
          <View style={styles.bottomView}>
            <TextInput
              style={styles.textStyle}
              // keyboardType='numeric'
              // secureTextEntry
              label="Type Here"
              type="text"
              value={this.state.text}
              onChangeText={text => this.setState({ text })}
            />
            <Button
              icon="camera"
              mode="contained"
              onPress={() => this.onSend()}>
              Press me
            </Button>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // backgroundImage: {
  //   flex: 1,
  //   width: null,
  //   height: null,
  //   resizeMode: 'cover',
  // },
  // bottom: {
  //   // justifyContent: 'flex-end',
  //   marginBottom: 20,
  // },
  bottomView: {
    width: '100%',
    // height:  50,
    justifyContent: 'flex-end',
    // justifyContent: 'center',
    // alignItems: 'center',

    bottom: 0,
    marginTop: 10,
  },
  textStyle: {
    fontFamily: 'ubuntu-regular',
    fontSize: 16,
    color: 'black',
  },
});
