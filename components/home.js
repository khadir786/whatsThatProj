import React, { Component } from 'react';
import {
  Text, View, StyleSheet, Button,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        <Text>Home Screen</Text>

        <Button
          title="Login"
          onPress={() => this.state.navigation.navigate('Login')}
        />

        <Button
          title="Sign Up"
          onPress={() => this.state.navigation.navigate('Sign Up')}
        />
      </View>
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

export default Home;
