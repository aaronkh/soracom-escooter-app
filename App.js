import React from 'react'
import {Provider } from 'react-redux'
import {createStore} from 'redux'
import {View} from 'react-native'

import {reducer} from './redux/reducers/reducers'
import Navigator from './Navigator'

const store = createStore(reducer)

const App = () => <Provider store={store}><Navigator/></Provider>

export default App
