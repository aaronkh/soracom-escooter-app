import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import Colors from './components/common/Colors'
import { reducer } from './redux/reducers/reducers'
import Navigator from './Navigator'

const store = createStore(reducer)

const App = () => <Provider store={store}><Navigator style={{ backgroundColor: Colors.backgroundColor }} /></Provider>

export default App
