import { Component } from 'react';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stac';

import { View, StyleSheet } from 'react-native';

import LoginView from './components/Login';
import SignUpView from './components/SignUp';


export default class App extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <NavigationContainer>
        <>
          <View style={styles.container}>
            <LoginView />
          </View>
          <View style={styles.container}>
            <SignUpView />
          </View></>
      </NavigationContainer>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

