import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import {connect } from 'react-redux'
import {View} from 'react-native'

import {switchFirstTime} from './redux/actions/actions'
import Map from './views/Map'
import Onboarding from './views/Onboarding'

class Navigator extends Component {
  componentDidMount() {
    this.isFirstTime()
      .then(val => this.props.switchFirstTime(val))
      .catch(val => this.props.switchFirstTime(val))
  }

  isFirstTime = async () => {
    try {
      const value = await AsyncStorage.getItem('@cc_token')
      if (value == null) return true
      return false
    } catch (e) {
      return true
    }
  }

  render() {
    return <View>{this.props.firstTime? <Onboarding/> : <Map/>}</View>
  }
}

function mapDispatchToProps(dispatch) {
  return {
    switchFirstTime: val => dispatch(switchFirstTime(val))
  }
}

function mapStateToProps(state) {
  return {
    firstTime: state.firstTime
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigator);
