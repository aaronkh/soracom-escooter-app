import React, { Fragment } from 'react'
import Scanner from 'react-native-qrcode-scanner'
import { View, Dimensions, BackHandler } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import Colors from '../common/Colors'
import { Title } from '../common/Text'
import CreditCard from './CreditCard';

class QRCodeScanner extends React.Component {
    constructor(props) {
        super(props)
        let { height, width } = Dimensions.get('window')
        this.state = {
            height: height,
            width: width,
            text: ''
        }
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if(this.state.text.length > 0) {
                this.setState({ text: '' })
            } else {
                this.props.close()
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

    render() {
        return (
            <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: this.state.width,
                height: this.state.height,
                backgroundColor: Colors.backgroundColor,
                elevation: 99
            }}>
                {this.state.text.length > 0 ?
                    <CreditCard scooterName={'Scooter #1'} scooterPrice={'$0.21/min'} submitSuccess={this.props.close}/> :
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
                                onPress={this.props.close}
                            />
                        </View>
                    </Fragment>}
            </View>
        )
    }

}

export default QRCodeScanner