import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import { IconButton, Appbar } from 'react-native-paper';
import { connect } from 'react-redux';
import moment from 'moment';
import firebase from '../config/firebase';
var database = firebase.database();
class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageArr: [],
      data: [
        {
          id: 1,
          date: '9:50 am',
          type: 'in',
          message: 'Lorem ipsum dolor sit amet',
        },
        {
          id: 2,
          date: '9:50 am',
          type: 'out',
          message: 'Lorem ipsum dolor sit amet',
        },
        {
          id: 3,
          date: '9:50 am',
          type: 'in',
          message: 'Lorem ipsum dolor sit a met',
        },
        {
          id: 4,
          date: '9:50 am',
          type: 'in',
          message: 'Lorem ipsum dolor sit a met',
        },
        {
          id: 5,
          date: '9:50 am',
          type: 'out',
          message: 'Lorem ipsum dolor sit a met',
        },
        {
          id: 6,
          date: '9:50 am',
          type: 'out',
          message: 'Lorem ipsum dolor sit a met',
        },
        {
          id: 7,
          date: '9:50 am',
          type: 'in',
          message: 'Lorem ipsum dolor sit a met',
        },
        {
          id: 8,
          date: '9:50 am',
          type: 'in',
          message: 'Lorem ipsum dolor sit a met',
        },
        {
          id: 9,
          date: '9:50 am',
          type: 'in',
          message: 'Lorem ipsum dolor sit a met hello',
        },
      ],
    };
  }
  componentDidMount() {
    this.getMsgFromDB();
  }

  renderDate = (date) => {
    return <Text style={styles.time}>{date}</Text>;
  };

  getMsgFromDB = () => {
    const { roomId } = this.props.route.params;
    // var roomId = '-NMKiZM9upFybUlodio5'; 

    database.ref('messages/' + roomId).on('value', (snapshot) => {
      var newArr = [];
      snapshot.forEach((data) => {
        var childData = data.val();
        console.log('chi', childData);
        newArr.push(childData);
      });
      this.setState({
        messageArr: newArr,
      });
    });
  };
  sendMessage = () => {
    const { userData, currenUserId, roomId } = this.props.route.params;
    const { userMessage } = this.state;
    var messageId = firebase.database().ref().child('messages').push().key;
    var obj = {
      userMessage,
      roomId,
      currenUserId,
      friendId: userData.userId || userData.uid,
      createAt: new Date().valueOf(),
      messageId,
    };

    database
      // .ref('messages/' + roomId)
      .ref(`messages/${roomId}/${messageId}`)
      .set(obj)
      .then((success) => {
        console.log('success');
        this.setState({
          userMessage: '',
        });
      })
      .catch((e) => {
        console.log('Error: ', e);
      });
  };

  render() {
    const { userData, currenUserId, roomId } = this.props.route.params;

    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.appB}>
          <IconButton
            color="white"
            icon={require('../assets/snack-icon.png')}
            onPress={() => this.props.navigation.openDrawer()}
          />
          <Appbar.Content
            color="white"
            style={{
              alignItems: 'center',
            }}
            title={userData.displayname}
          />

          {!this.state.toggleWindow && (
            <Appbar.Action
              color="white"
              icon="bell"
              onPress={this._handleSearch}
            />
          )}
        </Appbar.Header>
        <FlatList
          style={styles.list}
          data={this.state.messageArr}
          keyExtractor={(item) => {
            return item.id;
          }}
          renderItem={(message) => {
            console.log('message', message);
            const item = message.item;
            let inMessage = item.type === 'in';
            let itemStyle = inMessage ? styles.itemIn : styles.itemOut;
            return (
              <View style={[styles.item, itemStyle]}>
                {!inMessage && this.renderDate(item.date)}
                <View style={[styles.balloon]}>
                  <Text> {item.userMessage}</Text>
                </View>

                <Text> {moment(item.createAt).fromNow()} </Text>
              </View>
            );
          }}
        />
        <View style={styles.footer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputs}
              placeholder="Write a message..."
              underlineColorAndroid="transparent"
              onChangeText={(userMessage) => this.setState({ userMessage })}
            />
          </View>

          <TouchableOpacity
            style={styles.btnSend}
            onPress={() => this.sendMessage()}>
            <Image
              source={{
                uri: 'https://img.icons8.com/small/75/ffffff/filled-sent.png',
              }}
              style={styles.iconSend}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 17,
  },
  footer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#eeeeee',
    paddingHorizontal: 10,
    padding: 5,
  },
  btnSend: {
    backgroundColor: '#00BFFF',
    width: 40,
    height: 40,
    borderRadius: 360,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSend: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  inputs: {
    height: 40,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  balloon: {
    maxWidth: 250,
    padding: 15,
    borderRadius: 20,
  },
  itemIn: {
    alignSelf: 'flex-start',
  },
  itemOut: {
    alignSelf: 'flex-end',
  },
  time: {
    alignSelf: 'flex-end',
    margin: 15,
    fontSize: 12,
    color: '#808080',
  },
  item: {
    marginVertical: 14,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#eeeeee',
    borderRadius: 300,
    padding: 5,
  },
});

const mapStateToProps = (state) => {
  // console.log(state)
  return {
    user: state.user,
  };
};

// export default withStyles(styles)(Login);
export default connect(mapStateToProps, null)(Chat);
