import React, {useEffect} from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import {
  useTheme,
  Appbar,
  DefaultTheme,
  Avatar,
  Card,
  IconButton,
  Divider,
} from 'react-native-paper';
import database from '@react-native-firebase/database';
import {remove_user, toggleOff, toggleOn} from '../../Store/userReducers';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {useSetState} from 'ahooks';
import {SafeAreaView} from 'react-native-safe-area-context';
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};
const HomeScreen = () => {
  const navigation = useNavigation();
  const getUserData = useSelector((state: any) => state.user);
  const {email, uid} = getUserData;
  const [state, setState] = useSetState({
    toggleLogin: false,
    chatArr: [],
    userArr: [],
  });
  const theme = useTheme();
  const themeSelector = useSelector((state: any) => state.isThemeDark);
  const dispatch = useDispatch();

  const togglTheme = () => {
    if (themeSelector == true) {
      dispatch(toggleOff());
    } else {
      dispatch(toggleOn());
    }
  };

  const logoutHandler = () => {
    auth()
      .signOut()
      .then(() => {
        dispatch(remove_user());
        console.log('User signed out!');
        // navigation.navigate('Login' as never);
      });
  };

  useEffect(() => {
    database()
      .ref('Chats')
      .on('value', (snapshot: any) => {
        var newArr: [] = [];
        const userData = snapshot.val();
        // console.log('User data: ', snapshot.val());
        snapshot.forEach((data: any) => {
          var childData = data.val();
          // console.log(childData)
          newArr.push(childData as never);
        });
        setState({chatArr: newArr});
      });
  }, []);

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
      setState({chatRoomId, userEmail});
      database()
        .ref(`Chats/${chatRoomId}`)
        .set({
          // senderId,
          // write_txt,
          // timestamp,
          // newPostKey
          members: [currentId, otherUserId],
          // more_properties: 'goes here',
          chatRoomId,
        })
        .then((e: any) => {
          console.log('success 1');
          navigation.navigate('Chat Detail' as never, {
            chatRoomId,
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
          // more_properties: 'goes here',
          chatRoomId,
          updateAt: new Date().valueOf(),
        })
        .then((e: any) => {
          console.log('success 1');
          navigation.navigate('Chat Detail' as never, {
            chatRoomId,
          });
          // setState({ chatRoomId })
        });
    }

    // setState({ userEmail })
    // if (currentId && otherUserId) {
    //   createChatRoom(currentId, otherUserId);
    // }
  };
  // Create or Access Chat Room (One-on-One)
  const createChatRoom = (user1Id, user2Id) => {
    // const chatRoomId = user1Id < user2Id ? `${user1Id}_${user2Id}` : `${user2Id}_${user1Id}`;
    // setChatRoomId(chatRoomId);
    setState({chatRoomId});

    // listenForMessages(chatRoomId);
    // return chatRoomId;
  };

  return (
    <View
      style={
        {
          // flex: 1,
          // alignItems: 'center',
          // justifyContent: 'center',
          // backgroundColor: 'skyblue',
        }
      }>
      <Appbar.Header

      // theme={{
      //   colors: {
      //     primary: theme?.colors.primary,
      //   },
      // }}
      >
        <Appbar.Content tvParallaxProperties title="Chats" />
        <Appbar.Action
          icon="account-circle"
          onPress={() => {
            navigation.navigate('Settings' as never);
          }}
        />
        <Appbar.Action
          icon="logout"
          onPress={() => {
            logoutHandler();
          }}
        />
      </Appbar.Header>

      <View>
        {/* <Pressable onPress={() => navigation.navigate('Chat' as never)}> */}
        <SafeAreaView>
          <ScrollView>
            {/*  */}
            {state.chatArr.map((e: any, i) => {
              // console.log('e', e);
              return (
                <Card style={{margin: 8}} key={i} elevation={5}>
                  <Pressable
                    onPress={
                      () => startChatWithUser(uid, e.userId, e.email)
                      // navigation.navigate('Chat Detail' as never, {
                      //   e,
                      // })

                      // navigation.navigate('Chat Detail', {
                      //   itemId: 86,
                      //   otherParam: 'anything you want here',
                      // })
                    }>
                    <Card.Title
                      title={e.email}
                      // subtitle="Card Subtitle"
                      left={props => <Avatar.Icon {...props} icon="folder" />}
                      right={props => (
                        <IconButton
                          {...props}
                          icon="dots-vertical"
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

        {/**/}
      </View>
    </View>
  );
};

export default HomeScreen;
