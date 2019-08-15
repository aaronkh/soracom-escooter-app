import React from 'react'
import { View, Dimensions } from 'react-native'

import { Text as DefaultText, Subtitle } from '../common/Text'
import Colors from '../common/Colors'
import ShadowStyle from '../common/Shadow'

const Text = (props) => <DefaultText  {...props} style={{...props.style, color: Colors.textColor }} > {props.children} </DefaultText>
const Row = (props) => <View style={{ ...props.style, marginBottom: 8, flexDirection: 'row', alignItems: 'flex-end' }} {...props}>{props.children}</View>
const LeftText = (props) => <Text {...props} style={{...props.style, flex: 1, fontSize: 18}}> {props.children} </Text>

class ScooterPreview extends React.Component {
    constructor(props) {
        super(props)
        let { height, width } = Dimensions.get('window')
        let distanceText = ' miles away'
        if(props.distance < 0.01) {
            distanceText = Math.round(props.distance * 5280) + ' feet away'
        } else {
            distanceText = parseFloat(props.distance).toFixed(2) + ' feet away'
        }
        this.state = {
            width: width > height ? height - 20 : width - 20,
            distanceText: distanceText
        }
    }

    render() {
        return (
            <View style={{
                position: 'absolute',
                top: 0,
                margin: 10,
                width: this.state.width,
                backgroundColor: Colors.backgroundColor,
                padding: 16,
                borderRadius: 8,
                ...ShadowStyle
            }}>
                <Row>
                    <LeftText style={{fontSize: 32, fontWeight: 'bold'}}>{this.props.name}</LeftText>
                    <Text>
                        {this.state.distanceText}
                    </Text>
                </Row>
                <Row>
                    <LeftText>Price</LeftText>
                    <Text>
                        {this.props.price}/min
                    </Text>
                </Row>
                <Row>
                    <LeftText>
                        Battery
                    </LeftText>
                    <Text>
                        {this.props.battery}%
                    </Text>
                </Row>
            </View>
        )
    }
}

export default ScooterPreview