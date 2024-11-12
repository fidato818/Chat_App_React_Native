import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, ScrollView} from 'react-native';
import {Appbar, Avatar, Card, IconButton} from 'react-native-paper';
import database from '@react-native-firebase/database';
import {useSetState} from 'ahooks';
import {SafeAreaView} from 'react-native-safe-area-context';
const Chat = () => {
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
    listenUsers();
  }, []);

  const listenUsers = () => {
    database()
      .ref('users')
      .on('value', (snapshot: any) => {
        var newArr: [] = [];
        const userData = snapshot.val();
        // console.log('User data: ', snapshot.val());
        snapshot.forEach((data: any) => {
          var childData = data.val();
          // console.log(childData)
          newArr.push(childData as never);
        });
        setState({userArr: newArr});
      });
  };

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
