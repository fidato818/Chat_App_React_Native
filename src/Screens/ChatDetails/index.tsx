import {onValue} from '@react-native-firebase/database';
import {useSetState} from 'ahooks';
import React, {useEffect} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {Appbar} from 'react-native-paper';
import {ref} from 'yup';
import database from '@react-native-firebase/database';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Card} from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import {useSelector} from 'react-redux';

const ChatDetails = ({route}: {route: any}) => {
  const getUserData = useSelector((state: any) => state.user);
  const {email, uid} = getUserData;

  const [state, setState] = useSetState({
    toggleLogin: false,
    chatArr: [],
    messageArr: [],
  });
  useEffect(() => {
    const {chatRoomId} = route.params;
    listenForMessages(chatRoomId);
  }, [setState]);

  const listenForMessages = (chatRoomId: any) => {
    // const { chatRoomId } = state

    database()
      .ref(`Chat_Messages/${chatRoomId}/messages`)
      .on('value', (snapshot: any) => {
        var newArr: [] = [];
        const userData = snapshot.val();
        // console.log('User data: ', chatRoomId);
        snapshot.forEach((data: any) => {
          var childData = data.val();
          console.log(childData);
          newArr.push(childData as never);
        });
        setState({messageArr: newArr});
      });
  };
  // const sendMessage = senderId => {
  //   const {write_txt, chatRoomId} = state;
  //   // console.log(chatRoomId, senderId, text)
  //   const timestamp = Date.now();
  //   // const chatRoomId = push(child(ref(db), 'messages')).key;
  //   const newPostKey = push(child(ref(db), 'messages')).key;
  //   // const userId = "69291db2-83cb-4b06-8667-b06b03ab5930";
  //   // var chatRoomId = "190b623a-f4f0-4789-a0b5-dbe5dd9903af"
  //   set(ref(db, `Chat_Messages/${chatRoomId}/messages/${newPostKey}`), {
  //     senderId,
  //     write_txt,
  //     timestamp,
  //     newPostKey,
  //   });
  //   // setNewMessage('');
  //   setState({write_txt: ''});
  // };
  return (
    <View style={styles.Container}>
      <Appbar.Header

      // theme={{
      //   colors: {
      //     primary: theme?.colors.primary,
      //   },
      // }}
      >
        <Appbar.Content tvParallaxProperties title="Chat Detail" />
      </Appbar.Header>
      <View>
        {state.messageArr.map((e: any, i) => {
          return (
            <>
              {e.senderId === uid ? (
                <View
                  key={i}
                  style={{
                    backgroundColor: 'grey',
                    width: 250,
                    marginHorizontal: 8,
                    marginVertical: 8,
                    borderRadius: 10,
                  }}>
                  <Text style={{color: '#fff', paddingLeft: 8, fontSize: 15}}>
                    {e.write_txt}
                  </Text>
                  <Text style={{color: '#fff', paddingLeft: 8, fontSize: 10}}>
                    {/* {new Date().toDateString()} */}
                    {e.timestamp}
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: 'grey',
                    width: 250,
                    marginHorizontal: 8,
                    marginVertical: 8,
                    alignSelf: 'flex-end',
                    borderRadius: 10,
                  }}>
                  <Text style={{color: '#fff', paddingLeft: 8, fontSize: 15}}>
                    {e.write_txt}
                  </Text>
                  <Text style={{color: '#fff', paddingLeft: 8, fontSize: 10}}>
                    {e.timestamp}
                  </Text>
                </View>
              )}
            </>
          );
        })}

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
          <TextInput style={styles.input} placeholder="Enter Here" />
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
