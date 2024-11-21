import {useSetState} from 'ahooks';
import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {Formik} from 'formik';
import {
  HelperText,
  Button,
  TextInput,
  Snackbar,
  IconButton,
  Text,
} from 'react-native-paper';
import * as Yup from 'yup';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import database from '@react-native-firebase/database';

const SignupSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  //   lastName: Yup.string()
  //     .min(2, 'Too Short!')
  //     .max(50, 'Too Long!')
  //     .required('Required'),
  password: Yup.string()
    .min(9, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
});
const Signup = () => {
  const navigation = useNavigation();
  const [state, setState] = useSetState<any>({
    toggleLogin: false,
    chatArr: [],
    email: '',
    password: '',
    fullName: '',
  });

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
  const signuphandler = (data: any) => {
    const {email, password} = data;
    setState({isLoading: true});

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(e => {
        console.log('User account created & signed in!', e);
        const userId = e.user.uid;
        database()
          .ref(`users/${userId}`)
          .set({
            email: e.user.email,
            emailVerified: e.user.emailVerified,
            isAnonymous: e.user.isAnonymous,
            userId,
            createAt: new Date().valueOf(),
          })
          .then(() => {
            console.log('Data set.');
            navigation.navigate('Login' as never);
            setState({isLoading: false, email: '', password: '', fullName: ''});
          });
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

        var errArr = ['auth/user-not-found', 'auth/wrong-password'];

        var errMsg: any =
          errArr.includes(error.code) === true && `Invalid email or password`;
        // console.error('error', errArr.includes(error.code));
        Alert.alert('Chat App', errMsg);
        setState({isLoading: false});
      });
  };
  return (
    <ScrollView keyboardShouldPersistTaps="handled">
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
          initialValues={{
            email: state.email,
            password: state.password,
            fullName: state.fullName,
          }}
          onSubmit={values =>
            //   setState({
            //     data: values,
            //   })
            signuphandler(values)
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
                label="Full Name"
                name="fullName"
                placeholder="Full Name"
                style={styles.textInput}
                onChangeText={handleChange('fullName')}
                onBlur={handleBlur('fullName')}
                value={values.fullName}
                keyboardType="default"
                disabled={state.isLoading}
              />
              {errors.fullName && (
                <HelperText visible={errors.fullName} style={{color: 'red'}}>
                  {errors.fullName}
                </HelperText>
              )}

              <TextInput
                label="Email"
                name="email"
                placeholder="Email Address"
                style={styles.textInput}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
                disabled={state.isLoading}
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
                  Signup
                </Button>
              ) : (
                <Button
                  //   loading
                  //   icon="camera"
                  mode="contained"
                  disabled={!isValid}
                  onPress={handleSubmit}>
                  Signup
                </Button>
              )}
              <TouchableOpacity
                onPress={() => navigation.navigate('Login' as never)}>
                <Text>Already have an account! Signin</Text>
              </TouchableOpacity>
              {/* <Button  onPress={handleSubmit} title="LOGIN" disabled={!isValid} /> */}
            </>
          )}
        </Formik>
        <Snackbar
          duration={1500}
          visible={state.visibleSnack}
          onDismiss={() =>
            setState({
              visibleSnack: false,
            })
          }
          // action={{
          //   label: 'Undo',
          //   onPress: () => {
          //     // Do something
          //   },
          // }}
        >
          Hey there! I'm a Snackbar.
        </Snackbar>
      </View>
    </ScrollView>
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
export default Signup;
