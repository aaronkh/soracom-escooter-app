import React from 'react'

import { Text, View } from 'react-native'
import { ViewPager } from 'rn-viewpager'

import Form from '../components/Onboarding/Form'
import Welcome from '../components/Onboarding/Welcome';

class Onboarding extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 0
        }
    }
    nextPage = () => {
        let next = this.state.page + 1
        this.refs["viewpager"].setPage(next)
        this.setState({ page: next })
    }
    render() {
        return (
            <ViewPager
                ref="viewpager"
                horizontalScroll={false}
                scrollEnabled={false}
                style={{ flex: 1 }}
                initialPage = {0}
            >
                <View>
                    <Welcome next={this.nextPage} />
                </View>
                <View>
                    <Form/>
                </View>
            </ViewPager>
        )
    }
}

export default Onboarding