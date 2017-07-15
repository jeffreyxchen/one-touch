import React from 'react';
import {

} from 'react-native';
import Initializer from './Initializer';
import { StackNavigator } from 'react-navigation';

class App extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    return(
      <div>Your App Here</div>
      <Initializer/>
    )
  }
}

export default StackNavigator ({
    App: {
        screen: App
    }
}, { initialRouteName: 'App' });
