import React, { Component } from 'react';
import {
  Text, View, StyleSheet, Button,
} from 'react-native';

class Home extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Text>Home Screen</Text>

        <Button
          title="Login"
          onPress={() => navigation.navigate('Login')}
        />

        <Button
          title="Sign Up"
          onPress={() => navigation.navigate('Sign Up')}
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
