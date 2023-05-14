/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-console */
/* eslint-disable prefer-regex-literals */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, TextInput, Text, Button, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import * as EmailValidator from 'email-validator';
import crypto from 'crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustModal from './custModal';
import { styles } from './stylesheets';

export default class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      email: '',
      password: '',
      error: '',
      logged: false,
      // eslint-disable-next-line react/prop-types
      navigation: props.navigation,
      isModalVisible: false,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: false });
    this.setState({ error: '' });
    console.log('Logged in: ', this.state.logged);
    console.log(AsyncStorage.getItem('whatsthat_user_id'));
    console.log(AsyncStorage.getItem('whatsthat_session_token'));
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      isModalVisible: !prevState.isModalVisible,
    }));
  };

  hashPassword = (password, salt) => {
    let hash = crypto.pbkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
    hash += 'p1L!ow';
    // Sanitise hash
    return hash.replace(/[^a-zA-Z0-9!@#$%^&*]/g, '');
  };

  login = async () => {
    const pass = this.hashPassword(this.state.password, 'SavourySalt');
    const toSend = {
      email: this.state.email,
      password: pass,
    };

    return fetch('http://localhost:3333/api/1.0.0/login/', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toSend),
    })
      .then(async (response) => {
        this.setState({ isLoading: false });
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
          this.toggleModal();
          console.log('Bad request - Invalid email/password supplied');
          console.log(pass);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  loginButton = () => {
    const PASSWORD_REGEX = new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$');

    if (this.state.email === '' || this.state.password === '') {
      this.setState({ error: 'Please enter email and password' });
      this.toggleModal();
    } else if (!EmailValidator.validate(this.state.email)) {
      this.setState({ error: 'Please enter a valid email' });
      this.toggleModal();
    } else if (!PASSWORD_REGEX.test(this.state.password)) {
      this.setState({
        error: 'Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character '
          + '\n And it must be at least 8 characters long',
      });
      this.toggleModal();
    } else {
      console.log('email', this.state.email, 'password', this.state.password);
      this.setState({ isLoading: true });
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

    const { error, isModalVisible } = this.state;

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="email@example.com"
          value={this.state.email}
          onChangeText={(email) => this.setState({ email })}
        />

        <TextInput
          style={styles.input}
          placeholder="********"
          value={this.state.password}
          secureTextEntry
          onChangeText={(password) => this.setState({ password })}
        />

        <Button title="Login" color="#7376AB" onPress={this.loginButton} />

        <TouchableOpacity
          style={{ backgroundColor: 'transparent' }}
          onPress={() => this.state.navigation.navigate('Sign Up')}
        >
          <Text style={{ color: '#7376AB' }}>Don't have an account?</Text>
        </TouchableOpacity>

        {/* <Text style={{ color: 'red' }}>{this.state.error}</Text> */}

        <CustModal
          error={error}
          isVisible={isModalVisible}
          toggleModal={this.toggleModal}
          duration={3000}
        />
      </View>
    );
  }
}
