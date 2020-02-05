import React from 'react';
import {
  Provider as PaperProvider,
  Button,
  Card,
  TextInput,
} from 'react-native-paper';
import { View, Text, StyleSheet, Alert } from 'react-native';
import firebase from '../../config/firebase';
import { Facebook } from 'expo';
class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      signToggle: true,
    };
  }

  /*============================================================================== */

  register = () => {
    const { email, password, username } = this.state;
    if (email == '' || password == '' || username == '') {
      Alert.alert('please fill all Fields');
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(user => {
          var userId = firebase.auth().currentUser.uid;
          firebase
            .database()
            .ref('Users/' + userId)
            .set({
              email,
              password,
              username,
            })
            .then(data => {
              //success callback
              // Alert.alert('data ', data);
              this.props.navigation.navigate('Home');
            })
            .catch(e => {
              //error callback
              Alert.alert(`Error: ${e.message}`);
            });
        });
    }
  };
  /*============================================================================== */
  login = () => {
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(data => {
        //success callback
        console.log('data ', data);
        this.props.navigation.navigate('Home');
      })
      .catch(error => {
        //error callback
        console.log('error ', error);
      });
    // }
  };
  /*============================================================================== */
  signInWithFacebook = async () => {
    try {
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync('440214823247638', {
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        return firebase
          .auth()
          .signInWithCredential(credential)
          .then(result => {
            let userId = firebase.auth().currentUser;
            firebase
              .database()
              .ref('Users/' + userId)
              .set({
                email: result.user.email,
                createdAt: Date.now(),
                username: result.user.displayName,
                photo: result.user.photoURL,
                uid: userId.uid,
              })
              .then(data => {
                //success callback
                Alert.alert('data ', data);
                this.props.navigation.navigate('Home');
              })
              .catch(e => {
                //error callback
                Alert.alert(e.message);
              });
          });
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  };
  /*============================================================================== */
  render() {
    const { signToggle } = this.state;
    return (
      <PaperProvider>
        {signToggle ? (
          <Card>
            <Card.Content>
              <Text style={styles.headings}>Register</Text>

              <Text />
              <View>
                <TextInput
                  label="Email"
                  value={this.state.username}
                  onChangeText={username => this.setState({ username })}
                />
              </View>
              <Text />
              <View>
                <TextInput
                  label="Email"
                  value={this.state.email}
                  onChangeText={email => this.setState({ email })}
                />
              </View>
              <Text />
              <View>
                <TextInput
                  label="Password"
                  value={this.state.password}
                  onChangeText={password => this.setState({ password })}
                />
              </View>
              <Text />
              <Button icon="" mode="contained" onPress={() => this.register()}>
                Signup
              </Button>
              <Text />
              <Button
                icon=""
                mode="contained"
                onPress={() =>
                  this.setState({
                    signToggle: !this.state.signToggle,
                  })
                }>
                Already Member? Login
              </Button>
              <Text />
              <Button
                icon=""
                mode="contained"
                onPress={() => this.props.navigation.navigate('Home')}>
                Checking
              </Button>
            </Card.Content>
          </Card>
        ) : (
          <Card>
            <Card.Content>
              <Text style={styles.headings}>Login</Text>
              <Text />
              <View>
                <TextInput
                  label="Email"
                  value={this.state.email}
                  onChangeText={email => this.setState({ email })}
                />
              </View>
              <Text />
              <View>
                <TextInput
                  label="Password"
                  value={this.state.password}
                  onChangeText={password => this.setState({ password })}
                />
              </View>
              <Text />
              <Button icon="" mode="contained" onPress={() => this.login()}>
                Login
              </Button>
              <Text />
              <Button
                icon=""
                mode="contained"
                onPress={() => this.signInWithFacebook()}>
                Login with Facebook
              </Button>
              <Text />
              <Button
                icon=""
                mode="contained"
                onPress={() =>
                  this.setState({
                    signToggle: !this.state.signToggle,
                  })
                }>
                Dont have an account? Register
              </Button>
            </Card.Content>
          </Card>
        )}
      </PaperProvider>
    );
  }
}
const styles = StyleSheet.create({
  headings: {
    backgroundColor: '#ecf0f1',
    justifyContent: 'space-between',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default Signup;
