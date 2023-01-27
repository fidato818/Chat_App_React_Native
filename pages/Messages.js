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
    this.getRooms();
  }

  getRooms = () => {
    const { user } = this.props;
    var currentUserId = user.user && user.user.uid;
    console.log('currentUserId', currentUserId);
    database
      .ref('userRooms/')
      // .orderByChild('currentUserId')
      // .equalTo(currentUserId)
      .on('value', (snapshot) => {
        var newArr = [];
        snapshot.forEach((data) => {
          var childData = data.val();
          console.log('chi', childData);
          newArr.push(childData);
        });
        this.setState({
          roomArr: newArr.filter(
            (e) =>
              e.currentUserId === currentUserId || e.friendId === currentUserId
          ),
        });
      });
  };

  startChat = (e) => {
    const { roomArr } = this.state;
    const { user } = this.props;
    // var currentUserId = user.user && user.user.uid;
    var currentUserId = e.currentUserId;
    var listId = e.friendId;

    var filtData = roomArr.filter(
      (ev) =>
        (ev.currentUserId === currentUserId && listId === ev.friendId) ||
        (ev.friendId === listId && ev.currentUserId === currentUserId)
    );
    // console.log('currentUserId', currentUserId);
    // console.log('filtData', filtData);
    // console.log('e', e);
    var existRoomId = filtData.find((event) => event);
    console.log('existRoomId', existRoomId);
    if (existRoomId === undefined) {
      // this.createRoom(e);
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
    // console.log('currentUserId', currentUserId);
    var friendId = e.friendId;
    var roomId = e.roomId;
    var roomObj = {
      currentUserId,
      friendId,
      friendName: e.displayname || e.fullname,
      roomId,
    };
    // console.log('e', user.user);
    // console.log('roomObj', roomObj);
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
    const { messagesUsers, roomArr } = this.state;
    const { user } = this.props;
    var currentUserId = user.user && user.user.uid;
    console.log('currentUserId', currentUserId);
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
            title="Chat"
          />

          {!this.state.toggleWindow && (
            <Appbar.Action icon="bell" onPress={this._handleSearch} />
          )}
        </Appbar.Header>
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.scrollView}>
            {roomArr.map((e, i) => {
              return e.friendId !== currentUserId ? (
                <View>
                  <Pressable onPress={() => this.startChat(e)}>
                    <Card elevation={3} style={{ margin: 5 }}>
                      <Card.Title
                        title={e.friendName}
                        subtitle={e.email}
                        left={(props) => (
                          <Avatar.Icon {...props} icon="folder" />
                        )}
                      />
                    </Card>
                  </Pressable>
                </View>
              ) : (
                <View>
                  <Pressable onPress={() => this.startChat(e)}>
                    <Card elevation={3} style={{ margin: 5 }}>
                      <Card.Title
                        title={e.currentUserName}
                        subtitle={e.email}
                        left={(props) => (
                          <Avatar.Icon {...props} icon="folder" />
                        )}
                      />
                    </Card>
                  </Pressable>
                </View>
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
