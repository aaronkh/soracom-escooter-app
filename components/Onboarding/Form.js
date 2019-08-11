import React from 'react'
import { View, TextInput, Text, ActivityIndicator, TouchableWithoutFeedback } from 'react-native'
import TextInputMask from 'react-native-text-input-mask'

import { Title, Subtitle } from '../common/Text'
import { Shadow } from '../common/Shadow'

import { CardIOModule, CardIOUtilities } from 'react-native-awesome-card-io'

const cleanDigits = (text) => text.replace(/\D/g, '')

class Form extends React.Component {
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

    componentWillMount(){
        if(Platform.OS === 'ios'){
            CardIOUtilities.preload()
        }
    }

    scanCard(){
        CardIOModule
            .scanCard({
                hideCardIOLogo: true
            })
            .then(card => {
                console.log(card)
                console.log(card.cardNumber)
                console.log(card.expiryMonth)
                console.log(card.expiryYear)
                console.log(card.cvv)
                console.log(card.cardholderName)
            }).catch(() => {
            
            })
    }        

    saveName = name => this.setState({ name })
    saveNumber = (_, number) => this.setState({ number })
    saveExpiration = (_, expiration) => this.setState({ expiration })
    saveCVC = cvc => this.setState({ cvc: cleanDigits(cvc) })
    submit = () => this.setState({ isSubmitting: true })
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
                    Get Started
                </Title>
                <Subtitle style={{ color: '#34cdd7', textAlign: 'center' }}>
                    Sign up with your credit card
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
                        onChangeText={this.saveNumber}
                        mask={'[00]{/}[00]'}
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
                        <View style={{ justifyContent: 'flex-start', flexDirection: 'row', alignContent: 'center' }}>
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
                                flexDirection: 'row',
                                justifyContent: 'center',
                                ...(this.state.isSubmitting ? {} : Shadow)
                            }}>{this.state.isSubmitting ?
                                <ActivityIndicator size="small" color="#FFFFFFDD" /> : <Text style={{ color: '#FFFFFFDD' }}>
                                    Save
                                </Text>}
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={this.scanCard.bind(this)}>
                        <View
                            style={{
                                backgroundColor: this.state.isSubmitting ? 'grey' : '#006bb7',
                                borderRadius: 12,
                                padding: 12,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                ...(this.state.isSubmitting ? {} : Shadow)
                            }}>
                            <Text style={{ color: '#FFFFFFDD' }}>Scan Card</Text>
                        </View>
                    </TouchableWithoutFeedback>

                </View>
            </View>
        )
    }
}

export default Form
