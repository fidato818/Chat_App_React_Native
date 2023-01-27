import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground } from 'react-native';

class Splash extends Component {
  constructor(props) {
    super(props);

    setTimeout(() => {
      // console.log('props', props);
      // props.navigation.navigate('Login');
      // props.navigation.navigate('Login');
      // props.navigation.navigate('QrPage');
      // }, 3000);
    }, 500);
  }

  render() {
    return (
      <ImageBackground
        source={require('../assets/splash.png')}
        style={styles.backgroundImage}>
        <View style={{ backgroundColor: 'rgba(19,127,144, 0.7)', flex: 1 }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{
                flex: 1,
                width: '70%',
                height: '70%',
                resizeMode: 'contain',
              }}
              source={require('../assets/snack-icon.png')}
            />
          </View>

          <View style={styles.bottomView}>
            <Text style={styles.textStyle}>Developed By Adnan Ahmed</Text>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

export default Splash;
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  // bottom: {
  //   // justifyContent: 'flex-end',
  //   marginBottom: 20,
  // },
  bottomView: {
    width: '100%',
    height: 50,

    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  textStyle: {
    fontFamily: 'ubuntu-regular',
    fontSize: 16,
    color: 'white',
  },
});
