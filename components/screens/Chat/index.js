import React from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  Provider as PaperProvider,
  Button,
  Card,
  Avatar,
  Title,
  Paragraph,
  IconButton,
} from 'react-native-paper';
import firebase from '../../config/firebase';
export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      arr: [],
    };
  }

  componentDidMount() {
    this.readUserData();
  }
  readUserData() {
    firebase
      .database()
      .ref('Users/')
      .on('value', dataSnapshot => {
        var tasks = [];
        dataSnapshot.forEach(child => {
          // console.log(child)
          tasks.push({
            username: child.val().username,
            email: child.val().email,
            password: child.val().password,
            _key: child.key,
          });
        });

        this.setState({
          arr: tasks,
        });
      });
  }

  createRoom(friendId) {
    const userId = firebase.auth().currentUser.uid;
    let chatExists = false;

    firebase
      .database()
      .ref('chatrooms')
      // .where('users.' + userId, '==', true)
      // .where('users.' + friendId, '==', true)
      .then(snapshot => {
        snapshot.forEach(elem => {
          console.log(elem);
          // chatExists = { data: elem.data(), _id: elem.id };
        });
        //   if (!chatExists) {
        //     const obj = {
        //       createdAt: Date.now(),
        //       users: {
        //         [friendId]: true,
        //         [firebase.auth().currentUser.uid]: true,
        //       },
        //     };
        //     firebase
        //       .database()
        //       .ref('chatrooms')
        //       .push(obj)
        //       .then(snapshot => {
        //             console.log(snapshot)
        //       });
        //   } else {
        //     console.log(chatExists);
        //   }
      });
    // console.log(friendId)
  }
  render() {
    const { arr } = this.state;

    // var x = 'some string';
    // alert(x.charAt(0)); // alerts 's'
    return (
      <PaperProvider>
        <ScrollView>
          {/*  <Text style={styles.container}>Chat Screen</Text> */}
          {arr.map(e => {
            return (
              <Card.Title
                // key={e._key}
                title={e.username}
                subtitle={e.email}
                left={props => (
                  <Avatar.Text
                    {...props}
                    label={e.username.substring(0, 2).toUpperCase()}
                    size={36}
                  />
                )}
                right={props => (
                  <IconButton
                    {...props}
                    icon="more-vert"
                    onPress={() => {
                      this.props.navigation.navigate('TextMessages', {
                        friendId: e._key,
                        friendName: e.username,
                      });
                    }}
                    // onPress={() => {
                    //   this.createRoom(e._key);
                    // }}
                  />
                )}
              />
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
