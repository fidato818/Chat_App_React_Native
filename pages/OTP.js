import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native';
import * as Yup from 'yup';
import { Formik, ErrorMessage } from 'formik';
import {
  TextInput,
  Button,
  Provider,
  Snackbar,
  IconButton,
  Appbar,
  Colors,
} from 'react-native-paper';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      visibleSnackbar: false,
      errorInputs: false,
      isSwitchOn: false,
      toggleChange: false,

      value: 'Female',
      customerUser: [],
      password: '',
      region: '',
      age: '',
      gender: '',
    };
  }

  componentDidMount() {}

  /*================================================================================================== */
  onLoginButtonPressed = async (values, actions) => {
    const { customerUser } = this.state;
    const { email, password } = values;
    this.setState({
      isSubmitting: true,
    });
  };
  /*================================================================================================== */

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
          style={[
            {
              // backgroundColor: '#603F83FF',
              color: 'white',
              fontWeight: '200',
              fontFamily: 'Comfortaa-Regular',
            },
          ]}>
          <Appbar.Content title="OTP" />
        </Appbar.Header>

        <ScrollView
        // style={styles.scrollView}
        // contentContainerStyle={{ flexGrow: 1 }}
        >
          <KeyboardAwareScrollView
            // extraScrollHeight={10}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            // style={{ backgroundColor: 'teal' }}
            resetScrollToCoords={{ x: 0, y: 0 }}
            // contentContainerStyle={styles.container}
            scrollEnabled={false}>
            <View
              style={{
                flex: 1,
                // justifyContent: 'flex-start',
                // marginBottom: 170,
                paddingBottom: 10,
                // backgroundColor: 'grey',
              }}>
              <View>
                <Formik
                  initialValues={{
                    email: '',
                    password: '',
                  }}
                  validationSchema={Yup.object({
                    email: Yup.string()
                      .email('Please enter valid email')
                      .required('Email Address is Required'),
                    password: Yup.string()
                      // .min(
                      //   8,
                      //   ({ min }) =>
                      //     `Password must be at least ${min} characters`
                      // )
                      .required('Password is required'),
                  })}
                  onSubmit={(values, actions) => {
                    this.onLoginButtonPressed(values, actions);
                  }}
                  // onSubmit={(values, formikActions) => {
                  //   const { fullname, email, password } = values;
                  //   this.handlSubmit(fullname, email, password);
                  //   setTimeout(() => {
                  //     // // Alert.alert(JSON.stringify(values));

                  //     // // Important: Make sure to setSubmitting to false so our loading indicator
                  //     // // goes away.
                  //     formikActions.setSubmitting(false);
                  //   }, 500);
                  // }}
                >
                  {(props) =>
                    console.log('props') || (
                      <View style={{ margin: 10 }}>
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
                            label="OTP"
                            type="text"
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
                          // color="#C7D3D4FF"
                          color="#603F83FF"
                          mode="contained"
                          loading={this.state.isSubmitting}
                          disabled={this.state.isSubmitting}
                          style={{ marginTop: 16 }}>
                          Login
                        </Button>
                      </View>
                    )
                  }
                </Formik>

                {/*
                  <Text />
                  <Button
                    color="rgb(44, 95, 45)"
                    dark={true}
                    compact={true}
                    mode="contained"
                    onPress={() => this.loginWithFacebook()}>
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: 'Comfortaa-Regular',
                      }}>
                      Login With Facebook
                    </Text>
                  </Button>
                  */}
              </View>
            </View>
          </KeyboardAwareScrollView>
        </ScrollView>
        <Snackbar
          style={{
            fontFamily: 'Comfortaa-Regular',
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
          Login successfully
        </Snackbar>
      </Provider>
    );
  }
}
const styles = StyleSheet.create({
  headerColor: {
    backgroundColor: '#603F83FF',
  },
  btnColor: {
    color: '#b23a48',
  },
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

// export default Login;

// const mapStateToProps = (state) => {
//   // // console.log(state)
//   // return {
//   //   user: state.user,
//   // };
// };

// const mapDispatchToProps = (dispatch) => {
//   // return {
//   //   store_user_C: (userlogin) => dispatch(update_user_Customer(userlogin)),
//   // };
// };
export default Login;
// export default connect(mapStateToProps, mapDispatchToProps)(Login);
