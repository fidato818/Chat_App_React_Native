import React, { Component } from 'react';
import {
  Platform,
  View,
  Alert,
  KeyboardAvoidingView,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Button,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  HeaderBackButton,
} from 'react-native';
import moment from 'moment';
import {
  Avatar,
  Card,
  Title,
  Paragraph,
  FAB,
  Portal,
  Provider,
  Constants,
  Snackbar,
} from 'react-native-paper';
// import { GiftedChat } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebase from '../../config/Firebase';
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
    // console.log(navigation.state.params);
    return {
      headerRight: (
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={{
            left: Dimensions.get('window').height < 667 ? '15%' : '3%',
            // backgroundColor: 'red',
            // width: '100%',
            marginRight: 30,
          }}>
          <Image
            style={{ width: 30, height: 30 }}
            source={require('../../../assets/icons/icons8-export-24.png')}
          />
        </TouchableOpacity>
      ),
      headerTitle: navigation.state.params.friendName,
      headerStyle: {
        backgroundColor: 'teal',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };
  };
  componentDidMount() {
    this.getmessages();
    console.log(this.props.navigation.state.params);
  }

  getmessages = () => {
    var chatKey = this.props.navigation.state.params.chatKey;
    this.firebaseRef = firebase.database().ref('chatMessages').child(chatKey);
    this.firebaseRef.on('value', (snapshot) => {
      var messageDisplay = '';
      var newArr = [];
      snapshot.forEach((data) => {
        var chat = data.val();
        var dateTime = chat.dateTime.split(',');
        var msg = '';
        console.log('Chat', chat);
        newArr.push(chat);
        console.log('Success: ', newArr);
      });
      this.setState({
        messagesData: newArr,
      });
    });
  };

  onSendMessage = () => {
    var chatKey = this.props.navigation.state.params.chatKey;
    var friendId = this.props.navigation.state.params.friendId;
    const { text, message } = this.state;
    console.log('text', message);
    var userId = firebase.auth().currentUser.uid;
    // var useremail = firebase.auth().currentUser.email;
    // // console.log(useremail)
    // var userfriendId = ' this.props.navigation.state.params.friendId';
    // var database = firebase.database();
    // console.log('userId', userId);
    // // console.log('userfriendId', userfriendId);
    // if (userId === null || userId === undefined) {
    //   Alert.alert('login user not defined');
    // } else {
    //   database
    //     .ref('Messages/' + userfriendId)
    //     .push({
    //       userfriendId,
    //       userId,
    //       text,
    //       createdAt: new Date().toLocaleTimeString(),
    //     })
    //     .then((success) => {
    //       // this.props.navigation.setParams({ username: useremail });
    //       console.log('Success: ', success);
    //       alert('success');
    //     })
    //     .catch((error) => {
    //       console.log(`${error}`);
    //     });
    // }
    var chatMessage = {
      userId: userId,
      friendId: friendId,
      msg: message,
      msgType: 'normal',
      dateTime: new Date().toLocaleString(),
    };

    firebase
      .database()
      .ref('chatMessages')
      .child(chatKey)
      .push(chatMessage, function (error) {
        if (error) alert(error);
      });
  };

  render() {
    const { messagesData } = this.state;
    var userfriendId = 'this.props.navigation.state.params.friendId';
    var currentId = firebase.auth().currentUser.uid;
    // console.log('messagesData', messagesData);
    // const keyboardVerticalOffset = Platform.OS === 'android' ? 85 : 0;
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <ScrollView>
            {messagesData.map((e) => {
              console.log('e', e);
              return (
                <View>
                  {e.userId !== currentId ? (
                    <View>
                      <Text
                        style={{
                          textAlign: 'left',
                          color: 'black',
                          padding: 8,
                          backgroundColor: 'yellow',
                          marginTop: 10,
                        }}>
                        {e.msg}
                        {'\n'}
                        {moment(e.dateTime || moment.now()).fromNow()}
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <Text 
                        style={{
                          textAlign: 'right',
                          color: 'white',
                          padding: 8,
                          backgroundColor: 'grey',
                          marginTop: 10,
                        }}>
                        {e.msg}
                        {'\n'}
                        {moment(e.dateTime || moment.now()).fromNow()}
                      </Text>
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
              <Button onPress={() => this.onSendMessage()} title="SEND" />
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
    height: 37,
    width: '84%',
    borderColor: 'rgb(86, 117, 114)',
    marginRight: 2,
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
