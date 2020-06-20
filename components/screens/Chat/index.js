import React from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  AppFontLoader,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import {
  Provider as PaperProvider,
  Button,
  Card,
  Avatar,
  Title,
  Paragraph,
  Appbar,
  IconButton,
} from 'react-native-paper';
import firebase from '../../config/Firebase';

var currentUserKey = '';
var chatKey = '';
var friend_id = '';
export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      arr: [],
      userArr: [],
      chatExists: false,
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: navigation.state.routeName,
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
    this.readUserData();
    this.getFriendData();
  }

  readUserData() {
    var currentId = firebase.auth().currentUser.uid;
    // console.log(currentId);
    firebase
      .database()
      .ref('Users/')
      .on('value', (dataSnapshot) => {
        var tasks = [];
        dataSnapshot.forEach((child) => {
          // console.log(child);
          if (currentId === child.val().userId) {
            // if (child.val().userId) {
            // console.log('success');
          } else { 
            tasks.push({
              username: child.val().username,
              email: child.val().email,
              password: child.val().password,
              userId: child.val().userId,
            });
          }
        });

        this.setState({
          arr: tasks,
        });
      });
  }

  getFriendData = () => {
    this.firebaseRef = firebase.database().ref('friendsList');
    this.firebaseRef.on('value', (snapshot) => {
      var newArr = [];
      snapshot.forEach((data) => {
        var users = data.val();
        // console.log('users.currentUserId', users);
        //     // console.log(newArr);
        newArr.push(users);
        //     // newArr.push({
        //     //   currentUserId: users.currentUserId,
        //     //   friendId: users.friendId,
        //     //   newPostKey: users.newPostKey,
      });
      this.setState({
        userArr: newArr,
      });
    });
    //   for (var key in users) {
    //   console.log('users[key]', users[key].friendId);
    //     newArr.push({
    //       currentUserId: users[key].currentUserId,
    //       friendId: users[key].friendId,
    //     });
    //   }

    // });
    // this.firebaseRef = firebase.database().ref('friendsList');
    // this.firebaseRef.on('value', (snapshot) => {
    //   let message = snapshot.val();
    //   // console.log(message);
    //   var newArr = [];
    //   for (let word in message) {
    //     // console.log(message[word]);
    //     newArr.push({
    //       currentUserId: message[word].currentUserId,
    //       friendId: message[word].friendId,
    //       newPostKey: message[word].newPostKey,
    // });
    // }

    // this.setState({ userArr: newArr });
    // });
  };

  createRoom = (friendKey, friendName) => {
    var newPostKey = firebase.database().ref().child('friendsList').push().key;
    const { userArr, chatExists } = this.state;
    const currentUserId = firebase.auth().currentUser.uid;
    var friendList = { friendId: friendKey, userId: currentUserId };
    friend_id = friendKey;
    var flag = false;
    this.firebaseRef = firebase.database().ref('friendsList');
    this.firebaseRef.on('value', (snapshot) => {
      var newArr = [];
      snapshot.forEach((data) => {
        var users = data.val();
        if (
          (users.friendId === friendList.friendId &&
            users.userId === friendList.userId) ||
          (users.friendId === friendList.userId &&
            users.userId === friendList.friendId)
        ) {
          flag = true;
          chatKey = data.key;
          // console.log('user Exists', data.key);
        }
      });
    }); 
    if (flag === false) {
      chatKey = firebase
        .database()
        .ref('friendsList')
        .push(friendList, function (error) {
          if (error) alert(error);
          else {
            this.props.navigation.navigate('TextMessages', {
              chatKey: chatKey,
              friendId: friendKey,
              friendName: friendName,
            });
          }
        })
        .getKey();
    } else {
      console.log('');
      this.props.navigation.navigate('TextMessages', {
        chatKey: chatKey,
        friendId: friendKey,
        friendName: friendName,
      });
    }

    // let friendIdExists = userArr.find(
    //   (o) => o.friendId === friendId || o.currentUserId === friendId
    // );
    // let currentIdExists = userArr.find(
    //   (o) => o.currentUserId === currentUserId || o.friendId === currentUserId
    // );
    // let friendIdExists = userArr.map((o) => o.friendId === friendId);
    // let currentIdExists = userArr.map((o) => o.currentUserId === currentUserId);
    // let friendIdExists1 = userArr.map((o) => o.friendId === currentUserId);
    // let currentIdExists1 = userArr.map((o) => o.currentUserId === friendId);

    // let friendIdExists =
    //   userArr.find((o) => o.friendId === friendId);
    // let currentIdExists =
    //  userArr.find((o) => o.currentUserId === currentUserId);

    // console.log(friendIdExists);
    // console.log(currentIdExists);
    // if (friendIdExists === true && currentUserId === true) {
    //   console.log('asd');
    // } else {
    //   console.log('Qew');
    // }
    // firebase
    //   .database()
    //   .ref('friendsList/' + newPostKey)
    //   .set(friendObj)
    //   .then(() => {
    //     console.log('saved');
    //   });
    // if (
    //   (friendIdExists.friendId === friendId &&
    //     currentIdExists.currentUserId === currentUserId) ||
    //   (friendIdExists.friendId === currentUserId &&
    //     currentIdExists.currentUserId === friendId)
    // ) {
    //   this.setState({
    //     chatExists: true,
    //   });
    //   console.log('user is already exist');
    // }
    //  else {
    //   console.log('user is not exist');
    // }
    // else if (chatExists === false) {
    // firebase
    //   .database()
    //   .ref('friendsList/' + newPostKey)
    //   .set(friendObj)
    //   .then(() => {
    //     console.log('new User add with friends');
    //   })
    //   .catch((error) => {
    //     Alert.alert(error);
    //   });

    // .getKey();
    // }

    // console.log(id);
    // console.log(friendName);
  };

  render() {
    const { arr } = this.state;

    // var x = 'some string';
    // alert(x.charAt(0)); // alerts 's'
    return (
      <PaperProvider>
        <ScrollView>
          {/*  <Text style={styles.container}>Chat Screen</Text> */}
          {arr.map((e) => {
            // console.log(e.userId);
            return (
              <Card
                onPress={() => {
                  this.createRoom(e.userId, e.username);
                }}>
                <Card.Title
                  // key={e._key}
                  title={e.username}
                  subtitle={e.email}
                  left={(props) => (
                    <Avatar.Text
                      {...props}
                      label={e.username.substring(0, 2).toUpperCase()}
                      size={36}
                    />
                  )}
                  right={(props) => (
                    <IconButton
                      {...props}
                      icon="more-vert"

                      // onPress={() => {
                      //   this.createRoom(e._key);
                      // }}
                    />
                  )}
                />
              </Card>
            );
          })}
        </ScrollView>
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
