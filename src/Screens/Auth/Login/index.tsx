import {useSetState} from 'ahooks';
import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {Formik} from 'formik';

import {
  HelperText,
  TextInput,
  Button,
  IconButton,
  Text,
} from 'react-native-paper';
import * as Yup from 'yup';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {update_user} from '../../../Store/userReducers';
const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(6, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'), 
});
const Login = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [state, setState] = useSetState<any>({toggleLogin: false, chatArr: []});

  //   useEffect(() => {
  //     onAuthStateChanged(auth, user => {
  //       if (user) {
  //         // User is signed in, see docs for a list of available properties
  //         // https://firebase.google.com/docs/reference/js/auth.user
  //         const uid = user.uid;
  //         console.log(user);
  //         setState({currentId: uid, currentEmail: user.email});
  //         // ...
  //       } else {
  //         // User is signed out
  //         // ...
  //       }
  //     });
  //   }, []);
  const signinhandler = (data: any) => {
    const {email, password} = data;
    setState({isLoading: true});
    // console.log('data', data);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(e => {
        console.log('User account created & signed in!', e);
        var obj = {
          uid: e.user.uid,
          email: e.user.email,
          emailVerified: e.user.emailVerified,
        };
        dispatch(update_user(obj));
        // navigation.navigate('Home' as never);
        setState({isLoading: false});
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          // console.log('That email address is already in use!');
          Alert.alert('Chat App', 'That email address is already in use!');
          setState({isLoading: false});
        }

        if (error.code === 'auth/invalid-email') {
          // console.log('That email address is invalid!');
          Alert.alert('Chat App', 'That email address is invalid!');
          setState({isLoading: false});
        }

        // console.error('error', errMsg);
        var errArr = ['auth/user-not-found', 'auth/wrong-password'];

        var errMsg: any =
          errArr.includes(error.code) === true && `Invalid email or password`;
        // console.error('error', errArr.includes(error.code));
        Alert.alert('Chat App', errMsg);
        setState({isLoading: false});
      });
  };
  return (
    <View>
      <ScrollView keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
          enabled>
          <IconButton
            icon="chat"
            size={160}
            style={{
              // flex: 1,
              marginTop: '20%',
              // width: '100%',
              // height: '25%',
              // resizeMode: 'cover',
              // aspectRatio: 1, // Your aspect ratio
              alignSelf: 'center',
              // fontSize: 300
            }}
            // source={require('@/assets/logo/logo.png')}
          />
          <View style={{margin: 10}}>
            <Formik
              validationSchema={SignupSchema}
              initialValues={{email: '', password: ''}}
              onSubmit={values =>
                //   setState({
                //     data: values,
                //   })
                signinhandler(values)
              }>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                isValid,
              }) => (
                <>
                  <TextInput
                    disabled={state.isLoading}
                    label="Email"
                    name="email"
                    placeholder="Email Address"
                    style={styles.textInput}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    keyboardType="email-address"
                  />

                  {errors.email && (
                    <HelperText visible={errors.email} style={{color: 'red'}}>
                      {errors.email}
                    </HelperText>
                  )}
                  <TextInput
                    disabled={state.isLoading}
                    label="Password"
                    name="password"
                    placeholder="Password"
                    style={styles.textInput}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry={state.showPass === true ? true : false}
                    right={
                      <TextInput.Icon
                        name={state.showPass === true ? 'eye-off' : 'eye'}
                        onPress={() =>
                          setState({
                            showPass: !state.showPass,
                          })
                        }
                      />
                    }
                  />

                  <HelperText visible={errors.password} style={{color: 'red'}}>
                    {errors.password}
                  </HelperText>

                  {state.isLoading ? (
                    <Button
                      loading
                      //   icon="camera"
                      mode="contained"
                      disabled
                      onPress={handleSubmit}>
                      Signin
                    </Button>
                  ) : (
                    <Button
                      //   loading
                      //   icon="camera"
                      mode="contained"
                      disabled={!isValid}
                      onPress={handleSubmit}>
                      Signin
                    </Button>
                  )}
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Signup' as never)}>
                    <Text>Don't have an account! Signup</Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                  onPress={() => navigation.navigate('Home' as never)}>
                  <Text>Don't have an account! Signup</Text>
                </TouchableOpacity> */}
                </>
              )}
            </Formik>
            {/* </View> */}
            {/* <View style={{marginTop: 20}}>
              <Text style={{fontSize: 20, textAlign: 'center'}}>Or</Text>
            </View>
            <Button
              style={{marginTop: 20}}
              //   loading
              icon="phone"
              mode="contained"
              // disabled={!isValid}
              onPress={() => navigation.navigate('LoginWithPhone' as never)}>
              Login With Phone
            </Button> */}
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: 'white',
    margin: 20,
    marginLeft: 0,
  },
  button: {
    marginTop: 40,
    color: 'white',
    height: 40,
    backgroundColor: '#ec5990',
    borderRadius: 4,
  },
  container: {
    // flex: 1,
    justifyContent: 'center',
    // paddingTop: Constants.statusBarHeight,
    // padding: 8,
    // backgroundColor: '#0e101c',
  },
  input: {
    backgroundColor: 'white',
    borderColor: 'none',
    height: 40,
    padding: 10,
    borderRadius: 4,
  },
  textInput: {backgroundColor: 'transparent'},
});
export default Login;
