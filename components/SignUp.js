/* eslint-disable no-console */
/* eslint-disable prefer-regex-literals */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, TextInput, Text, Button, ActivityIndicator,
} from 'react-native';
import * as EmailValidator from 'email-validator';
import crypto from 'crypto';
import { handleShowToast } from './toastUtils';
import { styles } from './stylesheets';

export default class SignUpView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      error: '',
      // eslint-disable-next-line react/prop-types
      navigation: props.navigation,
    };
  }

  addUser = async (hashedPassword) => {
    const toSend = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      password: hashedPassword,
    };

    return fetch('http://localhost:3333/api/1.0.0/user/', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toSend),
    })
      .then((response) => {
        if (response.status === 201) {
          this.setState({ isLoading: false });
          console.log('User added');
          console.log('First Name: ', this.state.firstName, 'Last Name: ', this.state.lastName);
          console.log('Email: ', this.state.email, 'Password: ', this.state.password);
          this.state.navigation.navigate('Login');
        } else if (response.status === 400) {
          this.setState({ error: 'Bad Request' });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  hashPassword = (password, salt) => {
    let hash = crypto.pbkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
    hash += 'p1L!ow';
    // Sanitise hash
    return hash.replace(/[^a-zA-Z0-9!@#$%^&*]/g, '');
  };

  validateAndHash = async (email, password, firstName, lastName) => {
    const PASSWORD_REGEX = new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$');
    const NAME_REGEX = new RegExp("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$");

    if (email === '' || password === '' || firstName === '' || lastName === '') {
      this.setState({ error: 'Please fill in each field' });
    } else if (!NAME_REGEX.test(firstName)) {
      this.setState({ error: 'Please enter a valid first name' });
    } else if (!NAME_REGEX.test(lastName)) {
      this.setState({ error: 'Please enter a valid last name' });
    } else if (!EmailValidator.validate(email)) {
      this.setState({ error: 'Please enter a valid email' });
    } else if (!PASSWORD_REGEX.test(password)) {
      this.setState({
        error: 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character '
          + 'and it must be at least 8 characters long',
      });
    } else {
      this.setState({ error: '' });
      console.log('Successful Validation');
      try {
        const hashedPassword = this.hashPassword(password, 'SavourySalt');
        console.log(hashedPassword);
        return hashedPassword;
      } catch (error) {
        console.log('Error hashing password:', error);
      }
    }
    console.log('Validation Failed');
    return null;
  };

  signUp = async () => {
    try {
      const hashedPassword = await this.validateAndHash(
        this.state.email,
        this.state.password,
        this.state.firstName,
        this.state.lastName,
      );

      if (hashedPassword !== null) {
        this.setState({ isLoading: true });
        this.addUser(hashedPassword);
      }
      console.log('First Name:', this.state.firstName, 'Last Name:', this.state.lastName, 'Email:', this.state.email, 'Password:', this.state.password);
    } catch (error) {
      console.log(error);
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
          style={styles.input}
          placeholder="First Name"
          value={this.state.firstName}
          onChangeText={(firstName) => this.setState({ firstName })}
        />

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={this.state.lastName}
          onChangeText={(lastName) => this.setState({ lastName })}
        />

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

        <Button title="Sign Up" color="#7376AB" onPress={this.signUp} />

        <Text style={{ color: 'red' }}>{this.state.error}</Text>
      </View>
    );
  }
}
