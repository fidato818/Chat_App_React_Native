import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, ScrollView} from 'react-native';
import {Appbar, Avatar, Card, IconButton} from 'react-native-paper';
import database from '@react-native-firebase/database';
import {useSetState} from 'ahooks';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppSelector} from '../../Store/hooks';
const Chat = () => {
  const getUserData = useAppSelector((state: any) => state.user);
  // const getUserChat = useAppSelector((state: any) => state.value);
  const {email, uid} = getUserData;
  // const chatArr = getUserChat.flat();

  const navigation = useNavigation();

  const [state, setState] = useSetState({
    toggleLogin: false,
    chatArr: [],
    userArr: [],
  });
  var chatRoomId = '190b623a-f4f0-4789-a0b5-dbe5dd9903af';
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    database()
      .ref('Chats')
      // .orderByChild('members')
      // .equalTo(uid)
      .on('value', (snapshot: any) => {
        var newArr: [] = [];
        const userData = snapshot.val();
        // console.log('User data: ', Object.values(snapshot.val()));
        snapshot.forEach((data: any) => {
          var childData = data.val();
          // console.log('User data: ', childData.members);
          newArr.push(childData as never);
        });
        setState({chatArr: newArr});
        // AsyncStorage.setItem('chatData', JSON.stringify(newArr));
        // dispatch(chatToRedux(newArr));
      });
  }, []);

  useEffect(() => {
    const listenUsers = () => {
      database()
        .ref('users')
        .orderByChild('userId')
        // .equalTo(!uid)

        .once('value', (snapshot: any) => {
          var newArr: [] = [];
          const userData = snapshot.val();
          // console.log('User data: ', snapshot.val());
          snapshot.forEach((data: any) => {
            var childData = data.val();

            newArr.push(childData as never);
          });
          // setState({userArr: newArr});
          setState({userArr: newArr?.filter((e: any) => e.userId !== uid)});
        });
    };
    listenUsers();
  }, [setState]);

  // Handle Chat with Other User
  const startChatWithUser = (
    currentId: any,
    otherUserId: any,
    userEmail: any,
  ) => {
    const {chatArr} = state;

    const checkUserIDs = chatArr.filter(
      (e: any) =>
        (e.members[0] === currentId && e.members[1] === otherUserId) ||
        (e.members[0] === otherUserId && e.members[1] === currentId),
    );

    if (checkUserIDs.length === 0) {
      const chatRoomId: any = database().ref('messages').push().key;
      // listenForMessages(chatRoomId);
      // setState({chatRoomId, userEmail});
      database()
        .ref(`Chats/${chatRoomId}`)
        .set({
          // senderId,
          // write_txt,
          // timestamp,
          // newPostKey
          members: [currentId, otherUserId],
          currentId,
          otherUserId,
          // more_properties: 'goes here',
          chatRoomId,
          chatDate: new Date().valueOf(),
          currentUsrEmail: email,
          otherUserEmail: userEmail,
        })
        .then((e: any) => {
          console.log('success 1');
          navigation.navigate('Chat Detail' as never, {
            chatRoomId,
            userEmail,
          });
          // setState({ chatRoomId })
        });
    } else {
      const chatRoomId: any = checkUserIDs[0].chatRoomId;
      console.log('chatRoomId 2', chatRoomId);
      // listenForMessages(chatRoomId);
      setState({chatRoomId, userEmail});

      database()
        .ref(`Chats/${chatRoomId}`)
        .update({
          // senderId,
          // write_txt,
          // timestamp,
          // newPostKey
          members: [currentId, otherUserId],
          currentId,
          otherUserId,
          // more_properties: 'goes here',
          chatRoomId,
          updateAt: new Date().valueOf(),
          chatDate: new Date().valueOf(),
          currentUsrEmail: email,
          otherUserEmail: userEmail,
        })
        .then((e: any) => {
          console.log('success 2');
          navigation.navigate('Chat Detail' as never, {
            chatRoomId,
            userEmail,
          });
        });
    }

    // setState({ userEmail })
    // if (currentId && otherUserId) {
    //   createChatRoom(currentId, otherUserId);
    // }
  };
  // Create or Access Chat Room (One-on-One)
  // const createChatRoom = (user1Id, user2Id) => {
  //   // const chatRoomId = user1Id < user2Id ? `${user1Id}_${user2Id}` : `${user2Id}_${user1Id}`;
  //   // setChatRoomId(chatRoomId);
  //   setState({chatRoomId});

  //   // listenForMessages(chatRoomId);
  //   // return chatRoomId;
  // };

  return (
    <View>
      <Appbar.Header

      // theme={{
      //   colors: {
      //     primary: theme?.colors.primary,
      //   },
      // }}
      >
        <Appbar.Content tvParallaxProperties title="Users" />
      </Appbar.Header>
      <SafeAreaView>
        <ScrollView>
          {/* <Pressable onPress={() => navigation.navigate('Settings' as never)}> */}
          {state.userArr.map((e: any, i) => {
            // console.log('e', e);
            return (
              <Card style={{margin: 8}} key={i}>
                <Pressable
                  onPress={() => startChatWithUser(uid, e.userId, e.email)}>
                  <Card.Title
                    title={e.email}
                    // subtitle="Card Subtitle"
                    // left={props => <Avatar.Icon {...props} icon="folder" />}
                    right={props => (
                      <IconButton
                        {...props}
                        icon="dots-vertical"
                        // icon=""
                        onPress={() => {}}
                      />
                    )}
                  />
                </Pressable>
              </Card>
            );
          })}
        </ScrollView>
      </SafeAreaView>
      {/* </Pressable> */}
    </View>
  );
};

export default Chat;
