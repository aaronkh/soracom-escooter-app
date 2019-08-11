import React from 'react'
import {View } from 'react-native'
import WelcomeImage from './WelcomeImage';
import { Title, Text } from "../common/Text"
import Icon from 'react-native-vector-icons/Ionicons'

const Welcome = (props) =>
    <View 
        style={{ 
            alignItems: 'center', 
            flex: 1, 
            flexDirection: 'column', 
            paddingTop: 30, 
            backgroundColor: "#383b44" }}>
        <Title style={{ color: '#34cdd7', marginBottom: 0 }}>
            Welcome to
        </Title>
        <WelcomeImage />
        <Title style={{ color: '#34cdd7' }}>
            eScooters
        </Title>
        <View style={{flexGrow: 1, justifyContent: 'center'}}>
            <Icon
                name="ios-arrow-round-forward"
                style={{
                    backgroundColor: "#006bb7",
                    padding: 18,
                    paddingTop: 8,
                    paddingBottom: 8,
                    borderRadius: 50,
                    margin: 25,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}
                color="#ccc"
                size={44}
                onPress={props.next}
            />
        </View>
        <Text style={{color: '#34cdd7', marginBottom: 30}}>
            powered by Soracom
        </Text>
    </View>

export default Welcome