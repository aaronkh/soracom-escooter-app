import AsyncStorage from '@react-native-community/async-storage';
import React, { Fragment } from 'react';
import { PermissionsAndroid, View } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import API from '../API';
import ActiveScooter from '../components/ActivsScooter/ActiveScooter';
import CenterButton from '../components/Map/CenterButton';
import MapStyle from '../components/Map/MapStyle';
import ScooterMarker from '../components/Map/ScooterMarker';
import ScooterPreview from '../components/Map/ScooterPreview';
import UserLocation from '../components/Map/UserLocation';
import QRCodeScanner from '../components/QRCodeScanner/QRCodeScanner';
import { switchCCToken } from '../redux/actions/actions';
import { distanceBetween } from '../util/DistanceCalculator';

const MAP_ANIMATION_DURATION = 888
const PLACEHOLDER_SCOOTER = {
    name: 'Loading scooter data...',
    distance: 999,
    price: 999,
    battery: 100
}

class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lat: 37.8,
            lng: -122.4,
            scooters: [],
            permissionGPS: true,
            gpsActive: false,
            activeScooter: false,
            firstLocation: true,
            QRScannerOpen: false
        }
    }

    recenterMap = () => {
        this.refs["mapview"].animateToRegion(
            {
                latitude: this.state.lat,
                longitude: this.state.lng,
                longitudeDelta: 0.001,
                latitudeDelta: 0.01
            },
            MAP_ANIMATION_DURATION)
        this.setState({ activeScooter: false })
    }

    openQRScanner = () => {
        if (!this.state.gpsActive || !this.state.permissionGPS) return
        this.setState({ QRScannerOpen: true })
    }

    closeQRScanner = () => this.setState({ QRScannerOpen: false })

    updatePosition = () => {
        Geolocation.watchPosition(
            (position) => {
                if (this.state.firstLocation)
                    this.refs["mapview"].animateToRegion(
                        {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            longitudeDelta: 0.001,
                            latitudeDelta: 0.01
                        },
                        MAP_ANIMATION_DURATION)
                this.setState({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    gpsActive: true,
                    firstLocation: false
                })
            },
            (error) => {
                this.setState({ gpsActive: false })
            },
            { enableHighAccuracy: true, distanceFilter: 10 }
        )
        this.recenterMap()
    }

    onCalloutPress = () => {
        // set state 
        this.openQRScanner()
    }

    askPermissions = () => {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            .then(result => {
                if (result !== PermissionsAndroid.RESULTS.GRANTED) {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
                        .then(requestResult => {
                            if (requestResult !== PermissionsAndroid.RESULTS.GRANTED) {
                                console.log('gps permission not granted by request')
                                this.setState({ permissionGPS: false })
                            } else {
                                console.log('gps permission granted by request')
                                this.setState({ permissionGPS: true })
                                this.updatePosition()
                            }
                        })
                } else {
                    this.setState({ permissionGPS: true })
                    this.updatePosition()
                }
            })
    }

    findScooter = async (location) => {
        this.setState({activeScooter: PLACEHOLDER_SCOOTER})
        // TODO: make API request to get scooter by location
        let lat = location.nativeEvent.coordinate.latitude
        let lng = location.nativeEvent.coordinate.longitude
        await this.state.scooters.map((i, ind) => {
            if (i.coords.lng == lng && i.coords.lat == lat) {
                let a = i
                i.id = ind
                this.setState({ activeScooter: a })
            }
        })
    }

    checkActive = async () => {
        const ccToken = await AsyncStorage.getItem('@cc_token')
        console.log('token in map', ccToken)
        this.props.switchCCToken(ccToken)
    }

    loadScooters = async () => {
        try {
            let res = await API.getScooters()
            for(let scooter of res) {
                scooter.mapCoords = {
                    latitude: scooter.coords.lat,
                    longitude: scooter.coords.lng
                }
            }
            this.setState({scooters: res})
        } catch(err) {
            //TODO: display error message
            console.log(err)
        }
    }

    componentDidMount() {
        this.askPermissions()
        this.checkActive()
        this.loadScooters()
    }

    componentWillUnmount() {
        Geolocation.stopObserving()
    }

    render() {
        return (
            <Fragment>
                <MapView
                    ref={"mapview"}
                    customMapStyle={MapStyle}
                    showsMyLocationButton={false}
                    initialRegion={{
                        latitude: 37.8,
                        longitude: -122.4,
                        latitudeDelta: 0.001,
                        longitudeDelta: 0.001
                    }}
                    style={{ flex: 1 }}
                >
                    <Marker coordinate={{ latitude: this.state.lat, longitude: this.state.lng }}>
                        <UserLocation />
                    </Marker>
                    {
                        this.state.scooters.map((i, ind) =>
                            <ScooterMarker
                                id={i._id}
                                mac={i.mac} 
                                onCalloutPress={this.onCalloutPress}
                                onPress={this.findScooter} 
                                key={ind} 
                                coordinate={i.mapCoords} 
                                title="Unlock" 
                                pinColor={'teal'} />)
                    }
                </MapView>

                <View style={{ position: 'absolute', alignItems: 'flex-end', bottom: 18, right: 12 }}>
                    <CenterButton onPress={this.recenterMap} />
                </View>
                {this.state.activeScooter &&
                    <ScooterPreview
                        name={'Scooter #' + (this.state.activeScooter.mac)}
                        distance={distanceBetween(this.state.lat, this.state.lng, this.state.activeScooter.coords.lat, this.state.activeScooter.coords.lng)}
                        price={this.state.activeScooter.price}
                        battery={this.state.activeScooter.battery}
                    />}
                {this.state.QRScannerOpen &&
                    <QRCodeScanner
                        mac={this.state.activeScooter.mac}
                        price={this.state.activeScooter.price}
                        close={this.closeQRScanner}
                    />}
                {this.props.ccToken ? <ActiveScooter /> :
                    <View />
                }
            </Fragment>
        )
    }
}

function mapStateToProps(state) {
    return { ccToken: state.ccToken }
}

function mapDispatchToProps(dispatch) {
    return { switchCCToken: val => dispatch(switchCCToken(val)) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map)