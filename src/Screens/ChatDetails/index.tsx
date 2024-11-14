import {onValue} from '@react-native-firebase/database';
import {useSetState} from 'ahooks';
import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Appbar} from 'react-native-paper';
import {ref} from 'yup';
import database from '@react-native-firebase/database';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Card} from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import {useSelector} from 'react-redux';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
const ChatDetails = ({route}: {route: any}) => {
  const getUserData = useSelector((state: any) => state.user);
  const {email, uid} = getUserData;
  const {chatRoomId, userEmail, otherUserId} = route.params;

  const [state, setState] = useSetState({
    toggleLogin: false,
    chatArr: [],
    messageArr: [],
    write_txt: '',
  });
  useEffect(() => {
    listenForMessages(chatRoomId);
  }, [setState]);

  const listenForMessages = (chatRoomId: any) => {
    // const { chatRoomId } = state

    database()
      .ref(`Chat_Messages/${chatRoomId}/messages`)
      .on('value', (snapshot: any) => {
        var newArr: [] = [];

        snapshot.forEach((data: any) => {
          var childData = data.val();

          newArr.push(childData as never);
        });
        setState({messageArr: newArr});
      });
  };
  const sendMessage = (senderId: any) => {
    const {write_txt} = state;

    const timestamp = Date.now();
    const newPostKey: any = database().ref('messages').push().key;

    database()
      .ref(`Chat_Messages/${chatRoomId}/messages/${newPostKey}`)
      .set({
        senderId,
        write_txt,
        timestamp,
        newPostKey,
      })
      .then(() => {
        console.log('Data set.');
        database().ref(`users/${otherUserId}`).update({
          senderId,
          write_txt,
          timestamp,
          newPostKey,
        });
        // AsyncStorage.setItem('Last_Msg', JSON.stringify(write_txt));

        // listenForMessages();
      })
      .then(() => {
        database().ref(`users/${senderId}`).update({
          senderId,
          write_txt,
          timestamp,
          newPostKey,
        });
        setState({write_txt: ''});
      });
  };
  return (
    <View style={styles.Container}>
      <Appbar.Header

      // theme={{
      //   colors: {
      //     primary: theme?.colors.primary,
      //   },
      // }}
      >
        <Appbar.Content
          tvParallaxProperties
          title={userEmail ?? 'Chat Detail'}
        />
      </Appbar.Header>
      <Text style={{textAlign: 'center'}}>Current User: {email}</Text>
      <View style={{paddingBottom: 140}}>
        <SafeAreaView>
          <ScrollView>
            {state.messageArr.map((e: any, i: number) => {
              // console.log('e', e);
              return (
                <View>
                  {e.senderId === uid ? (
                    <View
                      key={e.newPostKey}
                      style={{
                        backgroundColor: 'green',
                        width: 250,
                        marginHorizontal: 8,
                        marginVertical: 8,
                        alignSelf: 'flex-end',
                        borderRadius: 10,   padding: 5,
                      }}>
                      <Text
                        style={{color: '#fff', paddingLeft: 8, fontSize: 15}}>
                        {e.write_txt}
                      </Text>
                      <Text
                        style={{color: '#fff', paddingLeft: 8, fontSize: 10}}>
                        {moment(e.timestamp).format('HH:mm')}
                      </Text>
                    </View>
                  ) : (
                    <View
                      key={e.newPostKey}
                      style={{
                        backgroundColor: 'grey',
                        width: 250,
                        marginHorizontal: 8,
                        marginVertical: 8,
                        borderRadius: 10,
                        padding: 5,
                      }}>
                      <Text
                        style={{color: '#fff', paddingLeft: 8, fontSize: 15}}>
                        {e.write_txt}
                      </Text>
                      <Text
                        style={{
                          color: '#fff',
                          paddingRight: 8,
                          fontSize: 10,
                          textAlign: 'right',
                        }}>
                        {/* {new Date().toDateString()} */}
                        {moment(e.timestamp).format('HH:mm')}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </SafeAreaView>

        {/* <View
          style={{
            backgroundColor: 'grey',
            width: 250,
            marginHorizontal: 8,
            marginVertical: 8,
            alignSelf: 'flex-end',
            borderRadius: 10,
          }}>
          <Text style={{color: '#fff', paddingLeft: 8, fontSize: 15}}>
            Hello Ahmed
          </Text>
          <Text style={{color: '#fff', paddingLeft: 8, fontSize: 10}}>
            {new Date().toDateString()}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: 'grey',
            width: 250,
            marginHorizontal: 8,
            marginVertical: 8,
            borderRadius: 10,
            borderColor: 'grey',
            borderWidth: 3,
          }}>
          <Card.Cover
            style={{borderRadius: 10}}
            // source={{uri: imageURI ?? 'https://picsum.photos/700'}}
            source={{uri: 'https://picsum.photos/700'}}
          />
          <Text style={{color: '#fff', paddingLeft: 8, fontSize: 10}}>
            {new Date().toDateString()}
          </Text>
        </View> */}

        <View style={styles.chatView}></View>
      </View>
      <View
        style={{
          bottom: 0,
          position: 'absolute',
          width: '100%',
          marginBottom: 10,
          paddingRight: 10,
          paddingLeft: 5,
        }}>
        <View style={styles.inputConChild}>
          <TextInput
            style={styles.input}
            placeholder="Enter Here"
            onChangeText={e => setState({write_txt: e})}
            value={state.write_txt}
          />
          <MaterialCommunityIcons
            style={[styles.sendIcon, {marginRight: 25}]}
            name="paperclip"
            size={24}
            color="black"
            // onPress={() => _pickDocument()}
            onPress={() => console.log('asd')}
          />
          <Ionicons
            style={styles.sendIcon}
            name="send"
            size={24}
            color="black"
            onPress={() => sendMessage(uid)}
            // onPress={() => console.log('asd')}
          />
        </View>
      </View>
    </View>
  );
};

export default ChatDetails;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    // paddingHorizontal: '2%',
  },
  inroCon: {
    flex: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 5,
  },
  chatView: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputcont: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    // paddingHorizontal: "2%",
  },
  noteText: {
    textAlign: 'center',
    paddingHorizontal: '7%',
    fontSize: 13,
  },
  input: {
    flexGrow: 1,
    paddingLeft: 30,
    paddingVertical: '3%',
    color: 'black',
    height: 50,
  },
  sendIcon: {
    marginRight: '2%',
  },
  inputConChild: {
    borderWidth: 1,
    borderRadius: 50,

    alignItems: 'center',
    flexDirection: 'row',
  },
});
