import * as React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  Card,
  IconButton,
  Appbar,
  Provider as PaperProvider,
  Avatar,
} from 'react-native-paper';
import { userData } from '../components/data';
import firebase from '../config/firebase';

import { connect } from 'react-redux';
var database = firebase.database();

class MessagesScreen extends React.Component {
  constructor() {
    super();
    this.state = { messagesUsers: [], roomArr: [] };
  }

  componentDidMount() {
    this.getUsers();
    this.getRooms();
  }

  getRooms = () => {
    database.ref('userRooms').on('value', (snapshot) => {
      var newArr = [];
      snapshot.forEach((data) => {
        var childData = data.val();
        // console.log('chi', childData);
        newArr.push(childData);
      });
      this.setState({
        roomArr: newArr,
      });
    });
  };
  getUsers = () => {
    const { user } = this.props;
    var currentUserId = user.user && user.user.uid;
    console.log(currentUserId);
    database.ref('Users').on('value', (snapshot) => {
      var newArr = [];
      snapshot.forEach((data) => {
        var childData = data.val();
        // console.log('chi', childData);
        newArr.push(childData);
      });
      this.setState({
        messagesUsers: newArr.filter(
          (o) => o.userId !== currentUserId || o.userId !== currentUserId
        ),
      });
    });
  };

  startChat = (e) => {
    const { user } = this.props;
    const { roomArr } = this.state;
    var currentUserId = user.user && user.user.uid;

    var listId = e.uid || e.userId;
    var filtData = roomArr.filter(
      (ev) =>
        (ev.currentUserId === listId && listId === ev.currentUserId) ||
        (ev.friendId === listId && ev.currentUserId === currentUserId)
    );
    // console.log('currentUserId', currentUserId);
    // console.log('listId', listId);
    // console.log('filtData', filtData);
    var existRoomId = filtData.find((event) => event);

    if (existRoomId === undefined) {
      this.createRoom(e);
      // console.log('asd', e, currentUserId);
    } else {
      this.props.navigation.navigate('Messages Detail', {
        userData: e,
        currenUserId: currentUserId,
        roomId: existRoomId.roomId,
      });
    }
  };
  createRoom = (e) => {
    const { user } = this.props;
    var currentUserId = user.user && user.user.uid;
    var currentUserName = user.user && user.user.displayName;
    console.log(user.user);
    var roomId = firebase.database().ref().child('userRooms').push().key;
    var roomObj = {
      currentUserId,
      friendId: e.uid || e.userId,
      friendName: e.displayname || e.fullname,
      roomId,
      currentUserName,
    };
    console.log('roomObj', roomObj);
    database
      .ref('userRooms/' + roomId)
      .set(roomObj)
      .then((success) => {
        console.log('success');
        this.props.navigation.navigate('Messages Detail', {
          userData: e,
          currenUserId: currentUserId,
          roomId,
        });
      })
      .catch((e) => {
        console.log('Error: ', e);
      });
  };

  render() {
    const { messagesUsers } = this.state;

    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.appB}>
          <IconButton
            color="white"
            icon={require('../assets/snack-icon.png')}
            onPress={() => this.props.navigation.openDrawer()}
          />
          <Appbar.Content
            style={{
              alignItems: 'center',
            }}
            title="Contacts"
          />

          {!this.state.toggleWindow && (
            <Appbar.Action icon="bell" onPress={this._handleSearch} />
          )}
        </Appbar.Header>
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.scrollView}>
            {messagesUsers.map((e, i) => {
              return (
                <Pressable onPress={() => this.startChat(e)}>
                  <Card elevation={3} style={{ margin: 5 }}>
                    <Card.Title
                      title={e.displayname || e.fullname}
                      subtitle={e.email}
                      left={(props) => <Avatar.Icon {...props} icon="folder" />}
                    />
                  </Card>
                </Pressable>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(MessagesScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },

  appB: {
    backgroundColor: 'teal',
    color: 'white',
    fontWeight: '200',
    fontFamily: 'Comfortaa-Regular',
  },
});
