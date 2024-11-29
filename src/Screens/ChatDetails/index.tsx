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
  Platform,
  TouchableOpacity,
  Button,
  Image,
} from 'react-native';
import {
  Colors,
  Appbar,
  IconButton,
  Portal,
  ProgressBar,
  Divider,
  Menu,
} from 'react-native-paper';
import storage from '@react-native-firebase/storage';

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
import notifee from '@notifee/react-native';
import {useNavigation} from '@react-navigation/native';
// import storage from '@react-native-firebase/storage';
const ChatDetails = ({route}: {route: any}) => {
  const navigation = useNavigation();
  const scrollViewRef = useRef();
  const getUserData = useSelector((state: any) => state.user);
  const {email, uid} = getUserData;
  const {chatRoomId, userEmail, otherUserId} = route.params;
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  const _handleMore = () => console.log('Shown more');
  const [state, setState] = useSetState<any>({
    toggleLogin: false,
    chatArr: [],
    messageArr: [],
    write_txt: '',
    isModalVisible: false,
    selectedImage: null,
  });
  useEffect(() => {
    listenForMessages(chatRoomId);
  }, [setState]);

  const onDisplayNotification = async () => {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'New Notification Successfully',
      body: 'Main body content of the notification',
      android: {
        channelId,
        // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  };

  const openCameraPicker = async (isCamera: boolean) => {
    const options: any = {
      mediaType: isCamera ? 'photo' : 'video',
    };

    try {
      const response = await launchCamera(options);
      console.log('pickedFile', response);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const openImagePicker = () => {
    const options: any = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        // setSelectedImage(imageUri);
        console.log('imageUri', imageUri);
        // uploadImage(imageUri);
        const source = {uri: response.uri};
        console.log(source);

        setState({
          selectedImage: imageUri,
        });
      }
    });
  };

  const uploadImage = async (senderId: any) => {
    const {selectedImage, imgTxt}: any = state;
    const filename = selectedImage.substring(
      selectedImage.lastIndexOf('/') + 1,
    );
    const uploadUri =
      Platform.OS === 'ios'
        ? selectedImage.replace('file://', '')
        : selectedImage;

    setState({
      uploadingImage: true,
      transferred: 0,
    });

    const task = storage().ref(`chatImages/${filename}`).putFile(uploadUri);

    // set progress state
    // Create a reference to the file we want to download

    task.on('state_changed', (snapshot: any) => {
      console.log('snapshot', snapshot);
      setState({
        transferred:
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000,
      });
      // snapshot.getDownloadURL().then((url: any) => {
      //   console.log('url', url);
      //   // Insert url into an <img> tag to "download"
      // });
    });
    try {
      await task;

      // await imageRef.putFile(loaclPath, {contentType: 'image/jpg'});
      const imageRef = storage().ref(`chatImages/${filename}`);
      // await imageRef.putFile(uploadUri, {contentType: 'image/jpg'});
      await imageRef.putFile(uploadUri);
      const url = await imageRef.getDownloadURL();
      // console.log(url);

      const timestamp = Date.now();

      const newPostKey: any = database().ref('messages').push().key;
      database()
        .ref(`Chat_Messages/${chatRoomId}/messages/${newPostKey}`)
        .update({
          senderId,
          url,
          timestamp,
          newPostKey,
          imgTxt,
        })
        .then(() => {
          console.log('Image set Success.');

          // AsyncStorage.setItem('Last_Msg', JSON.stringify(write_txt));

          // listenForMessages();
        });
    } catch (e) {
      console.error('e', e);
    }

    setState({
      uploadingImage: false,
    });
    Alert.alert(
      'Photo uploaded!',
      'Your photo has been uploaded to Firebase Cloud Storage!',
    );

    setState({
      selectedImage: null,
      isModalVisible: false,
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

  const imageDelete = (filename: string, newPostKey: string, senderId: any) => {
    database()
      .ref(`Chat_Messages/${chatRoomId}/messages/${newPostKey}`)
      .set({
        write_txt: 'you deleted this message',
        senderId,
        updateAt: Date.now(),
      })
      // .remove()
      .then(() => {
        // Create a reference to the file to delete
        const imageStr = filename.substr(
          filename.indexOf('%2F') + 3,
          filename.indexOf('?') - (filename.indexOf('%2F') + 3),
        );
        var desertRef = storage().ref(`chatImages/${imageStr}`);
        console.log('filename', imageStr);
        // Delete the file
        desertRef
          .delete()
          .then(() => {
            database()
              .ref(`Chat_Messages/${chatRoomId}/messages/${newPostKey}`)
              .update({write_txt: 'you deleted this message', senderId});
            // File deleted successfully
          })
          .catch(error => {
            // Uh-oh, an error occurred!
          });
      });
  };

  const sendNotificationFirebaseAPI = async (
    token: string,
    title: string,
    body: string,
    data?: object,
  ) => {
    if (token != '') {
      const headers = {
        Authorization: `key=${GOOGLE_FCM_KEY}`,
        'Content-Type': 'application/json',
      };

      const bodyToSend = JSON.stringify({
        to: token,
        notification: {
          title,
          body,
        },
        data, 
      });
      try {
        await axios({
          method: 'post',
          url: 'https://fcm.googleapis.com/fcm/send',
          headers: headers,
          data: bodyToSend,
        });
      } catch (err) {
        return {err};
      }
    }
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
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          tvParallaxProperties
          title={userEmail ?? 'Chat Detail'}
        />
        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <Appbar.Action
              icon="dots-vertical"
              onPress={() => setVisible(true)}
              color="#fff"
            />
          }>
          <Menu.Item
            onPress={() => {
              setVisible(false);
            }}
            title="Edit"
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              setVisible(false);
            }}
            title="Delete"
          />
        </Menu>
      </Appbar.Header>

      <Text style={{textAlign: 'center'}}>Current User: {email}</Text>

      <View style={{paddingBottom: 140}}>
        <SafeAreaView>
          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() => {
              scrollViewRef.current?.scrollToEnd();
            }}
            // onScroll={() => console.log('scroll')}
            // onScrollBeginDrag={() => console.log('begin')}
            // onScrollEndDrag={() => state.messageArr.length - 1}
          >
            {state.messageArr.map((e: any, i: number) => {
              return (
                <View>
                  {uid === e.senderId ? (
                    <View
                      key={e.newPostKey}
                      style={{
                        backgroundColor:
                          e.write_txt === 'you deleted this message'
                            ? '#73d5e0b0'
                            : '#73d5e0',
                        width: 250,
                        marginHorizontal: 8,
                        marginVertical: 8,
                        alignSelf: 'flex-end',
                        borderRadius: 10,
                        padding: 5,
                      }}>
                      {e.write_txt ? (
                        <>
                          <Text
                            style={{
                              color: '#000',
                              paddingLeft: 8,
                              fontSize: 15,
                              fontStyle:
                                e.write_txt === 'you deleted this message'
                                  ? 'italic'
                                  : 'normal',
                            }}>
                            {e.write_txt}
                          </Text>
                          <Text
                            style={{
                              color: '#000',
                              paddingLeft: 8,
                              fontSize: 10,
                              textAlign: 'right',
                            }}>
                            {moment(e.timestamp).format('HH:mm')}
                          </Text>
                        </>
                      ) : (
                        <View>
                          <Pressable
                            onLongPress={() =>
                              Alert.alert(
                                'Chat App',
                                'Are you sure?',
                                [
                                  {
                                    text: 'Cancel',
                                    onPress: () =>
                                      Alert.alert('Cancel Pressed'),
                                    style: 'cancel',
                                  },
                                  {
                                    text: 'Ok',
                                    onPress: () =>
                                      imageDelete(e.url, e.newPostKey, uid),
                                  },
                                ],
                                {
                                  cancelable: true,
                                  onDismiss: () =>
                                    Alert.alert(
                                      'This alert was dismissed by tapping outside of the alert dialog.',
                                    ),
                                },
                              )
                            }>
                            <View style={{padding: 10, alignSelf: 'center'}}>
                              <Image
                                source={{
                                  uri: e.url,
                                }}
                                resizeMode="contain"
                                resizeMethod="scale"
                                style={{width: 200, height: 200}}
                              />
                            </View>
                            <Text
                              style={{
                                color: '#000',

                                // fontSize: 10,
                                // textAlign: 'right',
                              }}>
                              {e.imgTxt}
                            </Text>
                          </Pressable>
                        </View>
                      )}
                    </View>
                  ) : (
                    <View
                      key={e.newPostKey}
                      style={{
                        backgroundColor:
                          e.write_txt === 'you deleted this message'
                            ? '#3086ddb3'
                            : '#3086dd',
                        width: 250,
                        marginHorizontal: 8,
                        marginVertical: 8,
                        borderRadius: 10,
                        padding: 5,
                      }}>
                      {e.url ? (
                        <View>
                          <Pressable
                            disabled
                            onLongPress={() =>
                              Alert.alert(
                                'Chat App',
                                'Are you sure?',
                                [
                                  {
                                    text: 'Cancel',
                                    onPress: () =>
                                      Alert.alert('Cancel Pressed'),
                                    style: 'cancel',
                                  },
                                  {
                                    text: 'Ok',
                                    onPress: () =>
                                      imageDelete(e.url, e.newPostKey, uid),
                                  },
                                ],
                                {
                                  cancelable: true,
                                  onDismiss: () =>
                                    Alert.alert(
                                      'This alert was dismissed by tapping outside of the alert dialog.',
                                    ),
                                },
                              )
                            }>
                            <View style={{padding: 10, alignSelf: 'center'}}>
                              <Image
                                source={{
                                  uri: e.url,
                                }}
                                resizeMode="contain"
                                resizeMethod="scale"
                                style={{width: 200, height: 200}}
                              />
                            </View>
                            <Text
                              style={{
                                color: '#fff',

                                // fontSize: 10,
                                // textAlign: 'right',
                              }}>
                              {e.imgTxt}
                            </Text>
                          </Pressable>
                        </View>
                      ) : (
                        <>
                          <Text
                            style={{
                              color: '#000',
                              paddingLeft: 8,
                              fontSize: 15,
                            }}>
                            {e.write_txt}
                          </Text>
                          <Text
                            style={{
                              color: '#000',
                              paddingRight: 8,
                              fontSize: 10,
                              textAlign: 'right',
                            }}>
                            {/* {new Date().toDateString()} */}
                            {moment(e.timestamp).format('HH:mm')}
                          </Text>
                        </>
                      )}
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
            // onPress={() => onDisplayNotification()}
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
              {state.uploadingImage === true && (
                <View>
                  <ProgressBar
                    progress={state.transferred}
                    color={Colors.red800}
                    style={{height: 8, marginBottom: 30}}
                  />
                </View>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                {/* <View
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
                      // onPress={() => openCameraPicker()}
                    />
                  </View>
                  <Text style={{marginTop: 10}}>Camera</Text>
                </View> */}

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

                  <View style={styles.imageContainer}>
                    <>
                      {state.selectedImage !== null ? (
                        <Image
                          source={{
                            uri: state.selectedImage,
                          }}
                          style={styles.imageBox}
                        />
                      ) : null}
                      {state.selectedImage !== null && (
                        <View style={[styles.inputConChild, {margin: 10}]}>
                          <TextInput
                            style={styles.imgInput}
                            placeholder="Enter Here"
                            onChangeText={e => setState({imgTxt: e})}
                            value={state.imgTxt}
                          />
                        </View>
                      )}
                      {state.selectedImage !== null && (
                        <Button
                          disabled={state.uploadingImage}
                          title="Upload image"
                          onPress={() => uploadImage(uid)}
                        />
                      )}
                    </>
                  </View>
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
  imgInput: {
    flexGrow: 1,
    paddingLeft: 30,
    paddingVertical: '3%',
    color: 'black',
    height: 50,
    width: 400,
  },
  sendIcon: {
    marginRight: '2%',
  },
  inputConChild: {
    borderWidth: 1,
    borderRadius: 50,

    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
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
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#bbded6',
  },
  selectButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#8ac6d1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#ffb6b9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    marginTop: 30,
    // marginBottom: 50,
    alignItems: 'center',
  },
  progressBarContainer: {
    marginTop: 20,
  },
  imageBox: {
    width: 250,
    height: 250,
  },
});
