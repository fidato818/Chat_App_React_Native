import {useSetState} from 'ahooks';
import React, {useEffect, useState} from 'react';
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
const phoneRegExp =
  //   /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;

const SignupSchema = Yup.object().shape({
  phone_number: Yup.string()
    .required('required')
    .matches(phoneRegExp, 'Phone number is not valid')
    .min(11, 'too short')
    .max(13, 'too long'),
});
const LoginWithPhone = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [state, setState] = useSetState<any>({toggleLogin: false, chatArr: []});
  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState(null);

  // verification code (OTP - One-Time-Passcode)
  const [code, setCode] = useState('');

  // Handle login
  function onAuthStateChanged(user: any) {
    if (user) {
      // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
      // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
      // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
      // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const signinhandler = async (data: any) => {
    const {email, phone_number} = data;
    console.log(phone_number);
    setState({isLoading: true});
    const confirmation = await auth().signInWithPhoneNumber(phone_number);
    setConfirm(confirmation);
  };

  async function confirmCode() {
    try {
      await confirm.confirm(code);
    } catch (error) {
      console.log('Invalid code.');
      setState({isLoading: false});
    }
  }
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
              initialValues={{phone_number: ''}}
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
                    label="Phone"
                    name="phone_number"
                    placeholder="Phone"
                    style={styles.textInput}
                    onChangeText={handleChange('phone_number')}
                    onBlur={handleBlur('phone_number')}
                    value={values.phone_number}
                    keyboardType="numeric"
                  />

                  {errors.phone_number && (
                    <HelperText
                      visible={errors.phone_number}
                      style={{color: 'red'}}>
                      {errors.phone_number}
                    </HelperText>
                  )}
                  <View style={{marginTop: 10}}>
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
                  </View>
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
export default LoginWithPhone;
