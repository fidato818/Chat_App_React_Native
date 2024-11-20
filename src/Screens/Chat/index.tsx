import React, {useCallback, useEffect, useLayoutEffect} from 'react';
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
import {useFocusEffect} from '@react-navigation/native';

import {
  chatToRedux,
  remove_user,
  toggleOff,
  toggleOn,
} from '../../Store/userReducers';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {useSetState} from 'ahooks';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppSelector} from '../../Store/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';

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
  const isFocused = useIsFocused();

  const getUserData = useAppSelector((state: any) => state.user);
  // const getUserChat = useAppSelector((state: any) => state.value);

  // const chatArr = getUserChat.flat();
  const {email, uid} = getUserData;
  const [state, setState] = useSetState<any>({
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

  // useEffect(() => {
  //   if (isFocused) {
  //     // console.log('In inFocused Block', isFocused);
  //     // listenForMessages();
  //     // getChatUsers();
  //   }
  // }, [isFocused]);

  // const getData = async () => {
  //   try {
  //     const value = await AsyncStorage.getItem('Last_Msg');
  //     if (value !== null) {
  //       // value previously stored
  //       console.log('value', value);
  //       setState({lastMsg: value});
  //     }
  //   } catch (e) {
  //     // error reading value
  //   }
  // };

  useLayoutEffect(() => {
    // const unsubscribe = navigation.addListener('focus', () => {
    //   console.log('In Navigation Add Listener Block');
    //   listenForMessages();
    //   return unsubscribe;
    // });

    const listenForMessages = () => {
      database()
        .ref('Chats')
        .on('value', (snapshot: any) => {
          var newArr: [] = [];
          var inArr: [] = [];

          snapshot.forEach(function (data: any) {
            var childData = data.val();

            inArr.push(childData as never);
            setState({
              chatArr: inArr,
            });
            var friendKey = '';

            if (childData.otherUserId === uid) {
              friendKey = childData.currentId;
              newArr.push(friendKey as never);
            } else if (childData.currentId === uid) {
              friendKey = childData.otherUserId;
              newArr.push(friendKey as never);
            }

            getChatUsers(newArr);
          });
        });
    };
    listenForMessages();
  }, []);

  const getChatUsers = (friendKey: any) => {
    if (friendKey !== '') {
      database()
        .ref(`users`)
        .on('value', (data: any) => {
          var childData = data.val();
          var result = Object.values(childData).filter((e: any) =>
            friendKey?.includes(e.userId),
          );
          setState({
            userArr: result,
          });
        });
    }
  };

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
      notExistChat(currentId, otherUserId, userEmail);
    } else {
      alreadyExistChat(currentId, otherUserId, checkUserIDs, userEmail);
    }
  };
  const notExistChat = (currentId: any, otherUserId: any, userEmail: any) => {
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
          otherUserId,
        });
        // setState({ chatRoomId })
      });
  };
  
  const alreadyExistChat = (
    currentId: any,
    otherUserId: any,
    checkUserIDs: any,
    userEmail: any,
  ) => {
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
          otherUserId,
        });
      });
  };
  // console.log('lastMsg', JSON.parse(state.lastMsg));
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
      <Text style={{textAlign: 'center'}}>Current User: {email}</Text>
      <View>
        <SafeAreaView>
          <ScrollView>
            {state.userArr.map((e: any, i: number) => {
              return (
                <Card style={{margin: 8}} key={i} elevation={5}>
                  <Pressable
                    onPress={() =>
                      // startChatWithUser(uid, e.userId, e.userEmail)
                      startChatWithUser(uid, e.userId, e.email)
                    }>
                    <Card.Title
                      title={e.email}
                      subtitle={e.write_txt}
                      // left={props => <Avatar.Icon {...props} icon="folder" />}
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
