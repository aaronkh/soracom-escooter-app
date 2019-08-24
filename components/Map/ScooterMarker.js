import React from 'react'
import { Marker } from 'react-native-maps'

class ScooterMarker extends React.Component {
    constructor(props) {
        super(props)
    }

    onCalloutPress = () => {
        // performs on callout, but passing in additional infos
    }

    render() {
        return <Marker
            title="Unlock"
            {...this.props}
        />

    }
}

export default ScooterMarker