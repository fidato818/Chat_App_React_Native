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
      <View style={styles.container}>
        <SafeAreaView>
          <ScrollView>
            {messagesData.map((e) => {
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
          </ScrollView>
          <KeyboardAwareScrollView
            // style={{ left: 0, right: 0, bottom: 0 }}
            resetScrollToCoords={{ x: 0, y: 0 }}
            // contentContainerStyle={styles.container}
            scrollEnabled={false}>
            <View style={styles.bottomView}>
              <TextInput
                style={styles.textInputStyle}
                onChangeText={(text) => this.setState({ message: text })}
                // value={this.state.email}
                placeholderTextColor="black"
                placeholder="Message Here"
                underlineColorAndroid="transparent"
              />
              <Button onPress={() => this.onSend()} title="SEND" />
            </View>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 3,
    justifyContent: 'flex-end', //use flex-start, flex-end ,center to adjust vertical position
    // alignItems: 'center', //use flex-start, flex-end ,center to adjust horizontal position
    // backgroundColor: '#83bec4',
  },
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
    // width: '100%',
    flex: 1,
    height: 50,
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    // position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
  },
  textInputStyle: {
    height: 40,
    width: '84%',
    borderColor: 'rgb(86, 117, 114)',
    borderWidth: 2,
    padding: 12,
    borderRadius: 5,
    fontFamily: 'quicksand-Regular',

    // borderStartWidth: 2,
    // borderEndWidth: 3,
    // borderTopWidth: 1,
    // boderLeftWidth: 2,
    // borderRightWidth: 3,
    // borderBottomWidth: 4,
  },
});
