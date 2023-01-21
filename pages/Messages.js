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
const currentUserId = '3Pr93tx52WWwqutRw8nVzkoF8aw2';
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
    database.ref('Users').on('value', (snapshot) => {
      var newArr = [];
      snapshot.forEach((data) => {
        var childData = data.val();
        // console.log('chi', childData);
        newArr.push(childData);
      });
      this.setState({
        messagesUsers: newArr,
      });
    });
  };

  startChat = (e) => {
    const { roomArr } = this.state;
    // this.getRooms();
    var listId = e.uid || e.userId;
    var filtData = roomArr.filter(
      (ev) =>
        (ev.currentUserId === currentUserId && listId === ev.friendId) ||
        (ev.friendId === listId && ev.currentUserId === currentUserId)
    );

    var existRoomId = filtData.find((event) => event);
    console.log('filtData', existRoomId);
    if (existRoomId === undefined) {
      this.createRoom(e, currentUserId);
    } else {
      this.props.navigation.navigate('Messages Detail', {
        userData: e,
        currenUserId: currentUserId,
        roomId: existRoomId.roomId,
      });
    }
  };
  createRoom = (e, currenUserId) => {
    console.log(e, currenUserId);
    var roomId = firebase.database().ref().child('userRooms').push().key;
    var roomObj = {
      currentUserId,
      friendId: e.uid || e.userId,
      roomId,
    };
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
    const {
      mapRegion,
      locationResult,
      location,
      hasLocationPermissions,
      searchShowing,
      messagesUsers,
    } = this.state;
    const filData = messagesUsers.filter((e) => e.uid !== currentUserId);
    // console.log('messagesUsers', filData);

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
            title="Messages Data"
          />

          {!this.state.toggleWindow && (
            <Appbar.Action icon="bell" onPress={this._handleSearch} />
          )}
        </Appbar.Header>
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.scrollView}>
            {filData.map((e, i) => {
              return (
                <Pressable onPress={() => this.startChat(e)}>
                  <Card elevation={3} style={{ margin: 5 }}>
                    <Card.Title
                      title={e.displayname || 'Users'}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },

  appB: {
    backgroundColor: '#3d5afe',
    color: 'white',
    fontWeight: '200',
    fontFamily: 'Comfortaa-Regular',
  },
});

const mapStateToProps = (state) => {
  // console.log(state)
  return {
    user: state.user,
  };
};

// export default withStyles(styles)(Login);
export default connect(mapStateToProps, null)(MessagesScreen);
