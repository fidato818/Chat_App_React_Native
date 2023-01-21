import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  AsyncStorage,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  Device,
  BackHandler,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Facebook from 'expo-facebook';
// import * as Permissions from 'expo-permissions';
import { Ionicons } from '@expo/vector-icons';
// import { styles } from './styles';
// import data from '../config/countries+states';
import firebase from '../config/firebase';
import { update_user_Customer } from '../store/actions';

import {
  Avatar,
  Colors,
  TextInput,
  RadioButton,
  HelperText,
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  Portal,
  Provider,
  Constants,
  Snackbar,
  IconButton,
  Appbar,
  Switch,
} from 'react-native-paper';
// import { update_user } from '../store/actions';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
var database = firebase.database();
class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      visibleSnackbar: false,
      errorInputs: false,
      isSwitchOn: false,
      toggleChange: false,

      value: 'Female',
      resturantValid: [],
      password: '',
      region: '',
      age: '',
      gender: '',
    };
  }

  componentDidMount() {
    this.getResturantValidation();
  }

  getResturantValidation = () => {
    database.ref('Resturant_Owner').on('value', (snapshot) => {
      var arr = [];
      snapshot.forEach((data) => {
        var childData = data.val();
        arr.push(childData);
      });
      this.setState({
        resturantValid: arr,
      });
    });
  };

  onToggleSwitch = () => {
    this.setState({
      isSwitchOn: !this.state.isSwitchOn,
    });
  };

  _pickImage = async () => {
    Keyboard.dismiss();

    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    console.log(pickerResult);
    // const { status: cameraRollPerm } = await Permissions.askAsync(
    //   Permissions.CAMERA_ROLL
    // );

    // // only if user allows permission to camera roll
    // if (cameraRollPerm === 'granted') {
    //   let pickerResult = await ImagePicker.launchImageLibraryAsync({
    //     allowsEditing: false,
    //     base64: true,
    //     aspect: [4, 3],
    //     mediaType: 'Images',
    //   });

    //   if (!pickerResult.cancelled) {
    //     this.setState({ image: pickerResult.uri });
    //   }

    //   this.uploadImageAsync(pickerResult.uri);
    // }
  };

  _onPressButton = () => {
    this.setState({
      toggleChange: !this.state.toggleChange,
    });
  };

  /*================================================================================================== */
  handleInputChange = (inputName, inputValue) => {
    this.setState((state) => ({
      ...state,
      [inputName]: inputValue, // <-- Put square brackets
    }));
  };
  /*================================================================================================== */

  /*================================================================================================== */

  onLoginButtonPressed = async (values, actions) => {
    const { fullname, email, password } = values;
    this.setState({
      isSubmitting: true,
    });
    try {
      // const response =
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((res) => {
          // console.log('res', res);
          // console.log('fullname', fullname);
          const user = firebase.auth().currentUser;
          var userId = firebase.auth().currentUser.uid;
          user
            .updateProfile({
              displayName: fullname,
              uid: userId,
              // photoURL: 'https://example.com/jane-q-user/profile.jpg',
            })
            .then(() => {
              // Update successful
              // ...
            })
            .catch((error) => {
              // An error occurred
              // ...
            });

          var obj = {
            email,
            fullname,
            password: Number(password),
            userId,
            createAt: new Date().toLocaleString(),
          };
          firebase
            .database()
            .ref('Users/' + userId)
            .set(obj)
            .then((e) => {
              console.log('Document successfully written!', e);
              this.setState({
                // openSnack: true,
                visibleSnackbar: true,
                isSubmitting: false,
              });
              // alert('success');
              setTimeout(() => {
                this.props.navigation.navigate('Login');
              }, 2000);
              // alert("Successfully Register");
              // setTimeout(function () {
              //   history.push('/Login');
              //   // history.push('/emailverification')
              // }, 2000);
            })
            .catch((error) => {
              console.log('Error  document: ', `${error}`);
            });
        });
      // console.log('response', response);
      // if (response.user) {
      //   this.props.navigation.navigate('Login');
      // }
    } catch (error) {
      actions.setFieldError('general', error.message);
    } finally {
      actions.setSubmitting(false);
    }
  };
  render() {
    const {
      text,
      email,
      password,
      visibleSnackbar,
      image,
      toggleChange,
      gender,
      fullname,
      confirmPassword,
      age,
      region,
      country, 
      isSwitchOn,
      resturantName,
    } = this.state;
    const screenHeight = Dimensions.get('window').height;
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;
    return (
      <Provider style={{ backgroundColor: 'grey', flex: 1 }}>
        <Appbar.Header
          style={{
            // backgroundColor: '#e52165',
            backgroundColor: '#603F83FF',
            color: 'white',
            fontWeight: '200',
            fontFamily: 'Comfortaa-Regular',
          }}>
          <Appbar.Content title="Signup" />
        </Appbar.Header>

        <ScrollView
          style={styles.scrollView}
          // contentContainerStyle={{ flexGrow: 1 }}
        >
          <KeyboardAwareScrollView
            // extraScrollHeight={10}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            // style={{ backgroundColor: 'teal' }}
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={styles.container}
            scrollEnabled={false}>
            <View
              style={{
                flex: 1,
                // justifyContent: 'flex-start',
                // marginBottom: 170, 
                paddingBottom: 10,
                // backgroundColor: 'grey',
              }}>
              <Formik
                initialValues={{
                  fullname: '',
                  email: '',
                  password: '',
                }}
                validationSchema={Yup.object({
                  fullname: Yup.string().required('Full Name is Required'),
                  email: Yup.string()
                    .email('Please enter valid email')
                    .required('Email Address is Required'),
                  password: Yup.string()
                    .min(
                      8,
                      ({ min }) => `Password must be at least ${min} characters`
                    )
                    .required('Password is required'),
                })}
              
                onSubmit={(values, actions) => {
                  this.onLoginButtonPressed(values, actions);
                }}
             
              >
                {(props) =>
                  console.log(props) || (
                    <View style={{ margin: 10 }}>
                      <TextInput
                        theme={{
                          colors: {
                            // placeholder: 'white',
                            // text: 'white',
                            primary: '#3526a5',
                            underlineColor: 'transparent',
                            // background: '#003489',
                          },
                        }}
                        label="Full Name"
                        onChangeText={props.handleChange('fullname')}
                        onBlur={props.handleBlur('fullname')}
                        value={props.values.fullname}
                        // autoFocus
                        style={styles.input}
                        onSubmitEditing={() => {
                          // on certain forms, it is nice to move the user's focus
                          // to the next input when they press enter.
                          this.emailInput.focus();
                        }}
                      />
                      {props.touched.fullname && props.errors.fullname ? (
                        <Text style={styles.error}>
                          {props.errors.fullname}
                        </Text>
                      ) : null}
                      <TextInput
                        theme={{
                          colors: {
                            // placeholder: 'white',
                            // text: 'white',
                            primary: '#3526a5',
                            underlineColor: 'transparent',
                            // background: '#003489',
                          },
                        }}
                        label="Email"
                        onChangeText={props.handleChange('email')}
                        onBlur={props.handleBlur('email')}
                        value={props.values.email}
                        // autoFocus
                        style={styles.input}
                        onSubmitEditing={() => {
                          // on certain forms, it is nice to move the user's focus
                          // to the next input when they press enter.
                          this.emailInput.focus();
                        }}
                      />
                      {props.touched.email && props.errors.email ? (
                        <Text style={styles.error}>{props.errors.email}</Text>
                      ) : null}
                      <View
                        style={{
                          position: 'relative',
                        }}>
                        <TextInput
                          theme={{
                            colors: {
                              // placeholder: 'white',
                              // text: 'white',
                              primary: '#3526a5',
                              underlineColor: 'transparent',
                              // background: '#003489',
                            },
                          }}
                          label="Password"
                          type="password"
                          onChangeText={props.handleChange('password')}
                          onBlur={props.handleBlur('password')}
                          value={props.values.password}
                          secureTextEntry={
                            !this.state.showPassword ? true : false
                          }
                          // autoFocus
                          style={styles.input}
                          onSubmitEditing={() => {
                            // on certain forms, it is nice to move the user's focus
                            // to the next input when they press enter.
                            this.emailInput.focus();
                          }}
                        />
                        <IconButton
                          style={{
                            position: 'absolute',
                            right: 5,
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                          }}
                          icon={!this.state.showPassword ? 'eye-off' : 'eye'}
                          color={Colors.black500}
                          size={25}
                          onPress={() =>
                            this.setState({
                              showPassword: !this.state.showPassword,
                            })
                          }
                        />
                      </View>
                      {props.touched.password && props.errors.password ? (
                        <Text style={styles.error}>
                          {props.errors.password}
                        </Text>
                      ) : null}

                      <Button
                        onPress={props.handleSubmit}
                        // color="#0d1137"
                        color="#603F83FF"
                        mode="contained"
                        loading={this.state.isSubmitting}
                        disabled={this.state.isSubmitting}
                        style={{ marginTop: 16 }}>
                        Submit
                      </Button>
                      {/*  <Text />
                      <Button
                        // color="rgb(44, 95, 45)"
                        dark={true}
                        compact={true}
                        mode="contained"
                        // onPress={() => this.imageU()}
                        onPress={() => this.handleSubmit()}>
                        <Text
                          style={{
                            color: 'white',
                            fontFamily: 'Comfortaa-Regular',
                          }}>
                          Signup
                        </Text>
                      </Button> */}
                      <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Login')}>
                        <Text
                          style={{
                            margin: 10,
                            textAlign: 'center',
                            color: 'grey',
                            fontFamily: 'Comfortaa-Regular',
                          }}>
                          Already have an account? Log in
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )
                }
              </Formik>
            </View>
          </KeyboardAwareScrollView>
        </ScrollView>
        <Snackbar
          style={{
            fontFamily: 'Comfortaa-Regular',
            // backgroundColor: '#e52165',
            backgroundColor: '#603F83FF',
          }}
          visible={this.state.visibleSnackbar}
          onDismiss={() => this.setState({ visibleSnackbar: false })}
          duration={1500}
          action={{
            label: '',
            onPress: () => {
              // Do something
            },
          }}>
          Signup successfully
        </Snackbar>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    // backgroundColor: 'pink',
    // marginHorizontal: 20,
    // flex: 2
  },
  input: {
    marginBottom: 5,
    backgroundColor: 'transparent',
    height: 55,
  },
  error: {
    color: 'red',
  },
});

const mapStateToProps = (state) => {
  // console.log(state)
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    store_user_C: (userlogin) => dispatch(update_user_Customer(userlogin)),
  };
};
// export default withStyles(styles)(Login);
export default connect(mapStateToProps, mapDispatchToProps)(Signup);
