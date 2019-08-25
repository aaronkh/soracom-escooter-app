import React, { Fragment } from 'react'
import Scanner from 'react-native-qrcode-scanner'
import { View, Dimensions, BackHandler, Animated } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import Colors from '../common/Colors'
import { Title } from '../common/Text'
import CreditCard from './CreditCard';

class QRCodeScanner extends React.Component {
    constructor(props) {
        super(props)
        let { height, width } = Dimensions.get('window')
        this.state = {
            position: new Animated.Value(height),
            height: height,
            width: width,
            text: ''
        }
    }

    componentDidMount() {
        console.log(this.props.mac)
        Animated.timing(
            this.state.position,
            {
                toValue: 0,
                velocity: 333,
            }
        ).start()
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.state.text.length > 0) {
                this.setState({ text: '' })
            } else {
                this.close()
            }
            return true;
        });
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    onRead = (text) => {
        console.log("qr code scanned", text)
        if (text.type === 'QR_CODE')
            this.setState({ text: text.data })
    }

    close = () => {
        Animated.timing(
            this.state.position,
            {
                toValue: this.state.height,
                velocity: 333,
            }
        ).start(this.props.close)
    }

    render() {
        return (
            <Animated.View style={{
                position: 'absolute',
                top: this.state.position,
                left: 0,
                width: this.state.width,
                height: this.state.height,
                backgroundColor: Colors.backgroundColor,
                elevation: 99
            }}>
                {this.state.text.length > 0 ?
                    <CreditCard
                        mac={this.props.mac}
                        scooterName={'Scooter #' + this.props.mac}
                        scooterPrice={`$${(this.props.price / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}/min`}
                        submitSuccess={this.props.close} /> :
                    <Fragment>
                        <Title style={{ margin: 20, textAlign: 'center', color: Colors.accentColorBright }}>Scan to Unlock</Title>
                        <Scanner
                            cameraStyle={{ width: this.state.width - 80, height: this.state.width - 80, overflow: 'hidden' }}
                            containerStyle={{ margin: 40 }}
                            checkAndroid6Permissions={true}
                            vibrate={false}
                            onRead={this.onRead}
                        />
                        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                            <Icon
                                name={'md-arrow-down'}
                                size={48}
                                color={Colors.textColor}
                                onPress={this.close}
                            />
                        </View>
                    </Fragment>}
            </Animated.View>
        )
    }

}

export default QRCodeScanner