import {onValue} from '@react-native-firebase/database';
import {useSetState} from 'ahooks';
import React, {useEffect, useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import {Appbar, IconButton, Portal} from 'react-native-paper';

import database from '@react-native-firebase/database';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Card} from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import {useSelector} from 'react-redux';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
// import storage from '@react-native-firebase/storage';
const ChatDetails = ({route}: {route: any}) => {
  const scrollViewRef = useRef();
  const getUserData = useSelector((state: any) => state.user);
  const {email, uid} = getUserData;
  const {chatRoomId, userEmail, otherUserId} = route.params;

  const [state, setState] = useSetState<any>({
    toggleLogin: false,
    chatArr: [],
    messageArr: [],
    write_txt: '',
    isModalVisible: false,
  });
  useEffect(() => {
    listenForMessages(chatRoomId);
  }, [setState]);

  const openCameraPicker = () => {
    let options: any = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        const source = {uri: response.uri};
        console.log('response', JSON.stringify(response));
        setState({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri,
        });
      }
    });
  };
  const openImagePicker = () => {
    const options: any = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        // setSelectedImage(imageUri);
        console.log('imageUri', imageUri);
      }
    });
  };

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
          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() => {
              scrollViewRef.current?.scrollToEnd();
            }}
            onScroll={() => console.log('scroll')}
            onScrollBeginDrag={() => console.log('begin')}
            onScrollEndDrag={() => state.messageArr.length - 1}>
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
                        borderRadius: 10,
                        padding: 5,
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
            // onPress={() => openImagePicker()}
            onPress={() => setState({isModalVisible: true})}
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

      <Modal
        // animationType="slide"
        animationType="fade"
        transparent={true}
        visible={state.isModalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setState({isModalVisible: false});
        }}>
        <View
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            height: '100%',
            justifyContent: 'center',
          }}>
          <View>
            <View
              style={{
                alignSelf: 'flex-end',
                top: 60,
                // backgroundColor: 'red',
                right: 20,
                zIndex: 1000,
              }}>
              <IconButton
                icon="close"
                // iconColor={MD3Colors.error50}
                color="black"
                size={20}
                onPress={() => setState({isModalVisible: false})}
              />
            </View>
            <View style={styles.modalView}>
              {/* <Text style={styles.modalText}>Hello World!</Text> */}
              {/* <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setState({isModalVisible: false})}>
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable> */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 10,
                  }}>
                  <View style={{backgroundColor: '#0d7909', borderRadius: 50}}>
                    <IconButton
                      icon="camera"
                      // iconColor={MD3Colors.error50}
                      color="#fff"
                      size={35}
                      onPress={() => openCameraPicker()}
                    />
                  </View>
                  <Text style={{marginTop: 10}}>Camera</Text>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <View style={{backgroundColor: '#790964', borderRadius: 50}}>
                    <IconButton
                      icon="image-multiple"
                      // iconColor={MD3Colors.error50}
                      color="#fff"
                      size={35}
                      onPress={() => openImagePicker()}
                    />
                  </View>
                  <Text style={{marginTop: 10}}>Gallery</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Hello World!</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setState({isModalVisible: false})}>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View> */}
      </Modal>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 50,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
