import React from 'react';

import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import {
  Provider as PaperProvider,
  Button,
  Card,
  Avatar,
  Title,
  Paragraph,
  IconButton,
} from 'react-native-paper';
import { Ionicons, Feather } from '@expo/vector-icons';
import firebase from '../../config/Firebase';

export default class Status extends React.Component {
  constructor() {
    super();
    this.state = {
      name: 'Adnan Ahmed',
      user: '',
      email: '',
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('user changed..', user.email);
        this.setState({
          user: user.username,
          email: user.email,
        });
      }
    });
  }

  render() {
    const { name, username, email } = this.state;
    console.log(username);
    console.log(this.props);
    return (
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <Card.Title
              title="Card Title"
              subtitle="Card Subtitle"
              left={props => <Avatar.Icon {...props} icon="folder" />}
              right={props => (
                <IconButton {...props} icon="more-vert" onPress={() => {}} />
              )}
            />
            <View>
              <Text style={styles.headings}>Recent Updates</Text>
              <Card.Title
                title="Card Title"
                subtitle="Card Subtitle"
                left={props => <Avatar.Icon {...props} icon="folder" />}
                right={props => (
                  <IconButton {...props} icon="more-vert" onPress={() => {}} />
                )}
              />
              <Card.Title
                title="Card Title"
                subtitle="Card Subtitle"
                left={props => <Avatar.Icon {...props} icon="folder" />}
                right={props => (
                  <IconButton {...props} icon="more-vert" onPress={() => {}} />
                )}
              />
              <Card.Title
                title="Card Title"
                subtitle="Card Subtitle"
                left={props => <Avatar.Icon {...props} icon="folder" />}
                right={props => (
                  <IconButton {...props} icon="more-vert" onPress={() => {}} />
                )}
              />
              <Card.Title
                title="Card Title"
                subtitle="Card Subtitle"
                left={props => <Avatar.Icon {...props} icon="folder" />}
                right={props => (
                  <IconButton {...props} icon="more-vert" onPress={() => {}} />
                )}
              />
              <Text style={styles.headings}>Viewed Updates</Text>
              <Card.Title
                title="Card Title"
                subtitle="Card Subtitle"
                left={props => <Avatar.Icon {...props} icon="folder" />}
                right={props => (
                  <IconButton {...props} icon="more-vert" onPress={() => {}} />
                )}
              />
              <Card.Title
                title="Card Title"
                subtitle="Card Subtitle"
                left={props => <Avatar.Icon {...props} icon="folder" />}
                right={props => (
                  <IconButton {...props} icon="more-vert" onPress={() => {}} />
                )}
              />
              <Card.Title
                title="Card Title"
                subtitle="Card Subtitle"
                left={props => <Avatar.Icon {...props} icon="folder" />}
                right={props => (
                  <IconButton {...props} icon="more-vert" onPress={() => {}} />
                )}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </PaperProvider>
    );
  }
}
const styles = StyleSheet.create({
  headings: {
    backgroundColor: '#ecf0f1',

    fontSize: 16,
  },
});
