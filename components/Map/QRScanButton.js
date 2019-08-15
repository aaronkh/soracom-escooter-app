import React from 'react'
import { TouchableWithoutFeedback, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Text } from '../common/Text'

import Colors from '../common/Colors'
import { ShadowStyle } from '../common/Shadow'

module.exports = (props) =>
    <TouchableWithoutFeedback onPress={props.onPress} >
        <View style={{
            ...ShadowStyle,
            backgroundColor: Colors.backgroundColor,
            padding: 20,
            paddingTop: 16,
            paddingBottom: 16,
            alignItems: 'center',
            borderRadius: 40,
            flexDirection: 'row',
        }}>


    <Icon name="qrcode-scan" size={24
    } color={Colors.textColor} style={{marginRight: 12}}/>
            <Text style={{color: Colors.textColor}}>Scan QR Code</Text>
        </View>
    </TouchableWithoutFeedback>