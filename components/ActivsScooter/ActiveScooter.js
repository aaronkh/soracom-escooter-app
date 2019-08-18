import React from 'react'
import { View, Dimensions, ActivityIndicator, TouchableWithoutFeedback } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux'

import Shadow from '../common/Shadow'
import Colors from '../common/Colors'
import { Title, Text as DefaultText, Subtitle } from '../common/Text'
import { msToMinutes, minutesToHourString } from '../../util/TimeCalculator'
import { switchCCToken } from '../../redux/actions/actions'

const Text = (props) => <DefaultText {...props} style={{ ...props.style, color: Colors.textColor }}> {props.children} </DefaultText>
const Row = (props) => <View style={{ ...props.style, marginBottom: 8, flexDirection: 'row', alignItems: 'flex-end' }} {...props}>{props.children}</View>
const LeftText = (props) => <Subtitle {...props} style={{ ...props.style, flex: 1, fontSize: 18, color: Colors.textColor }}> {props.children} </Subtitle>

class ActiveScooter extends React.Component {
    constructor(props) {
        super(props)
        let { width, height } = Dimensions.get('window')
        this.state = {
            width: width,
            height: height,
            initalTime: '',
            time: (new Date).getTime(),
            timer: '',
            isSubmitting: false,
            name: '',
            price: '',
        }
    }

    submit = () => {
        this.setState({isSubmitting: true})
        // console.log('submit', parseFloat(msToMinutes(this.state.time - this.state.initalTime) * this.state.price).toFixed(2))
        AsyncStorage.multiRemove([
            '@start_time', '@cc_token', '@scooter_name', '@scooter_price'
        ]).then(setTimeout(() => this.props.switchCCToken(''), 3333))
    }

    updateTime = () => {
        try{
            this.setState({ time: (new Date).getTime() })
        } catch(err) {
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
        let name = await AsyncStorage.getItem('@scooter_name')
        let price = await AsyncStorage.getItem('@scooter_price')
        this.setState({ name: name, price: price / 100 })
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
            <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: this.state.width,
                height: this.state.height,
                backgroundColor: Colors.backgroundColor,
                elevation: 999,
                padding: 30
            }}>
                <Title style={{ color: Colors.accentColorBright, textAlign: 'center', marginBottom: 20 }}>{this.state.name}</Title>
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
            </View>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return { switchCCToken: val => dispatch(switchCCToken(val)) }
}

export default connect(null, mapDispatchToProps)(ActiveScooter)
