import React, { Fragment } from 'react'
import { View, PermissionsAndroid, Text } from 'react-native'
import Geolocation from 'react-native-geolocation-service'
import MapView, {Marker, Callout} from 'react-native-maps'
import {connect} from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'

import Colors from '../components/common/Colors'
import MapStyle from '../components/Map/MapStyle'
import QRScanButton from '../components/Map/QRScanButton'
import CenterButton from '../components/Map/CenterButton'
import Spacer from '../components/common/Spacer'
import UserLocation from '../components/Map/UserLocation'
import ScooterPreview from '../components/Map/ScooterPreview'
import QRCodeScanner from '../components/QRCodeScanner/QRCodeScanner'
import ActiveScooter from '../components/ActivsScooter/ActiveScooter'
import {switchCCToken} from '../redux/actions/actions'

import {distanceBetween} from '../util/DistanceCalculator'

const MAP_ANIMATION_DURATION = 888
const FAKE_SCOOTER_LOCATIONS =[ 
    { _id: 0, longitude: -122.5022639462199, latitude: 37.76872868979763 },
    { _id: 1, longitude: -122.4929547979371, latitude: 37.78290650705166 },
    { _id: 2, longitude: -122.501239215147, latitude: 37.77325481238279 },
    { _id: 3, longitude: -122.48919211437241, latitude: 37.781040306887824 },
    { _id: 4, longitude: -122.50502787240144, latitude: 37.77288140696781 } ]

class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lat: 37.8,
            lng: -122.4,
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
        this.setState({activeScooter: false})
    }

    openQRScanner = () => {
        if (!this.state.gpsActive || !this.state.permissionGPS) return
        this.setState({QRScannerOpen: true})
    }

    closeQRScanner = () => this.setState({QRScannerOpen: false})

    updatePosition = () => {
        Geolocation.watchPosition(
            (position) => {
                if(this.state.firstLocation) 
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
        let lat = location.nativeEvent.coordinate.latitude
        let lng = location.nativeEvent.coordinate.longitude
        await FAKE_SCOOTER_LOCATIONS.map(i=>{
            if(i.longitude == lng && i.latitude == lat) {
                this.setState({activeScooter: i})
            }
        })
    }

    checkActive = async () => {
        const ccToken = await AsyncStorage.getItem('@cc_token')
        this.props.switchCCToken(ccToken)
    }

    componentDidMount() {
        this.askPermissions()
        this.checkActive()
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
                    <Marker coordinate={{latitude: this.state.lat, longitude: this.state.lng}}>
                    <UserLocation/>
                    </Marker>
                    {
                        FAKE_SCOOTER_LOCATIONS.map(i => 
                        <Marker onPress={this.findScooter} key={i._id} coordinate={i} title={`Scooter #` + i._id} pinColor={'teal'} />)
                    }
                </MapView>
                
                <View style={{ position: 'absolute', alignItems: 'flex-end', bottom: 18, right: 12 }}>
                    <CenterButton onPress={this.recenterMap} />
                    <Spacer height={8}/>
                    <QRScanButton onPress={this.openQRScanner} />
                </View>
                {this.state.activeScooter &&  
                <ScooterPreview 
                    name={'Scooter #'+(this.state.activeScooter._id + 1)}
                    distance={distanceBetween(this.state.lat, this.state.lng, this.state.activeScooter.latitude, this.state.activeScooter.longitude)}
                    price="0.21"
                    battery="50"
                />}
               {this.state.QRScannerOpen &&
                <QRCodeScanner
                    close={this.closeQRScanner}
                />}
                {this.props.ccToken? <ActiveScooter/> :
                    <View/>
                }
            </Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {ccToken: state.ccToken}
}

function mapDispatchToProps(dispatch) {
    return {switchCCToken: val => dispatch(switchCCToken(val))}
}

export default connect(mapStateToProps, mapDispatchToProps)(Map)