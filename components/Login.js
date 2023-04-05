/* eslint-disable no-console */
/* eslint-disable prefer-regex-literals */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, StyleSheet, TextInput, Text, Button, Alert, ActivityIndicator,
} from 'react-native';
import * as EmailValidator from 'email-validator';
import { set } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      email: '',
      password: '',
      error: '',
      logged: false,
      passHidden: true,
      // eslint-disable-next-line react/prop-types
      navigation: props.navigation,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: false });
    console.log('Logged in: ', this.state.logged);
    console.log(AsyncStorage.getItem('whatsthat_user_id'));
    console.log(AsyncStorage.getItem('whatsthat_session_token'));
  }

  login = () => {
    const toSend = {
      email: this.state.email,
      password: this.state.password,
    };

    return fetch('http://localhost:3333/api/1.0.0/login/', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toSend),
    })
      .then(async (response) => {
        if (response.status === 200) {
          console.log(response);
          try {
            const responseJson = await response.json();
            await AsyncStorage.setItem('whatsthat_user_id', responseJson.id);
            await AsyncStorage.setItem('whatsthat_session_token', responseJson.token);
            this.setState({ logged: true });
            console.log('Logged in: ', this.state.logged);
            console.log(AsyncStorage.getItem('whatsthat_user_id'));
            console.log(AsyncStorage.getItem('whatsthat_session_token'));
            this.setState({ error: '' });
            this.state.navigation.navigate('MainApp');
          } catch {
            console.log('something went wrong');
          }
        } else if (response.status === 400) {
          this.setState({ error: 'Invalid email/password' });
          console.log('Bad request - Invalid email/password supplied');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  loginButton = () => {
    // validate email and password:
    // check if email and password are not empty
    // check if email is valid
    // check password against regex
    const PASSWORD_REGEX = new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$');

    if (this.state.email === '' || this.state.password === '') {
      this.setState({ error: 'Please enter email and password' });
    } else if (!EmailValidator.validate(this.state.email)) {
      this.setState({ error: 'Please enter a valid email' });
    } else if (!PASSWORD_REGEX.test(this.state.password)) {
      this.setState({
        error: 'Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character '
          + '\n And it must be at least 8 characters long',
      });
    } else {
      console.log('email', this.state.email, 'password', this.state.password);
      this.login();
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <TextInput
          placeholder="email@example.com"
          value={this.state.email}
          onChangeText={(email) => this.setState({ email })}
        />

        <TextInput
          placeholder="********"
          value={this.state.password}
          secureTextEntry
          onChangeText={(password) => this.setState({ password })}
        />

        <Button
          title="Login"
          onPress={() => {
            this.loginButton();
            // console.log('Logged in: ', this.state.logged);
          }}
        />

        <Text style={{ color: 'red' }}>{this.state.error}</Text>
      </View>
    );
  }
}
