import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Colors from './components/common/Colors';
import { reducer } from './redux/reducers/reducers';
import Map from './views/Map';


const store = createStore(reducer)

const App = () => 
<Provider store={store}>
    <Map style={{ backgroundColor: Colors.backgroundColor }} />
</Provider>

export default App
