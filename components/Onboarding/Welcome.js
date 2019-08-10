import React from 'react'
import {Text, TouchableHighlight, View, Image} from 'react-native'

const Welcome = () => 
<View>
    <Text>
        Welcome to
    </Text>
    <Image source = {require('../../assets/img/welcome.png')}/>

    <Text>
        eScooters
    </Text>
    <Text>
        powered by Soracom
    </Text>
    <TouchableHighlight onPress={props.next}>
        <Text>
            next
        </Text>
    </TouchableHighlight>
</View>

export default Welcome