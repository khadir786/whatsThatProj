import React, { Component } from 'react';
import {
  Text, View, Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './stylesheets';

class Home extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      navigation: props.navigation,
    };
  }

  componentDidMount() {
    this.checkLogged();
  }

  checkLogged = async () => {
    // change var name 'token' for security
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    if (token != null) {
      this.state.navigation.navigate('MainApp');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>WhatsThat</Text>

        <Button
          title="Login"
          color="#7376AB"
          onPress={() => this.state.navigation.navigate('Login')}
        />

      </View>
    );
  }
}

export default Home;
