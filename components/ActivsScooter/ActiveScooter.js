import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, TouchableWithoutFeedback, View } from 'react-native';
import { connect } from 'react-redux';
import API from '../../API';
import { switchCCToken } from '../../redux/actions/actions';
import { minutesToHourString, msToMinutes } from '../../util/TimeCalculator';
import Colors from '../common/Colors';
import Shadow from '../common/Shadow';
import { Subtitle, Text as DefaultText, Title } from '../common/Text';


const Text = (props) => <DefaultText {...props} style={{ ...props.style, color: Colors.textColor }}> {props.children} </DefaultText>
const Row = (props) => <View style={{ ...props.style, marginBottom: 8, flexDirection: 'row', alignItems: 'flex-end' }} {...props}>{props.children}</View>
const LeftText = (props) => <Subtitle {...props} style={{ ...props.style, flex: 1, fontSize: 18, color: Colors.textColor }}> {props.children} </Subtitle>

class ActiveScooter extends React.Component {
    constructor(props) {
        super(props)
        let { width, height } = Dimensions.get('window')
        this.state = {
            position: new Animated.Value(0),
            width: width,
            height: height,
            initalTime: (new Date).getTime(),
            time: (new Date).getTime(),
            timer: '',
            isSubmitting: true,
            name: 'Loading...',
            price: '999',
        }
    }

    transition = () => this.props.switchCCToken('')

    submit = async () => {
        this.setState({ isSubmitting: true })
        try {
            await API.stopRide(this.state.ccToken)
            await AsyncStorage.multiRemove([
                '@cc_token', '@scooter_id', '@start_time'
            ])
            Animated.timing(
                this.state.position,
                {
                    toValue: this.state.height,
                    velocity: 333,
                }
            ).start(() => this.transition)
        } catch (err) {
            Alert.alert(
                'Error ending ride', '',
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ]
            )
            this.setState({ isSubmitting: false })
        }
    }

    updateTime = () => {
        try {
            this.setState({ time: (new Date).getTime() })
        } catch (err) {
            console.log(err)
        }
    }

    getTime = async () => {
        const initalTime = await AsyncStorage.getItem('@start_time')
        if (this.state.timer) return
        this.setState({
            initalTime: initalTime,
            timer: setInterval(this.updateTime, 5000)
        })
    }

    getProps = async () => {
        let id = await AsyncStorage.getItem('@scooter_id')
        let token = await AsyncStorage.getItem('@cc_token')
        console.log('id', id)
        console.log('token', token)
        // ask server for this...
        let scooter = await API.findById(id)
        console.log(scooter)
        let name = "Scooter #" + scooter.mac
        let price = scooter.price
        this.setState({ isSubmitting: false, name: name, price: price / 100, ccToken: token })
    }

    componentWillUnmount() {
        clearInterval(this.state.timer)
    }

    componentDidMount() {
        this.getTime()
        this.getProps()
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
                elevation: 999,
                padding: 30
            }}>
                <Title style={{ color: Colors.accentColorBright, textAlign: 'center', marginBottom: 20 }}>
                    {this.state.name}
                </Title>
                <Row>
                    <LeftText>Price</LeftText>
                    <Text>${this.state.price}/min</Text>
                </Row>
                <Row>
                    <LeftText>Time</LeftText>
                    <Text>{minutesToHourString(msToMinutes(this.state.time - this.state.initalTime))}</Text>
                </Row>
                <Row>
                    <LeftText>Total</LeftText>
                    <Text>${parseFloat(msToMinutes(this.state.time - this.state.initalTime) * this.state.price).toFixed(2)}</Text>
                </Row>

                <View style={{
                    flexGrow: 1,
                    textAlign: 'center',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    marginBottom: 12
                }}>
                    <TouchableWithoutFeedback
                        onPress={this.submit}>
                        <View
                            style={{
                                backgroundColor: this.state.isSubmitting ? 'grey' : '#006bb7',
                                borderRadius: 12,
                                padding: 12,
                                marginBottom: 12,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                ...(this.state.isSubmitting ? {} : Shadow)
                            }}>{this.state.isSubmitting ?
                                <ActivityIndicator size="small" color="#FFFFFFDD" /> : <DefaultText style={{ color: '#FFFFFFDD' }}>
                                    End Ride
                                </DefaultText>}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </Animated.View>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return { switchCCToken: val => dispatch(switchCCToken(val)) }
}

export default connect(null, mapDispatchToProps)(ActiveScooter)
