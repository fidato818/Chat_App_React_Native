import React from 'react';
import { View } from 'react-native';
import { Constants } from 'expo';
import { Appbar, Provider as PaperProvider } from 'react-native-paper';
import Navigation from './components/config/navigations';
import { Facebook } from 'expo';
export default class App extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <PaperProvider>
        <Navigation />
      </PaperProvider>
    );
  }
}


