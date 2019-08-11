import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { connect } from 'react-redux'
import { View } from 'react-native'

import { switchFirstTime } from './redux/actions/actions'
import Map from './views/Map'
import Onboarding from './views/Onboarding'

class Navigator extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasChecked: false
    }
  }

  componentDidMount() {
    const finishLoad = (val) => {
      this.setState({hasChecked: true})
      this.props.switchFirstTime(val)
    }
    this.isFirstTime()
      .then(finishLoad)
      .catch(finishLoad)
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
    if(!this.state.hasChecked) return <View style={{flex: 1, backgroundColor: '#383b44'}}/>
    return this.props.firstTime ? <Onboarding /> : <Map />
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
