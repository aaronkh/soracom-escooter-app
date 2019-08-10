import React from 'react'

import { Text, View } from 'react-native'
import { ViewPager } from 'rn-viewpager'

class Onboarding extends React.Component {

    render() {
        return (
            <ViewPager
            style={{height:200}}
            scrollEnabled={false}
        >
            <View style={{backgroundColor:'cadetblue'}}>
                <Text>page one</Text>
            </View>
            <View style={{backgroundColor:'cornflowerblue'}}>
                <Text>page two</Text>
            </View>
            <View style={{backgroundColor:'#1AA094'}}>
                <Text>page three</Text>
            </View>
        </ViewPager>)
    }
}

export default Onboarding