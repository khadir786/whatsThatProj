import React, { Component } from 'react';
import {
  Text, View, Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/stylesheets';

class Home extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    this.checkLogged();
  }

  checkLogged = async () => {
    // change var name 'token' for security
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    const { navigation } = this.props;
    if (token != null) {
      navigation.navigate('MainApp');
    }
  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Text>WhatsThat</Text>

        <Button
          title="Login"
          color="#7376AB"
          onPress={() => navigation.navigate('Login')}
        />

      </View>
    );
  }
}

export default Home;
