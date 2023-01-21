import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import MapView, {
  AnimatedRegion,
  PROVIDER_GOOGLE,
  Animated,
  Marker,
  Circle,
  Polyline,
} from 'react-native-maps';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import MapViewDirections from 'react-native-maps-directions';

import {
  Paragraph,
  Button,
  FAB,
  Portal,
  Snackbar,
  Dialog,
  Card,
  Divider,
  IconButton,
  HelperText,
  Appbar,
  Colors,
  Menu,
  Searchbar,
  DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.771707;
const LONGITUDE = -122.4053769;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
export default class NearBy extends React.Component {
  constructor() {
    super();
    this.state = {
      mapRegion: null,

      hasLocationPermissions: false,
      locationResult: null,
      location: { coords: { latitude: 37.78825, longitude: -122.4324 } },
      coordinates: [
        {
          latitude: 37.3317876,
          longitude: -122.0054812,
        },
        {
          latitude: 37.771707,
          longitude: -122.4053769,
        },
      ],
    };
    this.mapView = null;
  }
  onMapPress = (e) => {
    this.setState({
      coordinates: [...this.state.coordinates, e.nativeEvent.coordinate],
    });
  };
  componentDidMount() {
    // this.getLocationAsync();
    // navigator.geolocation.watchPosition(
    //   (position) => {
    //     // console.log('position', position);
    //     const { latitude, longitude } = position.coords;
    //     this.setState({ latitude, longitude, error: null });
    //   },
    //   (error) => this.setState({ error: error.message }),
    //   {
    //     enableHighAccuracy: true,
    //     timeout: 15000,
    //     maximumAge: 10000,
    //     distanceFilter: 0, // add/update to get frequent location updates
    //   }
    // );
  }

  handleMapRegionChange = async (mapRegion) => {
    console.log('mapRegion', mapRegion);
    this.setState({
      mapRegion: {
        latitude: mapRegion.latitude,
        longitude: mapRegion.longitude,
        latitudeDelta: mapRegion.latitudeDelta,
        longitudeDelta: mapRegion.longitudeDelta,
      },
    });
    // let { coords } = await Location.getCurrentPositionAsync();
    // if (coords) {
    const { latitude, longitude } = mapRegion;
    let response = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    // Object {
    //     "city": "Stockholm",
    //     "country": "Sweden",
    //     "district": "Stockholm City",
    //     "isoCountryCode": "SE",
    //     "name": "Gustav Adolfs torg",
    //     "postalCode": "111 52",
    //     "region": "Stockholm",
    //     "street": "Gustav Adolfs torg",
    //     "subregion": "Stockholm",
    //     "timezone": "Europe/Stockholm",
    // }
    for (let item of response) {
      let address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;
      console.log('location Address', address);
      // setDisplayCurrentAddress(address);
    }
    // }
  };

  async getLocationAsync() {
    // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
    // const { status, permissions } = await Permissions.askAsync(
    //   Permissions.LOCATION
    // );
    // if (status === 'granted') {
    //   this.setState({ hasLocationPermissions: true });
    //   //  let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    //   let location = await Location.getCurrentPositionAsync({});
    //   this.setState({ locationResult: JSON.stringify(location), location });
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log('location', location);

    this.setState({ locationResult: JSON.stringify(location), location });
    // Center the map on the location we just fetched.
    this.setState({
      mapRegion: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    });
    // } else {
    //   alert('Location permission not granted');
    // }
  }

  onRegionChange(region, lastLat, lastLong) {
    // console.log(region, lastLat, lastLong);
    this.setState({
      mapRegion: region,
      // If there are no new values set use the the current ones
      lastLat: lastLat || this.state.lastLat,
      lastLong: lastLong || this.state.lastLong,
    });
  }

  render() {
    const {
      mapRegion,
      locationResult,
      location,
      hasLocationPermissions,
      searchShowing,
    } = this.state;

    // console.log('mapRegion', mapRegion ? mapRegion.latitude : 0);
    // console.log('location', location);
    const origin = { latitude: 37.3318456, longitude: -122.0296002 };
    const destination = {
      latitude: 40.76771397054617,
      longitude: -73.96433042362332,
    };
    const GOOGLE_MAPS_APIKEY = 'AIzaSyBNuh502JYqpGfz-B19AvHp2mucN7IRaYk';
    const coordsArray = [
      {
        latitude: mapRegion ? mapRegion.latitude : 0,
        longitude: mapRegion ? mapRegion.longitude : 0,
      },

      {
        latitude: 40.76771397054617,
        longitude: -73.96433042362332,
      },
    ];
    // var _mapView: MapView;
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.appB}>
          <IconButton
            color="white"
            icon={require('../assets/snack-icon.png')}
            onPress={() => this.props.navigation.openDrawer()}
          />
          <Appbar.Content
            style={{
              alignItems: 'center',
            }}
            title="Online"
          />

          {!this.state.toggleWindow && (
            <Appbar.Action icon="bell" onPress={this._handleSearch} />
          )}
        </Appbar.Header>

        <View style={styles.container}>
          <MapView
            followUserLocation={true}
            // ref={(ref) => (this.mapView = ref)}
            userInterfaceStyle="dark"
            // showsTraffic={true}
            zoomEnabled={true}
            showsUserLocation={true}
            style={styles.mapStyle}
            region={this.state.mapRegion}
            // // region={{ latitude: 24.860966, longitude: 66.990501 }}
            // onRegionChange={this.handleMapRegionChange.bind(this)}
            onRegionChangeComplete={this.handleMapRegionChange.bind(this)}
            // // onRegionChange={this.onRegionChange}
            showsCompass={true}
            rotateEnabled={true}
            showsMyLocationButton={true}
            // // cacheEnabled={false}
            zoomControlEnabled={true}
            animateToRegion={(this.state.mapRegion, 1000)}
            toolbarEnabled={true}
            loadingEnabled={true}
            moveOnMarkerPress={true}
            // minZoomLevel={2} // default => 0
            // maxZoomLevel={4} // default => 20
            // onPress={() => this.animate()}
          >
            <MapViewDirections
              origin={origin}
              destination={destination}
              apikey={GOOGLE_MAPS_APIKEY}
            />
            <MapView.Marker
              // coordinate={location.coords}
              ref={(marker) => {
                this.marker = marker;
              }}
              animateMarkerToCoordinate={
                ({
                  latitude: mapRegion ? mapRegion.latitude : 0,
                  longitude: mapRegion ? mapRegion.longitude : 0,
                },
                1000)
              }
              // coordinate={this.state.coordinate}
              // ref={(marker) => {
              //   this.marker = marker;
              // }}
              onDragEnd={(e) => {
                console.log('dragEnd', e.nativeEvent.coordinate);
              }}
              coordinate={{
                latitude: mapRegion ? mapRegion.latitude : 0,
                longitude: mapRegion ? mapRegion.longitude : 0,
              }}
              title="Hello"
              // description="Some description"
              // draggable
            />
            {/*   <MapView.Marker
              // coordinate={location.coords}
              ref={(marker) => {
                this.marker = marker;
              }}
              animateMarkerToCoordinate={
                ({
                  latitude: mapRegion ? mapRegion.latitude : 0,
                  longitude: mapRegion ? mapRegion.longitude : 0,
                },
                1000)
              }
              // coordinate={this.state.coordinate}
              // ref={(marker) => {
              //   this.marker = marker;
              // }}
              onDragEnd={(e) => {
                console.log('dragEnd', e.nativeEvent.coordinate);
              }}
              coordinate={destination}
              title="Hello"
              // description="Some description"
              // draggable
            />*/}
            {/* <MapView.Polyline
              coordinates={coordsArray}
              strokeWidth={10}
              strokeColor="#00a8ff"
              lineCap="around"
            /> */}

            <MapView.Circle
              // key={(
              //   this.state.currentLongitude +
              //   this.state.currentLongitude
              // ).toString()}
              center={{
                latitude: mapRegion ? mapRegion.latitude : 0,
                longitude: mapRegion ? mapRegion.longitude : 0,
              }}
              radius={20}
              strokeWidth={2}
              strokeColor="#3399ff"
              fillColor="#80bfff"
              // center={{
              //   latitude: Number(countryInfo.lat),
              //   longitude: Number(countryInfo.long),
              // }}
              // radius={100}
              // strokeWidth={5}
              // strokeColor={"#1a66ff"}
              // fillColor={"rgba(230,238,255,0.5)"}
              // onRegionChangeComplete={this.onRegionChangeComplete.bind(
              //   this
              // )}
            />
          </MapView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  // paragraph: {
  //   margin: 24,
  //   marginTop: 0,
  //   fontSize: 35,
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  // },
  appB: {
    backgroundColor: '#3d5afe',
    color: 'white',
    fontWeight: '200',
    fontFamily: 'Comfortaa-Regular',

    // backgroundColor: (
    //   <LinearGradient
    //     colors={['#a13388', '#10356c']}
    //     style={{ flex: 1 }}
    //     start={{ x: 0, y: 0 }}
    //     end={{ x: 1, y: 0 }}
    //   />
    // ),
  },
  // mapStyle: {
  //   width: '100%',
  //   height: 350,
  // },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
