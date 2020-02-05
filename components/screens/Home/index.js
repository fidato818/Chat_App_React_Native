{ /* import React from 'react';
import { BottomNavigation, Text, View } from 'react-native-paper';
import ChatScreen from './Chat'
const MusicRoute = () => <Text>ChatScreen</Text>;
const AlbumsRoute = () => <Text>ProfileScreen</Text>;
 
 
class Home extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'music', title: 'Music', icon: 'queue-music' },
      { key: 'albums', title: 'Albums', icon: 'album' },
    ],
  };
  _handleIndexChange = index => this.setState({ index });
  _renderScene = BottomNavigation.SceneMap({
    music: MusicRoute,
    albums: AlbumsRoute,
  });
  render() {
    return (
      <BottomNavigation
        navigationState={this.state}
        onIndexChange={this._handleIndexChange}
        renderScene={this._renderScene}
      />
    );
  }
}
export default Home */ }