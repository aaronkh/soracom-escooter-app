import React from 'react'
import { View, TextInput, Text, ActivityIndicator, TouchableWithoutFeedback, Alert } from 'react-native'
import TextInputMask from 'react-native-text-input-mask'
import { CardIOModule } from 'react-native-awesome-card-io'
import Icon from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-community/async-storage'
import { connect } from 'react-redux'

import {switchCCToken} from '../../redux/actions/actions'
import { Title, Subtitle, Text as SmallText } from '../common/Text'
import { Shadow } from '../common/Shadow'
import API from '../../API';

const cleanDigits = (text) => text.replace(/\D/g, '')

class CreditCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            number: '',
            expiration: '',
            cvc: '',
            isSubmitting: false
        }
    }

    scanCard = () => {
        CardIOModule
            .scanCard({
                hideCardIOLogo: true,
                suppressManualEntry: true,
                suppressConfirmation: true,
                guideColor: '#34cdd7'
            })
            .then(card => {
                let exp = `${card.expiryMonth}${card.expiryYear}`
                if (exp === '00') exp = ''
                this.setState({
                    name: card.cardholderName,
                    number: card.cardNumber,
                    cvc: card.cvv,
                    expiration: exp
                })
            }).catch(() => {

            })
    }

    saveName = name => this.setState({ name })
    saveNumber = (_, number) => this.setState({ number })
    saveExpiration = (_, expiration) => this.setState({ expiration })
    saveCVC = cvc => this.setState({ cvc: cleanDigits(cvc) })
    onSubmit = () => {this.props.switchCCToken(this.state.ccToken); this.props.submitSuccess()}

    submit = async () => {
        // put cc token in
        this.setState({ isSubmitting: true })
        try{
            let res = await API.createStripeToken({
                'card[name]': this.state.name,
                'card[number]': this.state.number,
                'card[exp_month]': this.state.expiration.substr(0, 2),
                'card[exp_year]': '20' + this.state.expiration.substr(-2),
                'card[cvc]': this.state.cvc
            })
            
            let json = await res.json()
            let id = json['id']
            let ccToken = await API.startRide({
                'token': id,
                'mac': this.props.mac
            })
            let transactionId = ccToken._id
            console.log('transaction id', transactionId)
            console.log(JSON.stringify(ccToken))
            let scooterId = ccToken.scooterId
            console.log('scooter id', scooterId)
            this.setState({ccToken: transactionId})
            
            let dateArray = ['@start_time', (new Date).getTime().toString()]
            let tokArray = ['@cc_token', transactionId]
            let scooterArray = ['@scooter_id', scooterId]
            await AsyncStorage.multiSet(
                [ dateArray, tokArray, scooterArray ])
             this.onSubmit()
        } catch(err) {
            this.setState({ isSubmitting: false })
            console.log(err)
            Alert.alert(
                'Error starting scooter','',
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ]
            )
        }
    }

    render() {
        return (
            <View style={{
                alignItems: 'stretch',
                flex: 1,
                flexDirection: 'column',
                padding: 10,
                paddingTop: 30,
                backgroundColor: "#383b44"
            }}>
                <Title style={{ color: '#34cdd7', textAlign: 'center' }}>
                    {this.props.scooterName}
                </Title>
                <Subtitle style={{ color: '#34cdd7', textAlign: 'center' }}>
                    {this.props.scooterPrice}
                </Subtitle>
                <View
                    style={{
                        borderColor: "#34cdd7",
                        borderWidth: 0.5,
                        borderRadius: 8,
                        margin: 10,
                        padding: 15,
                        paddingTop: 30,
                        paddingBottom: 33,
                        marginTop: 28
                    }}>
                    <TextInput
                        value={this.state.name}
                        onChangeText={this.saveName}
                        placeholder="Name"
                        placeholderTextColor="#FFFFFF99"
                        underlineColorAndroid="#34cdd7"
                        style={{ color: '#FFFFFFDD' }}
                        multiline={false}
                    />
                    <TextInputMask
                        value={this.state.number}
                        onChangeText={this.saveNumber}
                        mask={'[0000] [0000] [0000] [0000]'}
                        placeholder="Card Number"
                        maxLength={19}
                        autoCompleteType="cc-number"
                        multiline={false}
                        placeholderTextColor="#FFFFFF99"
                        keyboardType="numeric"
                        underlineColorAndroid="#34cdd7"
                        style={{ color: '#FFFFFFDD' }}
                        multiline={false}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ alignSelf: 'flex-end', justifyContent: 'flex-start', flexDirection: 'row', alignContent: 'center' }}>
                            <Text style={{ paddingTop: 12, color: '#FFFFFFDD' }}>Expiry </Text>
                            <TextInputMask
                                placeholder="  /"
                                value={this.state.expiration}
                                onChangeText={this.saveExpiration}
                                mask={'[00]/[00]'}
                                maxLength={5}
                                placeholderTextColor="#FFFFFF99"
                                multiline={false}
                                keyboardType="numeric"
                                underlineColorAndroid="#34cdd7"
                                style={{ color: '#FFFFFFDD' }} />
                        </View>
                        <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                            <Icon
                                onPress={this.scanCard}
                                name="ios-camera"
                                style={{
                                    marginRight: 4,
                                    marginLeft: 8
                                }}
                                color="#ffffffdd"
                                size={32}
                            />
                            <TextInput
                                value={this.state.cvc}
                                onChangeText={this.saveCVC}
                                autoCompleteType="cc-csc"
                                placeholder="CVV"
                                placeholderTextColor="#FFFFFF99"
                                keyboardType="numeric"
                                underlineColorAndroid="#34cdd7"
                                style={{ color: '#FFFFFFDD' }}
                                multiline={false}
                                maxLength={4} />
                        </View>
                    </View>
                </View>
                <SmallText style={{ color: '#34cdd7', textAlign: 'center', marginTop: 20 }}>
                    Enter your credit card info above
                </SmallText>
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
                                marginBottom: 35,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                ...(this.state.isSubmitting ? {} : Shadow)
                            }}>{this.state.isSubmitting ?
                                <ActivityIndicator size="small" color="#FFFFFFDD" /> : <Text style={{ color: '#FFFFFFDD' }}>
                                    Unlock 
                                </Text>}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {switchCCToken: val => dispatch(switchCCToken(val))}
}

export default connect(null, mapDispatchToProps)(CreditCard)
