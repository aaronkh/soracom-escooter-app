import React from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { ShadowStyle } from '../common/Shadow'
import Colors from '../common/Colors'

module.exports = (props) =>
    <TouchableWithoutFeedback onPress={props.onPress}>
        <Icon
            style={{
                ...ShadowStyle,
                backgroundColor: Colors.backgroundColor,
                padding: 12,
                paddingRight: 14, 
                paddingLeft: 14,
                borderRadius: 40
            }}
            name={"md-locate"}
            size={24}
            color={Colors.textColor}
        />
    </TouchableWithoutFeedback>