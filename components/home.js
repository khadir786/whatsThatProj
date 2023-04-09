import React, { Component } from 'react';
import {
  Text, View, StyleSheet, Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7EBEC',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class Home extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      navigation: props.navigation,

      // eslint-disable-next-line react/prop-types
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
